"use client"
import { useEffect } from "react"
import moment from "moment"
import { useParams } from "next/navigation"
import useAxios from 'axios-hooks'
import BackToTopButton from "@/components/TopButton"
import { UserCircle } from "lucide-react"

interface User {
    id: number;
    name: string;
    avatar: string;
}

interface AvatarHistory {
    asset: string;
    updated_at: number;
}

interface AvatarData {
    user: User;
    avatars: AvatarHistory[];
}

export default function AvatarPage() {
    const params = useParams()
    const userId = params?.userId as string

    const [{ data, loading, error }, refetch] = useAxios({
        url: `https://api.stmp.dev/avatars/${userId}`,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        timeout: 10000,
    }, {
        useCache: false,
        manual: true // Prevent auto-fetching
    })

    useEffect(() => {
        let mounted = true
        const controller = new AbortController()

        const fetchData = async () => {
            if (!userId || !mounted) return

            try {
                await refetch({
                    signal: controller.signal
                })
            } catch (err) {
                if (mounted) {
                    console.error('API Error:', err)
                }
            }
        }

        fetchData()

        return () => {
            mounted = false
            controller.abort()
        }
    }, [userId, refetch])

    useEffect(() => {
        if (error) {
            console.error('API Error:', error)
        }
    }, [error])

    if (error) {
        return (
            <div className="p-6">
                <div className="w-full flex flex-col max-w-5xl mx-auto">
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <p className="text-red-400">
                            {error.response?.status === 404 
                                ? "User not found. Please check the Discord ID."
                                : "Failed to load avatar data. Please try again."}
                        </p>
                        <button 
                            onClick={() => refetch()} 
                            className="mt-4 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    if (loading || !data) {
        return (
            <div className="p-6">
                <div className="w-full flex flex-col max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-stmp-200 rounded-lg h-64"></div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="p-6">
            <div className="w-full flex flex-col max-w-5xl mx-auto">
                <BackToTopButton />
                <div className="flex flex-row justify-between items-center">
                    <div className="flex justify-center items-center space-x-2">
                        <div className="rounded-full p-3 border border-stmp-card-border bg-stmp-200">
                            <UserCircle size="25" className="text-stmp-main" />
                        </div>
                        <div className="text-2xl font-bold text-white sm:text-3xl">
                            Avatar History
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <div className="bg-stmp-200 rounded-lg p-6 border border-stmp-card-border mb-8">
                        <div className="flex items-center gap-4">
                            <img
                                src={data.user.avatar}
                                alt={data.user.name}
                                className="w-16 h-16 rounded-full"
                            />
                            <div>
                                <h3 className="text-xl font-medium text-white">{data.user.name}</h3>
                                <p className="text-sm text-neutral-400">Discord ID: {data.user.id}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {data.avatars.map((avatar: AvatarHistory, index: number) => (
                            <div key={index} className="flex flex-col py-6 rounded-3xl bg-stmp-200 border border-stmp-card-border">
                                <div className="px-6">
                                    <img
                                        src={avatar.asset}
                                        alt={`Avatar history ${index + 1}`}
                                        className="w-full h-32 object-cover rounded-lg shadow-lg mb-4"
                                    />
                                    <div className="text-sm text-stmp-secondary">
                                        <p className="text-neutral-400">
                                            {moment.unix(avatar.updated_at).format('MMMM Do YYYY, h:mm:ss a')}
                                        </p>
                                    </div>
                                    <div className="mt-4">
                                        <a 
                                            href={avatar.asset}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-stmp-main hover:text-stmp-main-200 transition-colors"
                                        >
                                            View Full Size →
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}