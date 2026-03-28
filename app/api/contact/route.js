import { createServerClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

const SITE = "sandiegoamazinghomes";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || "");
}

export async function POST(request) {
  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const question = typeof body.question === "string" ? body.question.trim() : "";
    const source = typeof body.source === "string" ? body.source.trim() || "market_widget" : "market_widget";

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    if (!question) {
      return NextResponse.json({ error: "Please enter your question." }, { status: 400 });
    }

    const supabase = createServerClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Contact form is not available. Please email Rosamelia directly." },
        { status: 503 }
      );
    }

    const { error } = await supabase.from("contact_submissions").insert({
      site: SITE,
      name: name || null,
      email,
      message: question,
      source,
    });

    if (error) {
      console.error("Contact submit error:", error);
      return NextResponse.json(
        { error: "Could not send. Please try again or email Rosamelia directly." },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Thanks! Rosamelia will get back to you soon." });
  } catch (e) {
    console.error("Contact API error:", e);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
