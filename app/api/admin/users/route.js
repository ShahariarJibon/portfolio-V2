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
    const { data, error } = await supabase
      .from("users")
      .select("id, email, created_at, is_blocked")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return NextResponse.json({ users: data || [] });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
