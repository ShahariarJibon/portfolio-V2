import { NextResponse } from "next/server";
import { getAllWorks, DEFAULT_WORKS } from "@/lib/worksStore";

export { DEFAULT_WORKS };

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const works = await getAllWorks({ publishedOnly: true });
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
    console.error("GET /api/works error:", error);
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
