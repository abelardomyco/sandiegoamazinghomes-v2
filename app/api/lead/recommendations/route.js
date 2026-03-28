/**
 * GET /api/lead/recommendations — personalized recommendations (stub). Query: email= or anonymous_id=
 */

import { NextResponse } from "next/server";
import { getPersonalizedRecommendations } from "@/lib/agents/lead-agent";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email") && searchParams.get("email").trim() || null;
    const anonymous_id = searchParams.get("anonymous_id") && searchParams.get("anonymous_id").trim() || null;
    if (!email && !anonymous_id) {
      return NextResponse.json({ error: "email or anonymous_id query is required." }, { status: 400 });
    }
    const result = await getPersonalizedRecommendations({ email, anonymous_id });
    return NextResponse.json(result);
  } catch (e) {
    console.error("[api/lead/recommendations]", e);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
