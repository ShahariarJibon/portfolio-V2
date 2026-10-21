import fs from "fs";
import path from "path";
import crypto from "crypto";
import { getSupabase } from "./supabase.js";
import { DEFAULT_WORKS } from "./defaultWorks.js";

export { DEFAULT_WORKS };

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "works.json");

// Determine writable tmp directory (Vercel = /tmp, local = project data dir)
let TMP_FILE = null;
try {
  const tmpDir = "/tmp";
  if (fs.existsSync(tmpDir)) {
    TMP_FILE = path.join(tmpDir, "portfolio_works.json");
  }
} catch {}

// --- Pure disk read, NO memory cache ---
// This ensures every request sees the latest state regardless of module isolation
function readDataFile() {
  // Priority 1: /tmp (Vercel warm lambda or cross-process writes on Linux)
  if (TMP_FILE) {
    try {
      if (fs.existsSync(TMP_FILE)) {
        const parsed = JSON.parse(fs.readFileSync(TMP_FILE, "utf8"));
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
  }

  // Priority 2: data/works.json (local dev / committed fallback)
  try {
    if (fs.existsSync(DATA_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } else {
      // Seed the file if it doesn't exist yet
      try {
        if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
        fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_WORKS, null, 2), "utf8");
      } catch {}
    }
  } catch (err) {
    console.warn("[worksStore] readDataFile warning:", err.message);
  }

  return [...DEFAULT_WORKS];
}

function writeDataFile(data) {
  // Always write to BOTH locations atomically so any reader gets fresh data
  const json = JSON.stringify(data, null, 2);

  // Write to project data/works.json
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(DATA_FILE, json, "utf8");
    console.log("[worksStore] Wrote", data.length, "works to", DATA_FILE);
  } catch (err) {
    console.warn("[worksStore] data/works.json write warning:", err.message);
  }

  // Write to /tmp (Vercel serverless)
  if (TMP_FILE) {
    try {
      fs.writeFileSync(TMP_FILE, json, "utf8");
    } catch {}
  }
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
function isUUID(str) {
  return typeof str === "string" && UUID_REGEX.test(str);
}

// Supabase sync (background, non-blocking, best-effort)
async function syncToSupabase(fn) {
  try {
    const supabase = getSupabase();
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Supabase timeout")), 1500)
    );
    await Promise.race([fn(supabase), timeoutPromise]);
  } catch {
    // Supabase unavailable — silently ignore
  }
}

export async function getAllWorks({ publishedOnly = false } = {}) {
  // Try Supabase first (authoritative source when available)
  try {
    const supabase = getSupabase();
    let query = supabase.from("works").select("*").order("sort_order", { ascending: true });
    if (publishedOnly) query = query.eq("published", true);

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Supabase timeout")), 1500)
    );

    const { data, error } = await Promise.race([query, timeoutPromise]);
    if (!error && Array.isArray(data) && data.length > 0) {
      // Keep local file in sync with Supabase (so offline reads are fresh too)
      if (!publishedOnly) writeDataFile(data);
      return data;
    }
  } catch {
    // Fall through to local
  }

  // Fall back to local file (no memory cache — always fresh disk read)
  const works = readDataFile();
  if (publishedOnly) return works.filter((w) => w.published !== false);
  return [...works].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
}

export async function getWorkById(id) {
  const idStr = String(id);
  return readDataFile().find((w) => String(w.id) === idStr) || null;
}

export async function createWork(item) {
  const list = readDataFile();
  const newId = crypto.randomUUID();
  const newWork = {
    id: newId,
    title: item.title?.trim() || "Untitled",
    description: item.description ? String(item.description).trim() : null,
    image_url: item.image_url ? String(item.image_url).trim() : null,
    image_data: item.image_data || null,
    tag_lines: Array.isArray(item.tag_lines) ? item.tag_lines : [],
    demo_url: item.demo_url ? String(item.demo_url).trim() : null,
    code_url: item.code_url ? String(item.code_url).trim() : null,
    sort_order: Number(item.sort_order) || 0,
    published: item.published ?? true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  writeDataFile([...list, newWork]);

  syncToSupabase((sb) =>
    sb.from("works").insert({
      id: newId,
      title: newWork.title,
      description: newWork.description,
      image_url: newWork.image_url,
      image_data: newWork.image_data,
      tag_lines: newWork.tag_lines,
      demo_url: newWork.demo_url,
      code_url: newWork.code_url,
      sort_order: newWork.sort_order,
      published: newWork.published,
    })
  );

  return newWork;
}

export async function updateWork(id, updates) {
  const idStr = String(id);
  const list = readDataFile();
  const index = list.findIndex((w) => String(w.id) === idStr);
  if (index === -1) throw new Error("Work item not found");

  const updatedItem = { ...list[index], ...updates, updated_at: new Date().toISOString() };
  const nextWorks = [...list];
  nextWorks[index] = updatedItem;
  writeDataFile(nextWorks);

  syncToSupabase((sb) => {
    if (isUUID(idStr)) return sb.from("works").update(updates).eq("id", idStr);
    if (list[index]?.title) return sb.from("works").update(updates).eq("title", list[index].title);
  });

  return updatedItem;
}

export async function deleteWork(id) {
  const idStr = String(id);
  const list = readDataFile();
  const target = list.find((w) => String(w.id) === idStr);
  const filtered = list.filter((w) => String(w.id) !== idStr);
  writeDataFile(filtered);

  syncToSupabase((sb) => {
    if (isUUID(idStr)) return sb.from("works").delete().eq("id", idStr);
    if (target?.title) return sb.from("works").delete().eq("title", target.title);
  });

  return { success: true, deleted: list.length !== filtered.length };
}
