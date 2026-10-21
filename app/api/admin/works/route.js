import { NextResponse } from "next/server";
import { validateToken } from "@/lib/auth";
import { getAllWorks, createWork, DEFAULT_WORKS } from "@/lib/worksStore";

export { DEFAULT_WORKS };

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request) {
  const token = request.cookies.get("admin_token")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token || !validateToken(token))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const works = await getAllWorks({ publishedOnly: false });
    return NextResponse.json(
      { works },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "CDN-Cache-Control": "no-store",
          "Vercel-CDN-Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Admin works GET error:", error);
    return NextResponse.json(
      { works: DEFAULT_WORKS },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  }
}

export async function POST(request) {
  const token = request.cookies.get("admin_token")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token || !validateToken(token))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { title, description, image_url, image_data, tag_lines, demo_url, code_url, sort_order, published } = body;
    if (!title || typeof title !== "string" || !title.trim())
      return NextResponse.json({ error: "Title is required" }, { status: 400 });

    const newWork = await createWork({
      title: title.trim(),
      description: description ? String(description).trim() : null,
      image_url: image_url ? String(image_url).trim() : null,
      image_data: image_data || null,
      tag_lines: Array.isArray(tag_lines) ? tag_lines : [],
      demo_url: demo_url ? String(demo_url).trim() : null,
      code_url: code_url ? String(code_url).trim() : null,
      sort_order: Number(sort_order) || 0,
      published: published ?? true,
    });

    return NextResponse.json({ work: newWork });
  } catch (error) {
    console.error("Admin works POST error:", error);
    return NextResponse.json({ error: "Failed to save project work" }, { status: 500 });
  }
}
