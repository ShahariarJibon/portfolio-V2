import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET(request, segmentData) {
  try {
    const { slug } = await segmentData.params;
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !data)
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });

    return NextResponse.json({ blog: data });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
