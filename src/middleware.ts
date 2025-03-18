import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

export async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname
    
    // Define which paths are considered public (no auth required)
    const isPublicPath = 
        path === "/" || 
        path === "/login" || 
        path.startsWith("/api/auth") || 
        path.startsWith("/terms") ||
        path.startsWith("/faq") ||
        path.startsWith("/invite") ||
        path === "/error"
    
    // Define which paths require authentication
    const isProtectedPath = path.startsWith("/dashboard")
    
    // Get the session token
    const token = await getToken({ 
        req,
        secret: process.env.NEXTAUTH_SECRET
    })
    
    // If the user is on a protected path and not authenticated, redirect to login
    if (isProtectedPath && !token) {
        const url = new URL("/login", req.url)
        url.searchParams.set("callbackUrl", path)
        return NextResponse.redirect(url)
    }
    
    // If the user is authenticated and on the login page, redirect to dashboard
    if (path === "/login" && token) {
        return NextResponse.redirect(new URL("/dashboard", req.url))
    }
    
    return NextResponse.next()
}

// Configure which paths the middleware should run on
export const config = {
    matcher: [
        // Apply to all paths except static files, api routes that aren't auth-related, and _next files
        "/((?!_next/static|_next/image|favicon.ico|api/(?!auth)).*)"
    ]
} 