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
    const { data: categories } = await supabase
      .from("skill_categories").select("*").order("sort_order");
    const { data: allSkills } = await supabase
      .from("skills").select("*").order("sort_order");
    const { data: techTags } = await supabase
      .from("tech_tags").select("*").order("sort_order");

    const categoriesWithSkills = (categories || []).map((cat) => ({
      ...cat,
      skills: (allSkills || []).filter((s) => s.category_id === cat.id),
    }));

    return NextResponse.json({ categories: categoriesWithSkills, techTags: techTags || [] });
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

    if (type === "category") {
      if (!body.name) return NextResponse.json({ error: "Name is required" }, { status: 400 });
      const { data, error } = await supabase.from("skill_categories").insert({
        name: body.name, icon_name: body.icon_name || "Code2", sort_order: body.sort_order ?? 0,
      }).select().single();
      if (error) throw error;
      return NextResponse.json({ category: data });
    }

    if (type === "skill") {
      if (!body.name || !body.category_id) return NextResponse.json({ error: "Name and category_id required" }, { status: 400 });
      const { data, error } = await supabase.from("skills").insert({
        category_id: body.category_id, name: body.name, level: body.level ?? 50, sort_order: body.sort_order ?? 0,
      }).select().single();
      if (error) throw error;
      return NextResponse.json({ skill: data });
    }

    if (type === "tech_tag") {
      if (!body.name) return NextResponse.json({ error: "Name is required" }, { status: 400 });
      const { data, error } = await supabase.from("tech_tags").insert({
        name: body.name, sort_order: body.sort_order ?? 0,
      }).select().single();
      if (error) throw error;
      return NextResponse.json({ techTag: data });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
