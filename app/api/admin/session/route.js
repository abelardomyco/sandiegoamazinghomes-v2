import { NextResponse } from "next/server";
import { createSignedAdminCookie, COOKIE_NAME } from "@/lib/admin-session";

const isProd = process.env.NODE_ENV === "production";

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    if (body?.logout) {
      const res = NextResponse.json({ ok: true });
      res.cookies.set(COOKIE_NAME, "", { httpOnly: true, path: "/", maxAge: 0 });
      return res;
    }

    const password = typeof body?.password === "string" ? body.password : "";
    const expected = process.env.ADMIN_DASHBOARD_PASSWORD || "";
    const secret = process.env.ADMIN_SESSION_SECRET || "";

    if (!expected || !secret) {
      return NextResponse.json(
        {
          error:
            "Admin is not configured. Set ADMIN_DASHBOARD_PASSWORD and ADMIN_SESSION_SECRET in .env.local.",
        },
        { status: 503 }
      );
    }
    if (password !== expected) {
      return NextResponse.json({ error: "Invalid password." }, { status: 401 });
    }

    const token = await createSignedAdminCookie(secret);
    const res = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });
    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
