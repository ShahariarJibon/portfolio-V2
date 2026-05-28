import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { validateToken } from "@/lib/auth";

export async function GET(request) {
  const token = request.cookies.get("admin_token")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token || !validateToken(token))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("works")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return NextResponse.json({ works: data || [] });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
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
    if (!title)
      return NextResponse.json({ error: "Title is required" }, { status: 400 });

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("works")
      .insert({
        title,
        description: description || null,
        image_url: image_url || null,
        image_data: image_data || null,
        tag_lines: tag_lines || [],
        demo_url: demo_url || null,
        code_url: code_url || null,
        sort_order: sort_order ?? 0,
        published: published ?? true,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ work: data });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
