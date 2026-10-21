import { NextResponse } from "next/server";
import { validateUserToken } from "@/lib/userAuth";
import { getSupabase } from "@/lib/supabase";

export async function GET(request) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = validateUserToken(token);
    if (!payload) return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 });

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("users")
      .select("id, email, created_at, is_blocked")
      .eq("id", payload.id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    if (data.is_blocked) {
      return NextResponse.json({ error: "Your account has been blocked" }, { status: 403 });
    }

    return NextResponse.json({ user: { id: data.id, email: data.email } });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
