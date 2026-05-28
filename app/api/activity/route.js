import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = getSupabase();
    const { data: stats } = await supabase
      .from("activity_stats").select("*").order("sort_order");
    const { data: languages } = await supabase
      .from("activity_languages").select("*").order("sort_order");
    return NextResponse.json({ stats: stats || [], languages: languages || [] });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
