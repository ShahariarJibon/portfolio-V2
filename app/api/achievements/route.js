import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export const DEFAULT_ACHIEVEMENTS = [
  {
    id: "ach-1",
    title: "Hackathon Winner",
    description: "First place at TechHacks 2023",
    sort_order: 0,
  },
  {
    id: "ach-2",
    title: "GitHub Contributor",
    description: "500+ contributions in 2023",
    sort_order: 1,
  },
  {
    id: "ach-3",
    title: "SaaS Launch",
    description: "10,000+ users across products",
    sort_order: 2,
  },
];

export async function GET() {
  try {
    const supabase = getSupabase();

    const fetchPromise = supabase
      .from("achievements")
      .select("*")
      .order("sort_order", { ascending: true });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), 1500)
    );

    const { data, error } = await Promise.race([fetchPromise, timeoutPromise]);

    if (!error && data && data.length > 0) {
      return NextResponse.json({ achievements: data });
    }
    return NextResponse.json({ achievements: DEFAULT_ACHIEVEMENTS });
  } catch {
    return NextResponse.json({ achievements: DEFAULT_ACHIEVEMENTS });
  }
}
