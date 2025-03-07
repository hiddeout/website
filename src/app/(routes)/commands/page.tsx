"use client"
import { useState, useEffect } from "react"
import useAxios from "axios-hooks"
import Loading from "../loading"
import { CommandsPage } from "./components/Commands"
import { getCategoriesFromCommands } from "@/data/Commands"
import { Category, Command } from "@/types/Command"

const Commands = () => {
    const [{ data, loading, error }] = useAxios({
        url: "/api/commands",  // Changed to use the API route
        method: "GET"
    })

    const [commands, setCommands] = useState<Command[] | null>(null)
    const [categories, setCategories] = useState<Category[] | null>(null)
    const [loadingComplete, setLoadingComplete] = useState(false)

    useEffect(() => {
        if (data?.cogs) {
            const cmds: Command[] = []
            data.cogs.forEach((cog: any) => {
                cog.commands.forEach((cmd: any) => {
                    cmds.push({
                        name: cmd.name,
                        permissions: cmd.permission,
                        parameters: cmd.syntax,
                        description: cmd.description,
                        category: cog.cog_name,
                        args: Array.isArray(cmd.args)
                            ? cmd.args
                            : typeof cmd.args === "string"
                            ? [cmd.args]
                            : []
                    })
                })
            })
            setCommands(cmds)
            setCategories(getCategoriesFromCommands(cmds))
            setLoadingComplete(true)
        }
    }, [data])

    const handleLoadingComplete = () => {
        setLoadingComplete(true)
    }

    if (error) return <CommandsPage commands={null} categories={null} />

    return loading || !loadingComplete ? (
        <Loading onComplete={handleLoadingComplete} />
    ) : (
        <CommandsPage commands={commands} categories={categories} />
    )
}

export default Commands