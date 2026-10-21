import { NextResponse } from "next/server";
import { validateToken } from "@/lib/auth";
import { updateWork, deleteWork, getWorkById } from "@/lib/worksStore";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getParams(segmentData) {
  if (!segmentData) return {};
  if (segmentData.params instanceof Promise) {
    return await segmentData.params;
  }
  return segmentData.params || {};
}

export async function GET(request, segmentData) {
  const token =
    request.cookies.get("admin_token")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token || !validateToken(token))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const params = await getParams(segmentData);
    const id = params.id;
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const work = await getWorkById(id);
    if (!work) return NextResponse.json({ error: "Work not found" }, { status: 404 });

    return NextResponse.json(
      { work },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, segmentData) {
  const token =
    request.cookies.get("admin_token")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token || !validateToken(token))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const params = await getParams(segmentData);
    const id = params.id;
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const body = await request.json();
    const updates = {};
    if (body.title !== undefined) updates.title = String(body.title).trim();
    if (body.description !== undefined) updates.description = body.description ? String(body.description).trim() : null;
    if (body.image_url !== undefined) updates.image_url = body.image_url ? String(body.image_url).trim() : null;
    if (body.image_data !== undefined) updates.image_data = body.image_data || null;
    if (body.tag_lines !== undefined) updates.tag_lines = Array.isArray(body.tag_lines) ? body.tag_lines : [];
    if (body.demo_url !== undefined) updates.demo_url = body.demo_url ? String(body.demo_url).trim() : null;
    if (body.code_url !== undefined) updates.code_url = body.code_url ? String(body.code_url).trim() : null;
    if (body.sort_order !== undefined) updates.sort_order = Number(body.sort_order) || 0;
    if (body.published !== undefined) updates.published = Boolean(body.published);

    const updated = await updateWork(id, updates);
    return NextResponse.json(
      { work: updated },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("Admin works PUT error:", error);
    return NextResponse.json({ error: error.message || "Failed to update work item" }, { status: 500 });
  }
}

export async function DELETE(request, segmentData) {
  const token =
    request.cookies.get("admin_token")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token || !validateToken(token))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const params = await getParams(segmentData);
    const id = params.id;
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const result = await deleteWork(id);
    if (!result.success) {
      return NextResponse.json({ error: result.message || "Failed to delete work item" }, { status: 404 });
    }

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Admin works DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete work item" }, { status: 500 });
  }
}
