"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Sidebar } from "@/components/dashboard/Sidebar"

export default function DashboardLayout({
    children
}: {
    children: React.ReactNode
}) {
    const { data: session, status } = useSession()

    if (status === "loading") {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-transparent"></div>
            </div>
        )
    }

    if (!session) {
        redirect("/login")
    }

    return (
        <div className="flex min-h-screen flex-1 bg-zinc-950">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
    )
} 