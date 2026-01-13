import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value

    // Define protected routes
    const protectedRoutes = ['/']
    const isProtectedRoute = protectedRoutes.includes(request.nextUrl.pathname)

    if (isProtectedRoute && !token) {
        const signInUrl = new URL('/sign-in', request.url)
        return NextResponse.redirect(signInUrl)
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - images in public (if any)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)',
    ],
}
