import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { validateToken } from "@/lib/auth";
import { DEFAULT_SKILLS } from "@/app/api/skills/route";

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

    const fetchPromise = Promise.all([
      supabase.from("skill_categories").select("*").order("sort_order"),
      supabase.from("skills").select("*").order("sort_order"),
      supabase.from("tech_tags").select("*").order("sort_order"),
    ]);

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), 1500)
    );

    const [catRes, skillRes, tagRes] = await Promise.race([fetchPromise, timeoutPromise]);
    const categories = catRes.data;
    const allSkills = skillRes.data;
    const techTags = tagRes.data;

    if (!catRes.error && categories && categories.length > 0) {
      const categoriesWithSkills = categories.map((cat) => ({
        ...cat,
        skills: (allSkills || []).filter((s) => s.category_id === cat.id),
      }));

      return NextResponse.json({
        categories: categoriesWithSkills,
        techTags: techTags || [],
      });
    }

    return NextResponse.json(DEFAULT_SKILLS);
  } catch {
    return NextResponse.json(DEFAULT_SKILLS);
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
      if (!body.name || typeof body.name !== "string") {
        return NextResponse.json({ error: "Name is required" }, { status: 400 });
      }
      const { data, error } = await supabase.from("skill_categories").insert({
        name: body.name.trim(),
        icon_name: body.icon_name || "Code2",
        sort_order: Number(body.sort_order) || 0,
      }).select().single();
      if (error) throw error;
      return NextResponse.json({ category: data });
    }

    if (type === "skill") {
      if (!body.name || !body.category_id) {
        return NextResponse.json({ error: "Name and category_id required" }, { status: 400 });
      }
      const { data, error } = await supabase.from("skills").insert({
        category_id: body.category_id,
        name: String(body.name).trim(),
        level: Math.max(0, Math.min(100, Number(body.level) || 50)),
        sort_order: Number(body.sort_order) || 0,
      }).select().single();
      if (error) throw error;
      return NextResponse.json({ skill: data });
    }

    if (type === "tech_tag") {
      if (!body.name || typeof body.name !== "string") {
        return NextResponse.json({ error: "Name is required" }, { status: 400 });
      }
      const { data, error } = await supabase.from("tech_tags").insert({
        name: body.name.trim(),
        sort_order: Number(body.sort_order) || 0,
      }).select().single();
      if (error) throw error;
      return NextResponse.json({ techTag: data });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error) {
    console.error("Admin skills POST error:", error);
    return NextResponse.json({ error: "Failed to save skill item" }, { status: 500 });
  }
}
