import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = getSupabase();

    const { data: categories, error: catErr } = await supabase
      .from("skill_categories")
      .select("*")
      .order("sort_order", { ascending: true });
    if (catErr) throw catErr;

    const { data: allSkills, error: skillErr } = await supabase
      .from("skills")
      .select("*")
      .order("sort_order", { ascending: true });
    if (skillErr) throw skillErr;

    const { data: techTags, error: tagErr } = await supabase
      .from("tech_tags")
      .select("*")
      .order("sort_order", { ascending: true });
    if (tagErr) throw tagErr;

    const categoriesWithSkills = (categories || []).map((cat) => ({
      ...cat,
      skills: (allSkills || []).filter((s) => s.category_id === cat.id),
    }));

    return NextResponse.json({ categories: categoriesWithSkills, techTags: techTags || [] });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
