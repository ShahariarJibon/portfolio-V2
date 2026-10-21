import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { validateToken } from "@/lib/auth";
import { DEFAULT_WORKS } from "@/app/api/works/route";

export async function GET(request) {
  const token = request.cookies.get("admin_token")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token || !validateToken(token))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const supabase = getSupabase();

    const fetchPromise = supabase
      .from("works")
      .select("*")
      .order("sort_order", { ascending: true });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), 1500)
    );

    const { data, error } = await Promise.race([fetchPromise, timeoutPromise]);
    if (!error && data && data.length > 0) {
      return NextResponse.json({ works: data });
    }
    return NextResponse.json({ works: DEFAULT_WORKS });
  } catch {
    return NextResponse.json({ works: DEFAULT_WORKS });
  }
}

export async function POST(request) {
  const token = request.cookies.get("admin_token")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token || !validateToken(token))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { title, description, image_url, image_data, tag_lines, demo_url, code_url, sort_order, published } = body;
    if (!title || typeof title !== "string")
      return NextResponse.json({ error: "Title is required" }, { status: 400 });

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("works")
      .insert({
        title: title.trim(),
        description: description ? String(description).trim() : null,
        image_url: image_url ? String(image_url).trim() : null,
        image_data: image_data || null,
        tag_lines: Array.isArray(tag_lines) ? tag_lines : [],
        demo_url: demo_url ? String(demo_url).trim() : null,
        code_url: code_url ? String(code_url).trim() : null,
        sort_order: Number(sort_order) || 0,
        published: published ?? true,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ work: data });
  } catch (error) {
    console.error("Admin works POST error:", error);
    return NextResponse.json({ error: "Failed to save project work" }, { status: 500 });
  }
}
