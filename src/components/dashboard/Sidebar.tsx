"use client"

import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
    FaHome, 
    FaServer, 
    FaChartBar, 
    FaCog, 
    FaSignOutAlt, 
    FaDiscord 
} from "react-icons/fa"

const navLinks = [
    { href: "/dashboard", icon: FaHome, label: "Overview" },
    { href: "/dashboard/servers", icon: FaServer, label: "Servers" },
    { href: "/dashboard/analytics", icon: FaChartBar, label: "Analytics" },
    { href: "/dashboard/settings", icon: FaCog, label: "Settings" }
]

export function Sidebar() {
    const { data: session } = useSession()
    const pathname = usePathname()

    return (
        <div className="flex h-screen w-64 flex-col border-r border-zinc-800 bg-zinc-900">
            <div className="flex items-center justify-center p-6">
                <FaDiscord className="mr-2 h-6 w-6 text-[#5865F2]" />
                <span className="text-xl font-bold text-white">stmp Dashboard</span>
            </div>
            
            <div className="flex-1 overflow-y-auto">
                <nav className="mt-6 px-4">
                    <ul className="space-y-2">
                        {navLinks.map(({ href, icon: Icon, label }) => {
                            const isActive = pathname === href
                            return (
                                <li key={href}>
                                    <Link
                                        href={href}
                                        className={`flex items-center rounded-md px-4 py-3 text-sm font-medium transition-colors ${
                                            isActive
                                                ? "bg-zinc-800 text-white"
                                                : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                                        }`}
                                    >
                                        <Icon className="mr-3 h-5 w-5" />
                                        {label}
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </nav>
            </div>

            {session?.user && (
                <div className="border-t border-zinc-800 p-4">
                    <div className="mb-4 flex items-center">
                        {session.user.image ? (
                            <img
                                src={session.user.image}
                                alt={session.user.name || "User"}
                                className="mr-3 h-8 w-8 rounded-full"
                            />
                        ) : (
                            <div className="mr-3 h-8 w-8 rounded-full bg-zinc-700" />
                        )}
                        <div>
                            <p className="text-sm font-medium text-white">{session.user.name}</p>
                            <p className="text-xs text-zinc-400">{session.user.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="flex w-full items-center rounded-md px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
                    >
                        <FaSignOutAlt className="mr-2 h-4 w-4" />
                        Sign Out
                    </button>
                </div>
            )}
        </div>
    )
} 