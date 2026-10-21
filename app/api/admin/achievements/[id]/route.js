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
    if (body.sort_order !== undefined) updates.sort_order = Number(body.sort_order) || 0;

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("achievements")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ achievement: data });
  } catch (error) {
    console.error("Admin achievements PUT error:", error);
    return NextResponse.json({ error: "Failed to update achievement" }, { status: 500 });
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
    const { error } = await supabase.from("achievements").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin achievements DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete achievement" }, { status: 500 });
  }
}
