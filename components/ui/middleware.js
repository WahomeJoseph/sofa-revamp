// middleware.js
import { auth } from "../../auth.config";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Protected routes
  const protectedRoutes = [
    "/wishlist",
    "/cart",
    "/orders",
    "/profile",
    "/checkout",
    "/dashboard"
  ];

  // Public routes
  const publicRoutes = [
    "/",
    "/login",
    "/register",
    "/about",
    "/contact",
    "/shop"
  ];

  // Check if current route is protected
  const isProtected = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

  // Check if current route is public
  const isPublic = publicRoutes.some(route =>
    pathname.startsWith(route)
  );

  // If not authenticated and trying to access protected route
  if (isProtected && !req.auth?.user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If authenticated and trying to access auth pages
  if (isPublic && req.auth?.user &&
    (pathname.startsWith("/login") || pathname.startsWith("/register"))) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};