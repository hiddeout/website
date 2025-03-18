import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function GET(req: NextRequest) {
    console.log("Auth callback handler triggered")
    
    // Get the token from NextAuth
    const token = await getToken({ 
        req,
        secret: process.env.NEXTAUTH_SECRET
    })
    
    if (!token || !token.accessToken) {
        console.error("No token found in NextAuth session")
        return NextResponse.redirect(new URL("/login?error=unauthorized", req.url))
    }
    
    try {
        console.log(`Token found: ${token.accessToken.substring(0, 10)}...`)
        
        // Call your backend to register the token with the bot
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
        console.log(`Registering token with backend at ${apiUrl}/@me/login`)
        
        const response = await fetch(`${apiUrl}/@me/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token.accessToken}`
            },
            body: JSON.stringify({
                access_token: token.accessToken,
                token_type: token.tokenType || "Bearer",
                refresh_token: token.refreshToken || "",
                expires_at: token.expiresAt || Math.floor(Date.now() / 1000) + 86400
            }),
            // Don't send credentials for cross-origin requests
            credentials: 'same-origin'
        })
        
        if (!response.ok) {
            const errorText = await response.text()
            console.error(`API Error (${response.status}): ${errorText}`)
            throw new Error(`API returned ${response.status}: ${errorText}`)
        }
        
        const data = await response.json()
        console.log("Backend login successful, token received")
        
        // Store the token in localStorage instead of cookies to avoid CORS issues
        // The frontend will need to use this token for API requests
        
        // Set the bot's session token in a cookie
        const redirectUrl = new URL("/dashboard", req.url)
        const response2 = NextResponse.redirect(redirectUrl)
        
        // Set the token in a cookie with same-site policy
        response2.cookies.set({
            name: "token",
            value: data.token,
            path: "/",
            secure: process.env.NODE_ENV === "production",
            httpOnly: false, // Allow JS access
            sameSite: "lax",
            maxAge: 30 * 24 * 60 * 60 // 30 days
        })
        
        return response2
    } catch (error) {
        console.error("Failed to exchange token with backend", error)
        return NextResponse.redirect(new URL("/auth/error", req.url))
    }
} 