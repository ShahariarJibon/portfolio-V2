import fs from "fs";
import path from "path";
import crypto from "crypto";
import { getSupabase } from "./supabase.js";
import { DEFAULT_WORKS } from "./defaultWorks.js";

export { DEFAULT_WORKS };

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "works.json");

// Pure direct disk read. If data/works.json exists, return it (even if empty array).
function readDataFile() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, "utf8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("[worksStore] Error reading data/works.json:", err.message);
  }

  // If file doesn't exist yet, seed it with DEFAULT_WORKS
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_WORKS, null, 2), "utf8");
  } catch (err) {
    console.warn("[worksStore] Error seeding data/works.json:", err.message);
  }

  return [...DEFAULT_WORKS];
}

// Pure direct disk write.
function writeDataFile(data) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
    console.log(`[worksStore] Saved ${data.length} works to ${DATA_FILE}`);
  } catch (err) {
    console.warn("[worksStore] Error writing data/works.json:", err.message);
  }

  // Also write to /tmp if available (e.g. Linux/serverless)
  try {
    const tmpFile = "/tmp/portfolio_works.json";
    fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), "utf8");
  } catch {}
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
function isUUID(str) {
  return typeof str === "string" && UUID_REGEX.test(str.trim());
}

// Optional best-effort background sync to Supabase (never blocks or overwrites disk)
async function syncToSupabase(fn) {
  try {
    const supabase = getSupabase();
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Supabase timeout")), 1200)
    );
    await Promise.race([fn(supabase), timeoutPromise]);
  } catch {
    // Supabase unavailable or timed out — silently ignore, disk is source of truth
  }
}

export async function getAllWorks({ publishedOnly = false } = {}) {
  const works = readDataFile();
  const sorted = [...works].sort(
    (a, b) => (Number(a.sort_order) || 0) - (Number(b.sort_order) || 0)
  );

  if (publishedOnly) {
    return sorted.filter((w) => w.published !== false);
  }
  return sorted;
}

export async function getWorkById(id) {
  const idStr = decodeURIComponent(String(id)).trim();
  const list = readDataFile();
  return (
    list.find(
      (w) =>
        String(w.id).trim() === idStr ||
        String(w.id).trim().toLowerCase() === idStr.toLowerCase()
    ) || null
  );
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

  const updated = [...list, newWork];
  writeDataFile(updated);

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
  const idStr = decodeURIComponent(String(id)).trim();
  const list = readDataFile();
  const index = list.findIndex(
    (w) =>
      String(w.id).trim() === idStr ||
      String(w.id).trim().toLowerCase() === idStr.toLowerCase()
  );

  if (index === -1) {
    throw new Error(`Work item not found (id: ${idStr})`);
  }

  const current = list[index];
  const updatedItem = {
    ...current,
    ...updates,
    updated_at: new Date().toISOString(),
  };

  const nextWorks = [...list];
  nextWorks[index] = updatedItem;
  writeDataFile(nextWorks);

  syncToSupabase(async (sb) => {
    if (isUUID(idStr)) {
      await sb.from("works").update(updates).eq("id", idStr);
    } else if (current?.title) {
      await sb.from("works").update(updates).eq("title", current.title);
    }
  });

  return updatedItem;
}

export async function deleteWork(id) {
  const idStr = decodeURIComponent(String(id)).trim();
  const list = readDataFile();
  const targetIndex = list.findIndex(
    (w) =>
      String(w.id).trim() === idStr ||
      String(w.id).trim().toLowerCase() === idStr.toLowerCase()
  );

  if (targetIndex === -1) {
    console.warn(`[worksStore] Work with ID '${idStr}' not found in:`, list.map((w) => w.id));
    return { success: false, deleted: false, message: "Work item not found" };
  }

  const target = list[targetIndex];
  const filtered = list.filter((_, idx) => idx !== targetIndex);
  writeDataFile(filtered);
  console.log(`[worksStore] Deleted '${target.title}' (${idStr}). Remaining: ${filtered.length}`);

  syncToSupabase(async (sb) => {
    if (isUUID(idStr)) {
      await sb.from("works").delete().eq("id", idStr);
    }
    if (target?.title) {
      await sb.from("works").delete().eq("title", target.title);
    }
  });

  return { success: true, deleted: true, remaining: filtered.length };
}
