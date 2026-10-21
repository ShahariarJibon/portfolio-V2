import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { validateToken } from "@/lib/auth";
import { DEFAULT_ACTIVITY } from "@/app/api/activity/route";

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

    const fetchPromise = Promise.all([
      supabase.from("activity_stats").select("*").order("sort_order"),
      supabase.from("activity_languages").select("*").order("sort_order"),
    ]);

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), 1500)
    );

    const [statsRes, langRes] = await Promise.race([fetchPromise, timeoutPromise]);
    const stats = statsRes.data;
    const languages = langRes.data;

    if (!statsRes.error && stats && stats.length > 0) {
      return NextResponse.json({ stats, languages: languages || [] });
    }
    return NextResponse.json(DEFAULT_ACTIVITY);
  } catch {
    return NextResponse.json(DEFAULT_ACTIVITY);
  }
}

export async function POST(request) {
  if (!isAuthed(request))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { type, ...itemData } = body;
    const table = TABLES[type];
    if (!table) return NextResponse.json({ error: "Invalid type" }, { status: 400 });

    const supabase = getSupabase();
    const { data, error } = await supabase.from(table).insert(itemData).select().single();
    if (error) throw error;
    return NextResponse.json({ item: data });
  } catch (error) {
    console.error("Admin activity POST error:", error);
    return NextResponse.json({ error: "Failed to save activity item" }, { status: 500 });
  }
}
