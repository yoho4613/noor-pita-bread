// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
// __Secure-next-auth.session-token
// This function can be marked `async` if using `await` inside
export function middleware(req: NextRequest) {
  const token = req.cookies.get("next-auth.session-token")?.value ?? req.cookies.get("__Secure-next-auth.session-token")?.value;
  const adminToken = req.cookies.get("emarket-admin-token")?.value;
  
  // validate the user is authenticated
  const verifiedToken = token;

  if (req.nextUrl.pathname === "/login" && !verifiedToken) {
    return;
  } else if ( req.nextUrl.pathname === "/login-admin" && !adminToken) {
    return;
  }
  const url = req.url;


  if (url.includes("/admin") && !adminToken) {
    return NextResponse.redirect(new URL("/login-admin", req.url));
  } else if (url.includes("/login-admin") && adminToken) {
    return NextResponse.redirect(new URL("/admin", req.url));
  } else if (req.nextUrl.pathname === "/login" && verifiedToken) {
    return NextResponse.redirect(new URL("/", req.url));
  } else if (!url.includes("/admin") && !verifiedToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/login", "/login-admin", "/admin", "/admin/:path*", "/user/:path*"],
};
