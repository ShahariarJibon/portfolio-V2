import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { validateToken } from "@/lib/auth";

export async function GET(request) {
  const token = request.cookies.get("admin_token")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token || !validateToken(token))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const supabase = getSupabase();
    const fetchPromise = supabase
      .from("users")
      .select("id, email, created_at, is_blocked")
      .order("created_at", { ascending: false });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), 1500)
    );

    const { data, error } = await Promise.race([fetchPromise, timeoutPromise]);
    if (error) throw error;
    return NextResponse.json({ users: data || [] });
  } catch (error) {
    console.error("Admin users GET error:", error);
    return NextResponse.json({ users: [] });
  }
}
