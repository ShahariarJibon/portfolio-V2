import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { validateToken } from "@/lib/auth";

const TABLES = { stat: "activity_stats", language: "activity_languages" };

function isAuthed(request) {
  const token = request.cookies.get("admin_token")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");
  return token && validateToken(token);
}

export async function PUT(request, segmentData) {
  if (!isAuthed(request))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { type, id } = await segmentData.params;
    const table = TABLES[type];
    if (!table) return NextResponse.json({ error: "Invalid type" }, { status: 400 });

    const body = await request.json();
    const updates = {};

    if (type === "stat") {
      if (body.label !== undefined) updates.label = String(body.label).trim();
      if (body.value !== undefined) updates.value = String(body.value).trim();
      if (body.icon_name !== undefined) updates.icon_name = String(body.icon_name).trim();
      if (body.sort_order !== undefined) updates.sort_order = Number(body.sort_order) || 0;
    } else if (type === "language") {
      if (body.name !== undefined) updates.name = String(body.name).trim();
      if (body.percentage !== undefined) updates.percentage = Math.max(0, Math.min(100, Number(body.percentage) || 0));
      if (body.color !== undefined) updates.color = String(body.color).trim();
      if (body.sort_order !== undefined) updates.sort_order = Number(body.sort_order) || 0;
    }

    const supabase = getSupabase();
    const { data, error } = await supabase.from(table).update(updates).eq("id", id).select().single();
    if (error) throw error;
    return NextResponse.json({ item: data });
  } catch (error) {
    console.error("Admin activity PUT error:", error);
    return NextResponse.json({ error: "Failed to update activity item" }, { status: 500 });
  }
}

export async function DELETE(request, segmentData) {
  if (!isAuthed(request))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { type, id } = await segmentData.params;
    const table = TABLES[type];
    if (!table) return NextResponse.json({ error: "Invalid type" }, { status: 400 });

    const supabase = getSupabase();
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin activity DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete activity item" }, { status: 500 });
  }
}
