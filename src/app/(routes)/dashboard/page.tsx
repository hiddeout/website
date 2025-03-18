"use client"

import { useEffect, useState, useCallback } from "react"
import { useSession } from "next-auth/react"
import { FaServer, FaUsers, FaRobot, FaClock, FaDiscord, FaExclamationTriangle } from "react-icons/fa"
import { api } from "@/lib/api"

// Placeholder card component for dashboard stats
function StatCard({ icon: Icon, title, value, className }: { 
    icon: React.ComponentType<any>; 
    title: string; 
    value: string | number; 
    className?: string 
}) {
    return (
        <div className="flex flex-col rounded-lg border border-zinc-800 bg-zinc-900 p-6 shadow-md">
            <div className="mb-4 flex items-center">
                <Icon className={`mr-3 h-6 w-6 ${className}`} />
                <h3 className="text-sm font-medium text-zinc-400">{title}</h3>
            </div>
            <p className="text-3xl font-bold text-white">{value}</p>
        </div>
    )
}

export default function DashboardPage() {
    const { data: session, status } = useSession()
    const [user, setUser] = useState<any>(null)
    const [guilds, setGuilds] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Fetch user data and guilds from API
    const fetchData = useCallback(async () => {
        if (!session?.accessToken) return
        
        try {
            setLoading(true)
            setError(null)
            
            console.log("Session token:", session.accessToken.substring(0, 10) + "...")
            
            try {
                const userData = await api.getUserInfo()
                setUser(userData)
                console.log("User data loaded:", userData)
            } catch (userErr) {
                console.error("Failed to fetch user data:", userErr)
            }
            
            try {
                const guildsData = await api.getGuilds()
                setGuilds(guildsData)
                console.log("Guilds loaded:", guildsData)
            } catch (guildErr: any) {
                console.error("Failed to fetch guilds:", guildErr)
                setError(`Failed to load servers: ${guildErr.message || "Unknown error"}`)
            }
        } catch (err: any) {
            console.error("Failed to fetch dashboard data", err)
            setError(`Failed to load dashboard data: ${err.message || "Unknown error"}`)
        } finally {
            setLoading(false)
        }
    }, [session])
    
    useEffect(() => {
        if (session?.accessToken) {
            fetchData()
        } else if (status === "unauthenticated") {
            setLoading(false)
        }
    }, [session, status, fetchData])

    if (status === "loading") {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-zinc-300 border-t-transparent"></div>
                <span className="ml-3 text-zinc-400">Loading session...</span>
            </div>
        )
    }

    if (status === "unauthenticated") {
        return (
            <div className="rounded-lg border border-yellow-800 bg-yellow-900/20 p-6 text-center">
                <h2 className="mb-2 text-xl font-semibold text-white">Authentication Required</h2>
                <p className="mb-4 text-yellow-200">Please log in with your Discord account to view your dashboard.</p>
                <a 
                    href="/login"
                    className="inline-block rounded-md bg-zinc-800 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
                >
                    Login with Discord
                </a>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-zinc-300 border-t-transparent"></div>
                <span className="ml-3 text-zinc-400">Loading dashboard data...</span>
            </div>
        )
    }

    // Calculate stats based on API data
    const stats = [
        { 
            icon: FaServer, 
            title: "Servers", 
            value: guilds.length || 0, 
            className: "text-indigo-500" 
        },
        { 
            icon: FaUsers, 
            title: "Bot Servers", 
            value: guilds.filter(g => g.bot).length || 0, 
            className: "text-green-500" 
        },
        { 
            icon: FaRobot, 
            title: "Admin Servers", 
            value: guilds.filter(g => g.administrator).length || 0, 
            className: "text-blue-500" 
        },
        { 
            icon: FaClock, 
            title: "Owner Servers", 
            value: guilds.filter(g => g.owner).length || 0, 
            className: "text-amber-500" 
        },
    ]

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                <p className="mt-2 text-zinc-400">
                    Welcome back, {user?.username || session?.user?.name || "User"}
                </p>
            </div>

            {error && (
                <div className="rounded-lg border border-red-800 bg-red-900/20 p-4 text-red-200">
                    <div className="flex items-center">
                        <FaExclamationTriangle className="mr-2 h-5 w-5 text-red-400" />
                        <span className="font-medium">Error:</span>
                        <span className="ml-2">{error}</span>
                    </div>
                    <div className="mt-2 flex justify-end">
                        <button
                            onClick={fetchData}
                            className="rounded bg-red-800 px-3 py-1 text-sm font-medium text-white hover:bg-red-700"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => (
                    <StatCard
                        key={stat.title}
                        icon={stat.icon}
                        title={stat.title}
                        value={stat.value}
                        className={stat.className}
                    />
                ))}
            </div>

            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
                <h2 className="mb-4 text-xl font-semibold text-white">Your Servers</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {guilds.length > 0 ? (
                        guilds.map(guild => (
                            <div 
                                key={guild.id}
                                className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-800/50 p-4"
                            >
                                {guild.icon_url ? (
                                    <img 
                                        src={guild.icon_url} 
                                        alt={guild.name} 
                                        className="h-10 w-10 rounded-full"
                                    />
                                ) : (
                                    <div className="grid h-10 w-10 place-items-center rounded-full bg-zinc-700 text-sm font-medium text-white">
                                        {guild.name.charAt(0)}
                                    </div>
                                )}
                                <div className="flex-grow overflow-hidden">
                                    <p className="truncate font-medium text-white">{guild.name}</p>
                                    <p className="text-xs text-zinc-400">
                                        {guild.bot ? "Bot is in server" : "Bot not in server"}
                                    </p>
                                </div>
                                {guild.bot && (
                                    <a 
                                        href={`/dashboard/servers/${guild.id}`}
                                        className="rounded bg-stmp-main px-3 py-1 text-xs font-medium text-white hover:bg-stmp-main/80"
                                    >
                                        Manage
                                    </a>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full flex flex-col items-center gap-3 py-8 text-center text-zinc-400">
                            <FaDiscord className="h-12 w-12 text-zinc-600" />
                            <div>
                                <p className="font-medium text-zinc-300">No servers found</p>
                                <p className="mt-1 text-sm">Make sure you have the required permissions</p>
                            </div>
                            <a
                                href="/invite"
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="mt-2 inline-flex items-center rounded-md bg-stmp-main px-4 py-2 text-sm font-medium text-white hover:bg-stmp-main/80"
                            >
                                Add Bot to Server
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
} 