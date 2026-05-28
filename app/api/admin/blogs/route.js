import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { validateToken } from "@/lib/auth";

export async function GET(request) {
  const token =
    request.cookies.get("admin_token")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token || !validateToken(token))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return NextResponse.json({ blogs: data || [] });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
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
    if (!title || !content)
      return NextResponse.json({ error: "Title and content required" }, { status: 400 });

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("blogs")
      .insert({
        title,
        slug,
        content,
        cover_images: cover_images || [],
        tag_lines: tag_lines || [],
        published: published ?? true,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ blog: data });
  } catch (error) {
    if (error.message?.includes("duplicate"))
      return NextResponse.json({ error: "A blog with this title already exists" }, { status: 409 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
