"use client"

import { signIn, useSession } from "next-auth/react"
import { useEffect } from "react"
import { FaDiscord } from "react-icons/fa"
import { useRouter } from "next/navigation"

export default function LoginPage() {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === "authenticated" && session) {
            router.push("/dashboard")
        }
    }, [session, status, router])

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
            <div className="w-full max-w-md rounded-lg border border-zinc-800 bg-zinc-900 p-8 shadow-lg">
                <h1 className="mb-6 text-center text-3xl font-bold text-white">Login to Dashboard</h1>
                <p className="mb-8 text-center text-zinc-400">
                    Connect with your Discord account to access your bot dashboard
                </p>

                <button
                    onClick={() => signIn("discord", { callbackUrl: "/dashboard" })}
                    className="flex w-full items-center justify-center gap-3 rounded-md bg-[#5865F2] px-4 py-3 font-medium text-white transition-colors hover:bg-[#4752c4]"
                >
                    <FaDiscord className="h-6 w-6" />
                    <span>Login with Discord</span>
                </button>
            </div>
        </div>
    )
} 