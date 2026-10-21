import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { DEFAULT_BLOGS } from "@/app/api/blogs/route";

export async function GET(request, segmentData) {
  const { slug } = await segmentData.params;
  const fallback = DEFAULT_BLOGS.find((b) => b.slug === slug);

  try {
    const supabase = getSupabase();

    const fetchPromise = supabase
      .from("blogs")
      .select("*")
      .eq("slug", slug)
      .single();

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), 1500)
    );

    const { data, error } = await Promise.race([fetchPromise, timeoutPromise]);
    if (!error && data) {
      return NextResponse.json({ blog: data });
    }

    if (fallback) {
      return NextResponse.json({ blog: fallback });
    }

    return NextResponse.json({ error: "Blog not found" }, { status: 404 });
  } catch {
    if (fallback) {
      return NextResponse.json({ blog: fallback });
    }
    return NextResponse.json({ error: "Blog not found" }, { status: 404 });
  }
}
