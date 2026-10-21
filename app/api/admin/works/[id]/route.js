import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { validateToken } from "@/lib/auth";

export async function PUT(request, segmentData) {
  const token = request.cookies.get("admin_token")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token || !validateToken(token))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await segmentData.params;
    const body = await request.json();
    const updates = {};
    if (body.title !== undefined) updates.title = String(body.title).trim();
    if (body.description !== undefined) updates.description = body.description ? String(body.description).trim() : null;
    if (body.image_url !== undefined) updates.image_url = body.image_url ? String(body.image_url).trim() : null;
    if (body.image_data !== undefined) updates.image_data = body.image_data || null;
    if (body.tag_lines !== undefined) updates.tag_lines = Array.isArray(body.tag_lines) ? body.tag_lines : [];
    if (body.demo_url !== undefined) updates.demo_url = body.demo_url ? String(body.demo_url).trim() : null;
    if (body.code_url !== undefined) updates.code_url = body.code_url ? String(body.code_url).trim() : null;
    if (body.sort_order !== undefined) updates.sort_order = Number(body.sort_order) || 0;
    if (body.published !== undefined) updates.published = Boolean(body.published);

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("works")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ work: data });
  } catch (error) {
    console.error("Admin works PUT error:", error);
    return NextResponse.json({ error: "Failed to update work item" }, { status: 500 });
  }
}

export async function DELETE(request, segmentData) {
  const token = request.cookies.get("admin_token")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token || !validateToken(token))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await segmentData.params;
    const supabase = getSupabase();
    const { error } = await supabase.from("works").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin works DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete work item" }, { status: 500 });
  }
}
