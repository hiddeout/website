import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

// This would be a real API endpoint in production
export async function GET(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

    if (!token || !token.accessToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        // In a real application, you would fetch the user's guilds from Discord API
        // const response = await fetch("https://discord.com/api/users/@me/guilds", {
        //     headers: {
        //         Authorization: `Bearer ${token.accessToken}`
        //     }
        // })
        // 
        // if (!response.ok) {
        //     throw new Error(`Discord API returned ${response.status}`)
        // }
        // 
        // const guilds = await response.json()
        
        // Mock response for demonstration
        const mockGuilds = [
            {
                id: "865936484373766164",
                name: "Example Server 1",
                icon: "a_d53dedbc06c4af6d6a98215d3da2b469",
                owner: true,
                permissions: "140737488355327",
                features: ["COMMUNITY", "NEWS"],
                memberCount: 1245
            },
            {
                id: "876543298765432123",
                name: "Example Server 2",
                icon: null,
                owner: false,
                permissions: "140737488355327",
                features: [],
                memberCount: 3421
            },
            {
                id: "923456789012345678",
                name: "Example Server 3",
                icon: null,
                owner: true,
                permissions: "140737488355327",
                features: ["COMMUNITY"],
                memberCount: 521
            }
        ]
        
        // Process guilds to add icon URLs
        const processedGuilds = mockGuilds.map(guild => ({
            ...guild,
            icon: guild.icon 
                ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp` 
                : null
        }))
        
        return NextResponse.json(processedGuilds)
    } catch (error) {
        console.error("Error fetching guilds:", error)
        return NextResponse.json(
            { error: "Failed to fetch Discord servers" },
            { status: 500 }
        )
    }
} 