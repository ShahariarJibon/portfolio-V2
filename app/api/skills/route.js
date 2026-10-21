import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export const DEFAULT_SKILLS = {
  categories: [
    {
      id: "cat-frontend",
      name: "Frontend",
      icon_name: "Layout",
      sort_order: 0,
      skills: [
        { id: "s-react", name: "React", level: 92, sort_order: 0 },
        { id: "s-js", name: "JavaScript", level: 90, sort_order: 1 },
        { id: "s-tailwind", name: "Tailwind CSS", level: 92, sort_order: 2 },
        { id: "s-html", name: "HTML", level: 95, sort_order: 3 },
        { id: "s-css", name: "CSS", level: 90, sort_order: 4 },
      ],
    },
    {
      id: "cat-languages",
      name: "Programming Languages",
      icon_name: "Code2",
      sort_order: 1,
      skills: [
        { id: "s-cpp", name: "C++", level: 88, sort_order: 0 },
        { id: "s-c", name: "C", level: 85, sort_order: 1 },
        { id: "s-java", name: "Java", level: 85, sort_order: 2 },
        { id: "s-js-lang", name: "JavaScript", level: 90, sort_order: 3 },
      ],
    },
  ],
  techTags: [
    { id: "t-react", name: "React", sort_order: 0 },
    { id: "t-js", name: "JavaScript", sort_order: 1 },
    { id: "t-tailwind", name: "Tailwind CSS", sort_order: 2 },
    { id: "t-html", name: "HTML", sort_order: 3 },
    { id: "t-css", name: "CSS", sort_order: 4 },
    { id: "t-cpp", name: "C++", sort_order: 5 },
    { id: "t-c", name: "C", sort_order: 6 },
    { id: "t-java", name: "Java", sort_order: 7 },
  ],
};

export async function GET() {
  try {
    const supabase = getSupabase();

    const fetchPromise = Promise.all([
      supabase.from("skill_categories").select("*").order("sort_order", { ascending: true }),
      supabase.from("skills").select("*").order("sort_order", { ascending: true }),
      supabase.from("tech_tags").select("*").order("sort_order", { ascending: true }),
    ]);

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Database timeout")), 1500)
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
        techTags: techTags && techTags.length > 0 ? techTags : DEFAULT_SKILLS.techTags,
      });
    }

    return NextResponse.json(DEFAULT_SKILLS);
  } catch {
    return NextResponse.json(DEFAULT_SKILLS);
  }
}
