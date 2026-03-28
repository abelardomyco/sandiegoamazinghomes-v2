/**
 * POST /api/lead/saved-search — save a search. Body: { user_id?, anonymous_id?, name?, filters_json?, notify? }
 * At least one of user_id or anonymous_id required.
 */

import { NextResponse } from "next/server";
import { saveSavedSearch } from "@/lib/agents/lead-agent";

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const user_id = body.user_id || null;
    const anonymous_id = body.anonymous_id && String(body.anonymous_id).trim() || null;
    if (!user_id && !anonymous_id) {
      return NextResponse.json({ error: "user_id or anonymous_id is required." }, { status: 400 });
    }
    const result = await saveSavedSearch({
      user_id,
      anonymous_id,
      name: body.name ?? null,
      filters_json: body.filters_json ?? {},
      notify: body.notify === true,
    });
    if (!result) {
      return NextResponse.json({ error: "Could not save search." }, { status: 503 });
    }
    return NextResponse.json({ ok: true, id: result.id });
  } catch (e) {
    console.error("[api/lead/saved-search]", e);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
