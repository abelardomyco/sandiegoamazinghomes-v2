/**
 * POST /api/lead/saved-home — save a home. Body: { user_id?, anonymous_id?, listing_id?, external_id?, source?, notes? }
 * At least one of user_id or anonymous_id required.
 */

import { NextResponse } from "next/server";
import { saveSavedHome } from "@/lib/agents/lead-agent";

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const user_id = body.user_id || null;
    const anonymous_id = body.anonymous_id && String(body.anonymous_id).trim() || null;
    if (!user_id && !anonymous_id) {
      return NextResponse.json({ error: "user_id or anonymous_id is required." }, { status: 400 });
    }
    const result = await saveSavedHome({
      user_id,
      anonymous_id,
      listing_id: body.listing_id || null,
      external_id: body.external_id ?? null,
      source: body.source ?? "cache",
      notes: body.notes ?? null,
    });
    if (!result) {
      return NextResponse.json({ error: "Could not save home." }, { status: 503 });
    }
    return NextResponse.json({ ok: true, id: result.id });
  } catch (e) {
    console.error("[api/lead/saved-home]", e);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
