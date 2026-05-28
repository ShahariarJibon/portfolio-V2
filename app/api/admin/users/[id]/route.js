import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { validateToken } from "@/lib/auth";

export async function PUT(request, segmentData) {
  const token = request.cookies.get("admin_token")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token || !validateToken(token))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await segmentData.params;
    const body = await request.json();
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("users")
      .update({ is_blocked: body.is_blocked })
      .eq("id", id)
      .select("id, email, created_at, is_blocked")
      .single();
    if (error) throw error;
    return NextResponse.json({ user: data });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
