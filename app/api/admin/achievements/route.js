import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { validateToken } from "@/lib/auth";
import { DEFAULT_ACHIEVEMENTS } from "@/app/api/achievements/route";

function isAuthed(request) {
  const token = request.cookies.get("admin_token")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");
  return token && validateToken(token);
}

export async function GET(request) {
  if (!isAuthed(request))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const supabase = getSupabase();

    const fetchPromise = supabase
      .from("achievements")
      .select("*")
      .order("sort_order", { ascending: true });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), 1500)
    );

    const { data, error } = await Promise.race([fetchPromise, timeoutPromise]);
    if (!error && data && data.length > 0) {
      return NextResponse.json({ achievements: data });
    }
    return NextResponse.json({ achievements: DEFAULT_ACHIEVEMENTS });
  } catch {
    return NextResponse.json({ achievements: DEFAULT_ACHIEVEMENTS });
  }
}

export async function POST(request) {
  if (!isAuthed(request))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { title, description, sort_order } = body;
    if (!title || typeof title !== "string")
      return NextResponse.json({ error: "Title is required" }, { status: 400 });

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("achievements")
      .insert({
        title: title.trim(),
        description: description ? String(description).trim() : null,
        sort_order: Number(sort_order) || 0,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ achievement: data });
  } catch (error) {
    console.error("Admin achievements POST error:", error);
    return NextResponse.json({ error: "Failed to save achievement" }, { status: 500 });
  }
}
