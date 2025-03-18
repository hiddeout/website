"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { FaCog, FaTrash, FaPlus } from "react-icons/fa"
import Link from "next/link"

// This would come from your API using the Discord token
const mockServers = [
    {
        id: "865936484373766164",
        name: "Example Server 1",
        icon: "https://cdn.discordapp.com/icons/865936484373766164/a_d53dedbc06c4af6d6a98215d3da2b469.webp",
        memberCount: 1245,
        owner: true
    },
    {
        id: "876543298765432123",
        name: "Example Server 2",
        icon: null,
        memberCount: 3421,
        owner: false
    },
    {
        id: "923456789012345678",
        name: "Example Server 3",
        icon: null,
        memberCount: 521,
        owner: true
    }
]

export default function ServersPage() {
    const { data: session } = useSession()
    const [servers, setServers] = useState(mockServers)

    // In a real app, you would fetch servers using the Discord token
    // useEffect(() => {
    //   async function fetchServers() {
    //     const res = await fetch('/api/servers', {
    //       headers: {
    //         Authorization: `Bearer ${session?.accessToken}`
    //       }
    //     })
    //     const data = await res.json()
    //     setServers(data)
    //   }
    //   
    //   if (session?.accessToken) {
    //     fetchServers()
    //   }
    // }, [session])

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Manage Servers</h1>
                <p className="mt-2 text-zinc-400">
                    Configure the bot in your Discord servers
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {servers.map(server => (
                    <div 
                        key={server.id} 
                        className="flex flex-col rounded-lg border border-zinc-800 bg-zinc-900 overflow-hidden"
                    >
                        <div className="flex items-center gap-4 p-6">
                            {server.icon ? (
                                <img 
                                    src={server.icon} 
                                    alt={server.name} 
                                    className="h-12 w-12 rounded-full" 
                                />
                            ) : (
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 text-white">
                                    {server.name.charAt(0)}
                                </div>
                            )}
                            <div>
                                <h3 className="font-medium text-white">{server.name}</h3>
                                <p className="text-sm text-zinc-400">
                                    {server.memberCount.toLocaleString()} members
                                </p>
                            </div>
                        </div>
                        
                        <div className="mt-auto flex border-t border-zinc-800">
                            <Link 
                                href={`/dashboard/servers/${server.id}`}
                                className="flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
                            >
                                <FaCog className="h-4 w-4" />
                                Configure
                            </Link>
                            
                            <button 
                                className="flex flex-1 items-center justify-center gap-2 border-l border-zinc-800 py-3 text-sm font-medium text-red-500 transition-colors hover:bg-zinc-800"
                                onClick={() => console.log('Remove bot from server:', server.id)}
                            >
                                <FaTrash className="h-4 w-4" />
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
                
                {/* Add new server card */}
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-zinc-800 bg-zinc-900 p-6 text-center">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800">
                        <FaPlus className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="mb-2 font-medium text-white">Add to Server</h3>
                    <p className="mb-4 text-sm text-zinc-400">
                        Invite stmp to another Discord server
                    </p>
                    <Link 
                        href="/invite"
                        target="_blank"
                        className="rounded-md bg-stmp-main px-4 py-2 text-sm font-medium text-white hover:bg-stmp-main/80"
                    >
                        Add to Server
                    </Link>
                </div>
            </div>
        </div>
    )
} 