import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = ["/", "/rsvp"];

const isPublic = (path: string) => {
  return publicPaths.some((x) => path.startsWith(x));
};

export default clerkMiddleware((auth, request: NextRequest) => {
  const path = request.nextUrl.pathname;
  
  console.log(`[Middleware] Processing path: ${path}`);
  
  // Check if user has auth token
  const token = request.cookies.get("__session")?.value;
  console.log(`[Middleware] Token present: ${!!token}`);
  
  // If user is authenticated and tries to access login/register, redirect to dashboard
  if (token && (path.startsWith("/login") || path.startsWith("/register"))) {
    console.log(`[Middleware] Authenticated user accessing auth page, redirecting to dashboard`);
    const { origin } = request.nextUrl;
    return NextResponse.redirect(`${origin}/dashboard`);
  }
  
  // Always allow authentication routes for unauthenticated users
  if (path.startsWith("/login") || path.startsWith("/register")) {
    console.log(`[Middleware] Allowing auth route: ${path}`);
    return NextResponse.next();
  }
  
  if (isPublic(path)) {
    console.log(`[Middleware] Allowing public route: ${path}`);
    return NextResponse.next();
  }

  // Protected routes require authentication
  if (!token) {
    console.log(`[Middleware] No token, redirecting to login`);
    const { origin } = request.nextUrl;
    return NextResponse.redirect(`${origin}/login`);
  }

  console.log(`[Middleware] Allowing protected route: ${path}`);
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};