import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export function middleware(request: NextRequest) {
  const token = cookies().get("token")?.value;

  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (token !== "admin") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (request.nextUrl.pathname.startsWith("/login")) {
    if (token === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
