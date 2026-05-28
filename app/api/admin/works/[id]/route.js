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
    if (body.title !== undefined) updates.title = body.title;
    if (body.description !== undefined) updates.description = body.description;
    if (body.image_url !== undefined) updates.image_url = body.image_url;
    if (body.image_data !== undefined) updates.image_data = body.image_data;
    if (body.tag_lines !== undefined) updates.tag_lines = body.tag_lines;
    if (body.demo_url !== undefined) updates.demo_url = body.demo_url;
    if (body.code_url !== undefined) updates.code_url = body.code_url;
    if (body.sort_order !== undefined) updates.sort_order = body.sort_order;
    if (body.published !== undefined) updates.published = body.published;

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
    return NextResponse.json({ error: error.message }, { status: 500 });
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
    await supabase.from("works").delete().eq("id", id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
