import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect /dashboard routes
  // Ready for Supabase session check:
  // const session = request.cookies.get('sb-access-token')
  // For now, allow all access in dev mode
  const isAuthenticated = true // Replace with real auth check

  if (pathname.startsWith("/dashboard") && !isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
