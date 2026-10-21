import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export const DEFAULT_ACTIVITY = {
  stats: [
    {
      id: "stat-1",
      label: "Total Commits",
      value: "1,200+",
      icon_name: "GitCommit",
      sort_order: 0,
    },
    {
      id: "stat-2",
      label: "Contributions",
      value: "500+",
      icon_name: "Users",
      sort_order: 1,
    },
    {
      id: "stat-3",
      label: "Stars Earned",
      value: "50+",
      icon_name: "Star",
      sort_order: 2,
    },
  ],
  languages: [
    {
      id: "lang-1",
      name: "JavaScript",
      percentage: 45,
      color: "#f7df1e",
      sort_order: 0,
    },
    {
      id: "lang-2",
      name: "TypeScript",
      percentage: 30,
      color: "#3178c6",
      sort_order: 1,
    },
    {
      id: "lang-3",
      name: "Python",
      percentage: 15,
      color: "#3776ab",
      sort_order: 2,
    },
    {
      id: "lang-4",
      name: "CSS",
      percentage: 10,
      color: "#264de4",
      sort_order: 3,
    },
  ],
};

export async function GET() {
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
      return NextResponse.json({
        stats,
        languages: languages || [],
      });
    }

    return NextResponse.json(DEFAULT_ACTIVITY);
  } catch {
    return NextResponse.json(DEFAULT_ACTIVITY);
  }
}
