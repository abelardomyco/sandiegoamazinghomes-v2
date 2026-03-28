import { NextResponse } from "next/server";
import { recordLeadEvent } from "@/lib/agents/lead-agent";

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const event_type = body.event_type && String(body.event_type).trim();
    const email = (body.email && String(body.email).trim()) || null;
    const anonymous_id = (body.anonymous_id && String(body.anonymous_id).trim()) || null;
    if (!event_type) return NextResponse.json({ error: "event_type is required." }, { status: 400 });
    if (!email && !anonymous_id) return NextResponse.json({ error: "email or anonymous_id is required." }, { status: 400 });
    const result = await recordLeadEvent({
      event_type,
      email,
      anonymous_id,
      payload_json: body.payload_json ?? null,
      source_page: body.source_page ?? null,
    });
    if (!result) return NextResponse.json({ error: "Could not store event." }, { status: 503 });
    return NextResponse.json({ ok: true, id: result.id });
  } catch (e) {
    console.error("[api/lead/event]", e);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
