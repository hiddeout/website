"use client"

import Loading from "@/app/(routes)/loading"
import { AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import router from "next/router"
import { useMemo, useState } from "react"
import stmp from "../../../../public/stmppp.png"
import UserMenu from "./UserMenu"

interface NavbarProps {
    children?: React.ReactNode
}

const Navbar: React.FC<NavbarProps> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true)
    const pathname = usePathname()
    const routes = useMemo(
        () => [
            {
                label: "Commands",
                destination: "/commands",
                isActive: pathname === "/commands"
            },
            {
                label: "Docs",
                destination: "https://docs.stmp.dev",
                isActive: pathname === "https://docs.stmp.dev"
            }
        ],
        [pathname]
    )

    const handleLoadingComplete = () => {
        setIsLoading(false)
    }

    if (isLoading) {
        return <Loading onComplete={handleLoadingComplete} />
    }

    return (
        <AnimatePresence>
            <div className="relative px-10 top-[30px] inset-x-0 z-[100] pb-20">
                <nav className="flex items-center justify-between w-full max-w-5xl mx-auto">
                    <div className="flex-grow basis-0">
                        <Link className="inline-flex items-center" href="/">
                            <Image
                                alt="stmp logo"
                                src={stmp}
                                width="500"
                                height="500"
                                decoding="async"
                                data-nimg="1"
                                className="w-12 h-12 md:w-16 md:h-16"
                                style={{ color: "transparent" }}
                            />
                            <h1 className="ml-3 text-3xl font-bold text-gradient"></h1>
                        </Link>
                    </div>
                    <div
                        className="items-center hidden py-4 px-6 sm:flex gap-x-10"
                        style={{
                            borderRadius: "1.25rem",
                            background:
                                "radial-gradient(1161.83% 494.55% at 50% 49.09%, rgb(17, 18, 18) 5.32%, rgb(28, 27, 27) 30.31%)",
                            backdropFilter: "blur(7.5px)"
                        }}>
                        <a
                            className="text-white font-semibold"
                            href="/commands">
                            Commands
                        </a>
                        <a
                            className="text-white font-semibold"
                            href="/status">
                            Status
                        </a>
                        <a
                            className="text-white font-semibold"
                            href="https://docs.stmp.dev">
                            Docs
                        </a>
                        <a
                            className="text-white font-semibold"
                            href="/faq">
                            FAQ
                        </a>
                    </div>
                    <div className="flex items-center justify-end flex-grow basis-0 gap-x-5">
                        <UserMenu />
                    </div>
                </nav>
            </div>
        </AnimatePresence>
    )
}

export default Navbar