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
    const supabase = getSupabase();
    const { data, error } = await supabase.from(table).update(body).eq("id", id).select().single();
    if (error) throw error;
    return NextResponse.json({ item: data });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
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
    await supabase.from(table).delete().eq("id", id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
