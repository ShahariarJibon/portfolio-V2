import fs from "fs";
import path from "path";
import crypto from "crypto";
import { getSupabase } from "./supabase.js";
import { DEFAULT_WORKS } from "./defaultWorks.js";

export { DEFAULT_WORKS };

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "works.json");
const TMP_FILE = path.join("/tmp", "works.json");

let memoryCache = null;

function readDataFile() {
  // 1. Try reading from /tmp/works.json (for serverless environments like Vercel)
  try {
    if (fs.existsSync(TMP_FILE)) {
      const content = fs.readFileSync(TMP_FILE, "utf8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        memoryCache = parsed;
        return parsed;
      }
    }
  } catch {}

  // 2. Try reading from project data/works.json
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, "utf8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        memoryCache = parsed;
        return parsed;
      }
    } else {
      try {
        if (!fs.existsSync(DATA_DIR)) {
          fs.mkdirSync(DATA_DIR, { recursive: true });
        }
        fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_WORKS, null, 2), "utf8");
      } catch {}
    }
  } catch (err) {
    console.warn("worksStore read warning:", err.message);
  }

  if (memoryCache && Array.isArray(memoryCache)) {
    return memoryCache;
  }

  memoryCache = [...DEFAULT_WORKS];
  return memoryCache;
}

function writeDataFile(data) {
  memoryCache = data;

  // Write to project data/works.json (localhost & build output)
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    // Read-only filesystem on Vercel
  }

  // Also write to /tmp/works.json (persists across warm requests on Vercel serverless)
  try {
    fs.writeFileSync(TMP_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch {}
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
function isUUID(str) {
  return typeof str === "string" && UUID_REGEX.test(str);
}

export async function getAllWorks({ publishedOnly = false } = {}) {
  const localWorks = readDataFile();

  // Background attempt to query Supabase if reachable
  try {
    const supabase = getSupabase();
    let query = supabase.from("works").select("*").order("sort_order", { ascending: true });
    if (publishedOnly) {
      query = query.eq("published", true);
    }

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Supabase timeout")), 1500)
    );

    const { data, error } = await Promise.race([query, timeoutPromise]);
    if (!error && Array.isArray(data) && data.length > 0) {
      if (!publishedOnly) {
        writeDataFile(data);
      }
      return data;
    }
  } catch {
    // Supabase unavailable or timed out; use persistent local store
  }

  let works = localWorks;
  if (publishedOnly) {
    works = works.filter((w) => w.published !== false);
  }
  return [...works].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
}

export async function getWorkById(id) {
  const idStr = String(id);
  const list = readDataFile();
  const found = list.find((w) => String(w.id) === idStr);
  return found || null;
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

  // Background attempt to save to Supabase if reachable
  try {
    const supabase = getSupabase();
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 2000));
    await Promise.race([
      supabase.from("works").insert({
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
      }),
      timeoutPromise,
    ]);
  } catch {
    // Non-fatal
  }

  return newWork;
}

export async function updateWork(id, updates) {
  const idStr = String(id);
  const list = readDataFile();
  const index = list.findIndex((w) => String(w.id) === idStr);
  if (index === -1) {
    throw new Error("Work item not found");
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

  // Background attempt to update Supabase
  try {
    const supabase = getSupabase();
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 2000));
    let updatePromise = null;
    if (isUUID(idStr)) {
      updatePromise = supabase.from("works").update(updates).eq("id", idStr);
    } else if (current?.title) {
      updatePromise = supabase.from("works").update(updates).eq("title", current.title);
    }
    if (updatePromise) {
      await Promise.race([updatePromise, timeoutPromise]);
    }
  } catch {
    // Non-fatal
  }

  return updatedItem;
}

export async function deleteWork(id) {
  const idStr = String(id);
  const list = readDataFile();
  const workToDelete = list.find((w) => String(w.id) === idStr);
  const initialCount = list.length;
  const filtered = list.filter((w) => String(w.id) !== idStr);
  writeDataFile(filtered);

  // Background attempt to delete from Supabase if reachable
  try {
    const supabase = getSupabase();
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 2000));
    let deletePromise = null;
    if (isUUID(idStr)) {
      deletePromise = supabase.from("works").delete().eq("id", idStr);
    } else if (workToDelete?.title) {
      deletePromise = supabase.from("works").delete().eq("title", workToDelete.title);
    }
    if (deletePromise) {
      await Promise.race([deletePromise, timeoutPromise]);
    }
  } catch {
    // Non-fatal
  }

  return { success: true, deleted: initialCount !== filtered.length };
}
