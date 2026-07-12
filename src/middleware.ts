import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoginRoute = req.nextUrl.pathname.startsWith("/login");
  const isApiAuthRoute = req.nextUrl.pathname.startsWith("/api/auth");
  const isApiErrosRoute = req.nextUrl.pathname.startsWith("/api/erros");
  const isServiceWorker = req.nextUrl.pathname === "/sw.js";

  if (isApiAuthRoute || isApiErrosRoute || isServiceWorker) return NextResponse.next();

  if (!req.auth && !isLoginRoute) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (req.auth && isLoginRoute) {
    const url = req.nextUrl.clone();
    url.pathname = "/clientes";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
