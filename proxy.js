import { NextResponse } from "next/server";

export function proxy(request) {
  const { pathname } = request.nextUrl;

  // Protect all /admin/* sub-paths, allowing /admin for login
  if (pathname.startsWith("/admin/") && pathname !== "/admin") {
    const adminToken = request.cookies.get("admin_token")?.value;

    if (!adminToken) {
      const loginUrl = new URL("/admin", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
