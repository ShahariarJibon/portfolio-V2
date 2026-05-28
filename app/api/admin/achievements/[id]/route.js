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
    if (body.sort_order !== undefined) updates.sort_order = body.sort_order;

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
    await supabase.from("achievements").delete().eq("id", id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
