import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { validateToken } from "@/lib/auth";

function isAuthed(request) {
  const token = request.cookies.get("admin_token")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");
  return token && validateToken(token);
}

export async function GET(request) {
  if (!isAuthed(request))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("achievements")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return NextResponse.json({ achievements: data || [] });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  if (!isAuthed(request))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    if (!body.title)
      return NextResponse.json({ error: "Title is required" }, { status: 400 });

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("achievements")
      .insert({ title: body.title, description: body.description || null, sort_order: body.sort_order ?? 0 })
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ achievement: data });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
