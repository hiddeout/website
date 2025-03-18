import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function GET(req: NextRequest) {
    // Get the token from NextAuth
    const token = await getToken({ 
        req,
        secret: process.env.NEXTAUTH_SECRET
    })
    
    if (!token || !token.accessToken) {
        return NextResponse.redirect(new URL("/login?error=unauthorized", req.url))
    }
    
    try {
        // Call your backend to register the token with the bot
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
        const response = await fetch(`${apiUrl}/@me/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token.accessToken as string
            },
            body: JSON.stringify({
                access_token: token.accessToken,
                token_type: token.tokenType || "Bearer",
                refresh_token: token.refreshToken || "",
                expires_at: token.expiresAt || 0
            })
        })
        
        if (!response.ok) {
            throw new Error(`API returned ${response.status}`)
        }
        
        const data = await response.json()
        
        // Set the bot's session token in a cookie
        const redirectUrl = new URL("/dashboard", req.url)
        const response2 = NextResponse.redirect(redirectUrl)
        
        // Set the bot token in a cookie
        response2.cookies.set({
            name: "token",
            value: data.token,
            path: "/",
            secure: process.env.NODE_ENV === "production",
            httpOnly: true,
            sameSite: "lax",
            maxAge: 30 * 24 * 60 * 60 // 30 days
        })
        
        return response2
    } catch (error) {
        console.error("Failed to exchange token with backend", error)
        return NextResponse.redirect(new URL("/error", req.url))
    }
} 