import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { validateUserToken } from "@/lib/userAuth";
import { rateLimit } from "@/lib/rateLimit";

function maskEmail(email) {
  if (!email || typeof email !== "string" || !email.includes("@")) {
    return "user";
  }
  const [username, domain] = email.split("@");
  if (username.length <= 2) {
    return `${username[0]}***@${domain}`;
  }
  return `${username.slice(0, 2)}***${username.slice(-1)}@${domain}`;
}

export async function GET(request, segmentData) {
  try {
    const { slug } = await segmentData.params;
    const supabase = getSupabase();
    const { data: blog } = await supabase
      .from("blogs")
      .select("id")
      .eq("slug", slug)
      .single();
    if (!blog) return NextResponse.json({ error: "Blog not found" }, { status: 404 });

    const { data, error } = await supabase
      .from("blog_comments")
      .select("id, content, created_at, user_id, users!inner(email)")
      .eq("blog_id", blog.id)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return NextResponse.json({
      comments:
        data?.map((c) => ({
          id: c.id,
          content: c.content,
          user: { id: c.user_id, email: maskEmail(c.users?.email) },
          created_at: c.created_at,
        })) || [],
    });
  } catch (error) {
    console.error("Blog comments GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request, segmentData) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    const limiter = rateLimit(`blog-comment:${ip}`, 10, 60000);
    if (!limiter.success) {
      return NextResponse.json(
        { error: "Too many comments. Please slow down." },
        { status: 429 }
      );
    }

    const { slug } = await segmentData.params;
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    const userPayload = validateUserToken(token);
    if (!userPayload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json().catch(() => ({}));
    const { content } = body;

    if (!content || typeof content !== "string" || !content.trim()) {
      return NextResponse.json({ error: "Comment is required" }, { status: 400 });
    }

    const cleanContent = content.trim();
    if (cleanContent.length > 1000) {
      return NextResponse.json({ error: "Comment cannot exceed 1000 characters" }, { status: 400 });
    }

    const supabase = getSupabase();

    // Verify user is not blocked
    const { data: userRecord } = await supabase
      .from("users")
      .select("id, is_blocked, email")
      .eq("id", userPayload.id)
      .single();

    if (!userRecord || userRecord.is_blocked) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { data: blog } = await supabase
      .from("blogs")
      .select("id")
      .eq("slug", slug)
      .single();
    if (!blog) return NextResponse.json({ error: "Blog not found" }, { status: 404 });

    const { data, error } = await supabase
      .from("blog_comments")
      .insert({ blog_id: blog.id, user_id: userPayload.id, content: cleanContent })
      .select("id, content, created_at, user_id")
      .single();

    if (error) throw error;
    return NextResponse.json({
      comment: { ...data, user: { id: userPayload.id, email: maskEmail(userRecord.email) } },
    });
  } catch (error) {
    console.error("Blog comments POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
