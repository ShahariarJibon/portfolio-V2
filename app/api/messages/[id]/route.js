import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { validateToken } from "@/lib/auth";

export async function DELETE(request, segmentData) {
  try {
    const token =
      request.cookies.get("admin_token")?.value ||
      request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token || !validateToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await segmentData.params;

    const supabase = getSupabase();
    const { error } = await supabase.from("messages").delete().eq("id", id);

    if (error) {
      console.error("Supabase delete error:", error);
      return NextResponse.json(
        { error: "Failed to delete message" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete message API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
