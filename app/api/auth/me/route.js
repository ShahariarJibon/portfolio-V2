import { NextResponse } from "next/server";
import { validateUserToken } from "@/lib/userAuth";
import { getSupabase } from "@/lib/supabase";

export async function GET(request) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "No token" }, { status: 401 });

  const payload = validateUserToken(token);
  if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const supabase = getSupabase();
  const { data } = await supabase
    .from("users")
    .select("id, email, created_at")
    .eq("id", payload.id)
    .single();

  if (!data) return NextResponse.json({ error: "User not found" }, { status: 401 });

  return NextResponse.json({ user: { id: data.id, email: data.email } });
}
