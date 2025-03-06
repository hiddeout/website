"use client"

import Particles from "@/components/ui/particles"
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text"
import Navbar from "@/components/(global)/navbar/Navbar"
import "@/styles/globals.css"
import { ArrowRightIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { BorderBeam } from "@/components/magicui/border-beam"

export default function Home() {
    return (
        <>
            <Particles />
            <Navbar />
            <div className="z-10 flex min-h-64 items-center justify-center">
                <div
                    className={cn(
                        "group relative rounded-full border border-black/5 bg-transparent text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-black/5 dark:border-white/5 dark:bg-transparent dark:hover:bg-white/5",
                    )}
                >
                    <AnimatedGradientText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
                        <span>✨ Add Me To Your Server</span>
                    </AnimatedGradientText>
                    <BorderBeam duration={8} size={100} />

                </div>
            </div>
        </>
    )
}