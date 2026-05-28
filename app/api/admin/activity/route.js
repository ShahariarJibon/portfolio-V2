import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { validateToken } from "@/lib/auth";

function isAuthed(request) {
  const token = request.cookies.get("admin_token")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");
  return token && validateToken(token);
}

const TABLES = { stat: "activity_stats", language: "activity_languages" };

export async function GET(request) {
  if (!isAuthed(request))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const supabase = getSupabase();
    const { data: stats } = await supabase.from("activity_stats").select("*").order("sort_order");
    const { data: languages } = await supabase.from("activity_languages").select("*").order("sort_order");
    return NextResponse.json({ stats: stats || [], languages: languages || [] });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  if (!isAuthed(request))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    const { type } = body;
    const supabase = getSupabase();

    if (type === "stat") {
      if (!body.label || !body.value)
        return NextResponse.json({ error: "Label and value required" }, { status: 400 });
      const { data, error } = await supabase.from("activity_stats").insert({
        label: body.label, value: body.value, icon_name: body.icon_name || "GitCommit", sort_order: body.sort_order ?? 0,
      }).select().single();
      if (error) throw error;
      return NextResponse.json({ stat: data });
    }

    if (type === "language") {
      if (!body.name || body.percentage === undefined)
        return NextResponse.json({ error: "Name and percentage required" }, { status: 400 });
      const { data, error } = await supabase.from("activity_languages").insert({
        name: body.name, percentage: body.percentage, color: body.color || "#f7df1e", sort_order: body.sort_order ?? 0,
      }).select().single();
      if (error) throw error;
      return NextResponse.json({ language: data });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
