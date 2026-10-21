import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { validateToken } from "@/lib/auth";

export async function PUT(request, segmentData) {
  const token =
    request.cookies.get("admin_token")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token || !validateToken(token))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await segmentData.params;
    const body = await request.json();
    const updates = {};
    if (body.title !== undefined) {
      const titleStr = String(body.title).trim();
      updates.title = titleStr;
      updates.slug = titleStr
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    }
    if (body.content !== undefined) updates.content = String(body.content).trim();
    if (body.cover_images !== undefined) updates.cover_images = Array.isArray(body.cover_images) ? body.cover_images : [];
    if (body.tag_lines !== undefined) updates.tag_lines = Array.isArray(body.tag_lines) ? body.tag_lines : [];
    if (body.published !== undefined) updates.published = Boolean(body.published);

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("blogs")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ blog: data });
  } catch (error) {
    console.error("Admin blogs PUT error:", error);
    return NextResponse.json({ error: "Failed to update blog post" }, { status: 500 });
  }
}

export async function DELETE(request, segmentData) {
  const token =
    request.cookies.get("admin_token")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token || !validateToken(token))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await segmentData.params;
    const supabase = getSupabase();
    await supabase.from("blog_comments").delete().eq("blog_id", id);
    await supabase.from("blog_reactions").delete().eq("blog_id", id);
    const { error } = await supabase.from("blogs").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin blogs DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete blog post" }, { status: 500 });
  }
}
