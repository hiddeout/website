"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useParams, useRouter } from "next/navigation"
import { FaSave, FaArrowLeft, FaCog, FaPencilAlt, FaBell } from "react-icons/fa"
import Link from "next/link"
import { api } from "@/lib/api"
import { useGateway } from "@/hooks/useGateway"

export default function ServerConfigPage() {
    const params = useParams()
    const router = useRouter()
    const { data: session } = useSession()
    const serverId = params.serverId as string
    
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [server, setServer] = useState<any>(null)
    const [settings, setSettings] = useState({
        prefix: "!",
        modules: {
            welcome: false,
            moderation: false,
            automod: false,
            logging: false
        },
        welcomeChannel: "",
        welcomeMessage: "Welcome {user} to {server}!",
        logChannel: ""
    })
    const [activeTab, setActiveTab] = useState("general")
    
    // Connect to WebSocket for real-time updates
    const gateway = useGateway(serverId, {
        onEvent: (event, data) => {
            // Handle server-specific events
            if (event === "SETTINGS_UPDATE") {
                setSettings(prev => ({ ...prev, ...data }))
            }
        }
    })
    
    // Fetch server data
    useEffect(() => {
        async function fetchServer() {
            try {
                setLoading(true)
                const serverData = await api.getGuild(serverId)
                setServer(serverData)
                
                // You would also fetch settings here
                try {
                    const settingsData = await api.request<any>(`/@me/guilds/${serverId}/settings`)
                    setSettings({
                        prefix: settingsData.prefix || "!",
                        modules: settingsData.modules || {
                            welcome: false,
                            moderation: false,
                            automod: false,
                            logging: false
                        },
                        welcomeChannel: settingsData.welcome?.channel || "",
                        welcomeMessage: settingsData.welcome?.message || "Welcome {user} to {server}!",
                        logChannel: settingsData.logging?.channel || ""
                    })
                } catch (settingsError) {
                    console.error("Failed to fetch settings", settingsError)
                    // Continue with default settings
                }
            } catch (err) {
                console.error("Failed to fetch server", err)
                setError("Failed to load server data. Make sure the bot is in this server and you have the required permissions.")
            } finally {
                setLoading(false)
            }
        }
        
        if (session?.accessToken && serverId) {
            fetchServer()
        }
    }, [session, serverId])

    const handleSaveSettings = async () => {
        try {
            // Prepare settings in the format expected by the backend
            const settingsPayload = {
                prefix: settings.prefix,
                modules: settings.modules,
                welcome: {
                    channel: settings.welcomeChannel,
                    message: settings.welcomeMessage
                },
                logging: {
                    channel: settings.logChannel
                }
            }
            
            // Save settings via API
            await api.request(`/@me/guilds/${serverId}/settings`, {
                method: "POST",
                body: JSON.stringify(settingsPayload)
            })
            
            alert("Settings saved successfully!")
        } catch (err) {
            console.error("Failed to save settings", err)
            alert("Failed to save settings. Please try again later.")
        }
    }

    const handleModuleToggle = (module: string) => {
        setSettings({
            ...settings,
            modules: {
                ...settings.modules,
                [module]: !settings.modules[module as keyof typeof settings.modules]
            }
        })
    }
    
    if (loading) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-zinc-300 border-t-transparent"></div>
            </div>
        )
    }
    
    if (error) {
        return (
            <div className="rounded-lg border border-red-800 bg-red-900/20 p-6 text-center">
                <h2 className="mb-2 text-xl font-semibold text-white">Error</h2>
                <p className="text-red-200">{error}</p>
                <Link 
                    href="/dashboard/servers"
                    className="mt-4 inline-block rounded-md bg-zinc-800 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
                >
                    Back to Servers
                </Link>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link 
                        href="/dashboard/servers" 
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-white transition-colors hover:bg-zinc-700"
                    >
                        <FaArrowLeft className="h-4 w-4" />
                    </Link>
                    
                    <div>
                        <h1 className="text-3xl font-bold text-white">{server?.name || "Server"}</h1>
                        <p className="text-sm text-zinc-400">Server ID: {serverId}</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    {gateway.connected && (
                        <span className="flex items-center gap-2 text-sm text-green-400">
                            <span className="h-2 w-2 rounded-full bg-green-400"></span>
                            Real-time connected
                        </span>
                    )}
                    <button
                        onClick={handleSaveSettings}
                        className="flex items-center gap-2 rounded-md bg-stmp-main px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-stmp-main/80"
                    >
                        <FaSave className="h-4 w-4" />
                        Save Changes
                    </button>
                </div>
            </div>
            
            {/* Tabs */}
            <div className="flex border-b border-zinc-800">
                <button
                    className={`px-4 py-2 text-sm font-medium ${
                        activeTab === "general" 
                            ? "border-b-2 border-stmp-main text-white" 
                            : "text-zinc-400 hover:text-white"
                    }`}
                    onClick={() => setActiveTab("general")}
                >
                    <FaCog className="mr-2 inline-block h-4 w-4" />
                    General
                </button>
                <button
                    className={`px-4 py-2 text-sm font-medium ${
                        activeTab === "welcome" 
                            ? "border-b-2 border-stmp-main text-white" 
                            : "text-zinc-400 hover:text-white"
                    }`}
                    onClick={() => setActiveTab("welcome")}
                >
                    <FaBell className="mr-2 inline-block h-4 w-4" />
                    Welcome
                </button>
                <button
                    className={`px-4 py-2 text-sm font-medium ${
                        activeTab === "commands" 
                            ? "border-b-2 border-stmp-main text-white" 
                            : "text-zinc-400 hover:text-white"
                    }`}
                    onClick={() => setActiveTab("commands")}
                >
                    <FaPencilAlt className="mr-2 inline-block h-4 w-4" />
                    Commands
                </button>
            </div>
            
            {/* Tab Content */}
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
                {activeTab === "general" && (
                    <div className="space-y-6">
                        <div>
                            <h3 className="mb-2 text-lg font-medium text-white">Prefix</h3>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={settings.prefix}
                                    onChange={e => setSettings({ ...settings, prefix: e.target.value })}
                                    className="w-16 rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white"
                                    maxLength={3}
                                />
                                <p className="text-zinc-400">The prefix used for bot commands</p>
                            </div>
                        </div>
                        
                        <div>
                            <h3 className="mb-2 text-lg font-medium text-white">Modules</h3>
                            <div className="space-y-3">
                                {Object.entries(settings.modules).map(([module, enabled]) => (
                                    <div key={module} className="flex items-center gap-3">
                                        <label className="relative inline-flex cursor-pointer items-center">
                                            <input
                                                type="checkbox"
                                                className="peer sr-only"
                                                checked={enabled}
                                                onChange={() => handleModuleToggle(module)}
                                            />
                                            <div className="peer h-6 w-11 rounded-full bg-zinc-700 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-stmp-main peer-checked:after:translate-x-full"></div>
                                        </label>
                                        <span className="text-white capitalize">{module}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div>
                            <h3 className="mb-2 text-lg font-medium text-white">Logging</h3>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={settings.logChannel}
                                    onChange={e => setSettings({ ...settings, logChannel: e.target.value })}
                                    className="max-w-xs rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white"
                                    list="channel-options"
                                />
                                <p className="text-zinc-400">Channel for bot logs</p>
                                
                                <datalist id="channel-options">
                                    {server?.channels
                                        ?.filter((c: any) => c.type === "GUILD_TEXT")
                                        ?.map((channel: any) => (
                                            <option key={channel.id} value={channel.name} />
                                        ))}
                                </datalist>
                            </div>
                        </div>
                    </div>
                )}
                
                {activeTab === "welcome" && (
                    <div className="space-y-6">
                        <div>
                            <h3 className="mb-2 text-lg font-medium text-white">Welcome Channel</h3>
                            <input
                                type="text"
                                value={settings.welcomeChannel}
                                onChange={e => setSettings({ ...settings, welcomeChannel: e.target.value })}
                                className="w-full max-w-md rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white"
                                placeholder="general"
                                list="channel-options"
                            />
                            <p className="mt-1 text-xs text-zinc-400">The channel where welcome messages will be sent</p>
                        </div>
                        
                        <div>
                            <h3 className="mb-2 text-lg font-medium text-white">Welcome Message</h3>
                            <textarea
                                value={settings.welcomeMessage}
                                onChange={e => setSettings({ ...settings, welcomeMessage: e.target.value })}
                                className="h-32 w-full max-w-lg rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white"
                                placeholder="Welcome {user} to {server}!"
                            />
                            <p className="mt-1 text-xs text-zinc-400">
                                Available variables: {'{user}'} - Username, {'{server}'} - Server name
                            </p>
                        </div>
                    </div>
                )}
                
                {activeTab === "commands" && (
                    <div>
                        <h3 className="mb-4 text-lg font-medium text-white">Custom Commands</h3>
                        <p className="text-zinc-400">
                            Custom commands feature will be available soon!
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
} 