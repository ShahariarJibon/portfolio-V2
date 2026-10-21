import { NextResponse } from "next/server";
import { getAllWorks, DEFAULT_WORKS } from "@/lib/worksStore";

export { DEFAULT_WORKS };

export async function GET() {
  try {
    const works = await getAllWorks({ publishedOnly: true });
    return NextResponse.json({ works });
  } catch (error) {
    console.error("GET /api/works error:", error);
    return NextResponse.json({ works: DEFAULT_WORKS });
  }
}
