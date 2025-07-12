import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
const AUTH_COOKIE_NAME = 'admin_auth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAuthenticated = request.cookies.has(AUTH_COOKIE_NAME);
 
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  if(pathname === '/admin/login' && isAuthenticated) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }
 
  return NextResponse.next()
}
 
export const config = {
  matcher: ['/admin/:path*', '/admin/login'],
}
