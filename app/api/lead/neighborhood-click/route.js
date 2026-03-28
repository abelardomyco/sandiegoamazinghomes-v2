/**
 * POST /api/lead/neighborhood-click — track neighborhood click.
 * Body: { neighborhood_slug, email?, anonymous_id?, source_page? }
 */

import { NextResponse } from "next/server";
import { recordNeighborhoodClick } from "@/lib/agents/lead-agent";

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const neighborhood_slug = body.neighborhood_slug && String(body.neighborhood_slug).trim();
    const email = body.email && String(body.email).trim() || null;
    const anonymous_id = body.anonymous_id && String(body.anonymous_id).trim() || null;
    if (!neighborhood_slug) {
      return NextResponse.json({ error: "neighborhood_slug is required." }, { status: 400 });
    }
    if (!email && !anonymous_id) {
      return NextResponse.json({ error: "email or anonymous_id is required." }, { status: 400 });
    }
    const result = await recordNeighborhoodClick({
      neighborhood_slug,
      email,
      anonymous_id,
      source_page: body.source_page ?? null,
    });
    if (!result) {
      return NextResponse.json({ error: "Could not store event." }, { status: 503 });
    }
    return NextResponse.json({ ok: true, id: result.id });
  } catch (e) {
    console.error("[api/lead/neighborhood-click]", e);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
