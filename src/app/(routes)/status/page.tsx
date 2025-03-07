"use client"

import { AxiosPromise, AxiosRequestConfig } from "axios"
import useAxios, { RefetchOptions } from "axios-hooks"
import { Search } from "lucide-react"
import moment from "moment"
import { useEffect, useState } from "react"
import { FaUsers } from "react-icons/fa"
import { GrRefresh } from "react-icons/gr"
import { HiMiniSignal, HiServerStack } from "react-icons/hi2"
import { ImConnection } from "react-icons/im"
import { MdOutlineTimeline } from "react-icons/md"
import { PiWifiSlashBold } from "react-icons/pi"
import { TbCloudDataConnection } from "react-icons/tb"

interface IShard {
    id: string
    guilds: number
    users: number
    ping: number
    uptime: number
    is_ready: boolean
    last_updated: number
}

const MetricItem = ({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) => (
    <div className="flex flex-col gap-2">
        <p className="text-md text-stmp-main/80">{label}</p>
        <div className="flex items-center gap-2">
            {icon}
            <p className="text-md font-semibold text-white/90">{value}</p>
        </div>
    </div>
)

const Shard = ({ shard, refetch, isHighlighted }: { 
    shard: IShard
    refetch: (config?: string | AxiosRequestConfig<any> | undefined, options?: RefetchOptions) => AxiosPromise<any>
    isHighlighted: boolean 
}) => {
    const [counter, setCounter] = useState(0)
    
    // Calculate uptime based on the actual timestamp
    const getUptimeDisplay = () => {
        if (!shard.uptime) return "N/A"
        
        // Calculate seconds since the given timestamp
        const now = Date.now() / 1000
        const uptimeSeconds = now - shard.uptime
        return moment.duration(uptimeSeconds, 'seconds').humanize()
    }

    const getShardStatus = () => {
        if (!shard.is_ready) return {
            text: "Offline",
            color: "text-red-500",
            bgColor: "bg-red-500"
        }
        if (shard.ping > 1000) return {
            text: "Degraded",
            color: "text-yellow-500",
            bgColor: "bg-yellow-500"
        }
        return {
            text: "Operational",
            color: "text-green-500",
            bgColor: "bg-green-500"
        }
    }

    const status = getShardStatus()

    useEffect(() => {
        const interval = setInterval(() => {
            setCounter(prev => prev + 1)
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    // Calculate time since last update
    const lastUpdateTime = () => {
        if (!shard.last_updated) return "Unknown"
        
        const now = Date.now()
        const diff = now - shard.last_updated
        if (diff < 1000) return "Just Now"
        return `${Math.floor(diff / 1000)}s ago`
    }

    return (
        <div
            id={`shard-${shard.id}`}
            className={`
                group relative flex flex-col p-6 rounded-3xl
                bg-gradient-to-b from-stmp-200/90 to-stmp-200/80
                ${isHighlighted 
                    ? 'border-green-500/50 ring-2 ring-green-500/20 shadow-lg shadow-green-500/10' 
                    : 'border-stmp-card-border/30 hover:border-stmp-card-border/50'
                }
            `}
        >
            <div className="h-full flex flex-col justify-between space-y-4">
                <div>
                    <div className="flex items-start justify-between gap-x-4">
                        <p className="text-xl font-bold tracking-tight text-white/90">
                            Shard {shard.id}
                        </p>
                        <div className="flex items-center px-3 py-1.5 gap-2 rounded-xl bg-black/20 backdrop-blur-sm">
                            <div className={`w-2.5 h-2.5 ${status.bgColor} rounded-full animate-pulse`} />
                            <p className={`text-sm font-medium ${status.color}`}>{status.text}</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-2 text-stmp-main/70">
                        <GrRefresh className="animate-spin-slow" size={16} />
                        <p className="text-sm">
                            {lastUpdateTime()}
                        </p>
                    </div>
                </div>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                <div className="grid grid-cols-2 gap-4">
                    <MetricItem
                        label="Uptime"
                        value={getUptimeDisplay()}
                        icon={<MdOutlineTimeline className="text-stmp-main" />}
                    />
                    <MetricItem
                        label="Latency"
                        value={`${shard.ping}ms`}
                        icon={<ImConnection className="text-stmp-main" />}
                    />
                    <MetricItem
                        label="Servers"
                        value={shard.guilds.toLocaleString()}
                        icon={<HiServerStack className="text-stmp-main" />}
                    />
                    <MetricItem
                        label="Users"
                        value={shard.users.toLocaleString()}
                        icon={<FaUsers className="text-stmp-main" />}
                    />
                </div>
            </div>
        </div>
    )
}

const Status = () => {
    const [{ data, loading, error }, refetch] = useAxios({
        url: "/api/shards",  // Changed from the CDN URL to our own API route
        method: "GET"
    })
    const [highlightedShardId, setHighlightedShardId] = useState<string | null>(null)
    const [serverId, setServerId] = useState("")

    let shards: IShard[] = []

    useEffect(() => {
        console.log("API Response:", data)
    }, [data])

    if (!error && data) {
        // Make sure data.shards exists before trying to map it
        if (data.shards && Array.isArray(data.shards)) {
            shards = data.shards.map((shard: any) => ({
                id: shard.shard_id.toString(),
                guilds: shard.server_count,
                users: shard.cached_user_count,
                ping: parseFloat(shard.latency),
                uptime: shard.uptime,
                is_ready: shard.is_ready,
                last_updated: shard.last_updated
            }))
        } else if (Array.isArray(data)) {
            // If data itself is an array
            shards = data.map((shard: any) => ({
                id: shard.shard_id.toString(),
                guilds: shard.server_count,
                users: shard.cached_user_count,
                ping: parseFloat(shard.latency),
                uptime: shard.uptime,
                is_ready: shard.is_ready,
                last_updated: shard.last_updated
            }))
        } else if (data && typeof data === 'object') {
            // Handle case where data is a single object
            shards = [
                {
                    id: data.shard_id?.toString() || "0",
                    guilds: data.server_count || 0,
                    users: data.cached_user_count || 0,
                    ping: parseFloat(data.latency || "0"),
                    uptime: data.uptime || 0,
                    is_ready: data.is_ready || false,
                    last_updated: data.last_updated || 0
                }
            ]
        }
        
        console.log("Processed shards:", shards)
    }

    const handleSearch = () => {
        if (!serverId) {
            setHighlightedShardId(null)
            return
        }
        try {
            const shardId = (BigInt(serverId) >> BigInt(22)) % BigInt(shards.length)
            const shardIdString = shardId.toString()
            setHighlightedShardId(shardIdString)
            
            setTimeout(() => {
                document.getElementById(`shard-${shardIdString}`)?.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                })
            }, 100)
        } catch (error) {
            console.error("Invalid server ID")
            setHighlightedShardId(null)
        }
    }

    if (error) return (
        <main className="min-h-screen pt-20 mx-10">
            <section className="max-w-5xl mx-auto w-full pb-20 -mt-[4rem]">
                <div className="flex flex-row justify-between gap-20">
                    <div className="flex flex-row items-center gap-3 text-white">
                        <div className="flex justify-center items-center w-14 h-14 bg-gradient-to-br from-stmp-200 to-stmp-300 rounded-2xl shadow-lg">
                            <TbCloudDataConnection className="w-7 h-7" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">Shards</h1>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center pb-[40vh] pt-20">
                    <PiWifiSlashBold className="text-6xl text-stmp-300/50" />
                    <p className="text-2xl font-medium text-stmp-300/70 mt-4">No Status Available</p>
                </div>
            </section>
        </main>
    )

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-16 h-16 border-4 border-stmp-300 border-t-transparent rounded-full animate-spin" />
        </div>
    )

    return (
        <main className="pt-20 mx-10">
            <section className="max-w-5xl mx-auto w-full pb-20 -mt-[4rem]">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 sm:gap-0">
                    <div className="flex items-center gap-3 text-white w-full sm:w-auto">
                        <div className="flex justify-center items-center w-14 h-14 bg-gradient-to-br from-stmp-200 to-stmp-300 rounded-2xl shadow-lg">
                            <HiMiniSignal className="w-7 h-7 text-white" />
                        </div>
                        <div className="ml-4">
                            <h1 className="text-3xl font-bold tracking-tight">Shards</h1>
                        </div>
                    </div>
                    <div className="relative w-full sm:w-auto">
                        <input
                            type="text"
                            value={serverId}
                            onChange={(e) => setServerId(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder="Enter Server ID"
                            className="w-full sm:w-64 px-4 py-2.5 bg-stmp-300/50 backdrop-blur-sm border border-white/10 rounded-2xl text-white placeholder:text-stmp-main/70 focus:outline-none focus:ring-2 focus:ring-stmp-main/50 transition-all"
                        />
                        <button 
                            onClick={handleSearch}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-stmp-200/50 hover:bg-stmp-300/50 transition-colors"
                        >
                            <Search className="text-stmp-main" size={18} />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {shards.map((shard, index) => (
                        <Shard 
                            key={index} 
                            shard={shard} 
                            refetch={refetch}
                            isHighlighted={highlightedShardId === shard.id}
                        />
                    ))}
                </div>
            </section>
        </main>
    )
}

export default Status