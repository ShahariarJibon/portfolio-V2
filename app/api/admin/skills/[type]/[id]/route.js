import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { validateToken } from "@/lib/auth";

function isAuthed(request) {
  const token = request.cookies.get("admin_token")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");
  return token && validateToken(token);
}

const TABLES = {
  category: "skill_categories",
  skill: "skills",
  "tech-tag": "tech_tags",
};

export async function PUT(request, segmentData) {
  if (!isAuthed(request))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { type, id } = await segmentData.params;
    const table = TABLES[type];
    if (!table) return NextResponse.json({ error: "Invalid type" }, { status: 400 });

    const body = await request.json().catch(() => ({}));
    const updates = {};

    if (type === "category") {
      if (body.name !== undefined) updates.name = String(body.name).trim();
      if (body.icon_name !== undefined) updates.icon_name = String(body.icon_name).trim();
      if (body.sort_order !== undefined) updates.sort_order = Number(body.sort_order) || 0;
    } else if (type === "skill") {
      if (body.name !== undefined) updates.name = String(body.name).trim();
      if (body.level !== undefined) updates.level = Math.max(0, Math.min(100, Number(body.level) || 50));
      if (body.category_id !== undefined) updates.category_id = body.category_id;
      if (body.sort_order !== undefined) updates.sort_order = Number(body.sort_order) || 0;
    } else if (type === "tech-tag") {
      if (body.name !== undefined) updates.name = String(body.name).trim();
      if (body.sort_order !== undefined) updates.sort_order = Number(body.sort_order) || 0;
    }

    const supabase = getSupabase();
    const { data, error } = await supabase.from(table).update(updates).eq("id", id).select().single();
    if (error) throw error;
    return NextResponse.json({ item: data });
  } catch (error) {
    console.error("Admin skills PUT error:", error);
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
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
    console.error("Admin skills DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}
