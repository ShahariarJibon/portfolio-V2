import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("works")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return NextResponse.json({ works: data || [] });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
