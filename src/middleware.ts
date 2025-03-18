import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

export async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname
    
    console.log(`Middleware processing path: ${path}`)
    
    // Define which paths are considered public (no auth required)
    const isPublicPath = 
        path === "/" || 
        path === "/login" || 
        path.startsWith("/api/auth") || 
        path === "/api/auth/callback" ||
        path.startsWith("/terms") ||
        path.startsWith("/faq") ||
        path.startsWith("/invite") ||
        path === "/error" ||
        path === "/auth/error"
    
    // Define which paths require authentication
    const isProtectedPath = path.startsWith("/dashboard")
    
    // Get the session token
    const token = await getToken({ 
        req,
        secret: process.env.NEXTAUTH_SECRET
    })
    
    if (isProtectedPath) {
        console.log(`Protected path ${path} - Token present: ${!!token}`)
    }
    
    // If the user is on a protected path and not authenticated, redirect to login
    if (isProtectedPath && !token) {
        console.log(`Redirecting unauthenticated user from ${path} to login`)
        const url = new URL("/login", req.url)
        url.searchParams.set("callbackUrl", path)
        return NextResponse.redirect(url)
    }
    
    // If the user is authenticated and on the login page, redirect to dashboard
    if (path === "/login" && token) {
        console.log(`Redirecting authenticated user from login to dashboard`)
        return NextResponse.redirect(new URL("/dashboard", req.url))
    }
    
    return NextResponse.next()
}

// Configure which paths the middleware should run on
export const config = {
    matcher: [
        // Apply to all paths except static files, api routes that aren't auth-related, and _next files
        "/((?!_next/static|_next/image|favicon.ico).*)"
    ]
} 