import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { validateToken } from "@/lib/auth";
import { DEFAULT_BLOGS } from "@/app/api/blogs/route";

export async function GET(request) {
  const token =
    request.cookies.get("admin_token")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token || !validateToken(token))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const supabase = getSupabase();
    const fetchPromise = supabase
      .from("blogs")
      .select("*")
      .order("created_at", { ascending: false });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), 1500)
    );

    const { data, error } = await Promise.race([fetchPromise, timeoutPromise]);
    if (!error && data && data.length > 0) {
      return NextResponse.json({ blogs: data });
    }
    return NextResponse.json({ blogs: DEFAULT_BLOGS });
  } catch {
    return NextResponse.json({ blogs: DEFAULT_BLOGS });
  }
}

export async function POST(request) {
  const token =
    request.cookies.get("admin_token")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token || !validateToken(token))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { title, content, cover_images, tag_lines, published } = body;
    if (!title || typeof title !== "string" || !content || typeof content !== "string")
      return NextResponse.json({ error: "Title and content required" }, { status: 400 });

    const slug = title
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("blogs")
      .insert({
        title: title.trim(),
        slug: slug || "post",
        content: content.trim(),
        cover_images: Array.isArray(cover_images) ? cover_images : [],
        tag_lines: Array.isArray(tag_lines) ? tag_lines : [],
        published: published ?? true,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ blog: data });
  } catch (error) {
    console.error("Admin blogs POST error:", error);
    if (error.message?.includes("duplicate"))
      return NextResponse.json({ error: "A blog with this title already exists" }, { status: 409 });
    return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 });
  }
}
