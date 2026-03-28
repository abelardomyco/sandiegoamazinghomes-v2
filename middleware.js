import { NextResponse } from "next/server";
import { verifySignedAdminCookie, COOKIE_NAME } from "@/lib/admin-session";

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }
  if (pathname === "/admin/login" || pathname.startsWith("/admin/login/")) {
    return NextResponse.next();
  }

  const secret = process.env.ADMIN_SESSION_SECRET || "";
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!secret || !(await verifySignedAdminCookie(token, secret))) {
    const login = new URL("/admin/login", request.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

