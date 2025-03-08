import "@/styles/globals.css"
import Image from "next/image"
import Link from "next/link"
import stmp from "../../../public/stmppp.png"

export const Footer = () => {
    return (
        <footer className="mt-auto w-full py-14 px-6 shadow-xl shadow-stmp-main border-t border-stmp-card-border bg-[#111212]">
            <div className="max-w-5xl mx-auto w-full grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-10">
                <div className="flex flex-col items-center sm:items-start">
                    <Image
                        src={stmp}
                        alt="STMP Logo" 
                        width={80}
                        height={80}
                        className="logo-shadow"
                    />
                    <div className="mt-4 sm:mt-0 flex-grow flex items-end">
                        <p className="text-xs text-neutral-300 text-center sm:text-left leading-5">
                            Copyright © {new Date().getFullYear()} stmp.dev,{' '}
                            <span className="block sm:inline-block">All rights reserved.</span>
                        </p>
                    </div>
                </div>

                <div className="flex flex-col items-center sm:items-start">
                    <p className="text-xl font-semibold text-white">Bot</p>
                    <div className="mt-6 flex flex-col items-center sm:items-start gap-y-4">
                        <Link href="/invite" className="font-medium text-stmp-main transition duration-200 ease-linear hover:text-stmp-main/80">
                            Invite
                        </Link>
                        <Link href="https://docs.stmp.dev/" target="_blank" rel="noopener noreferrer" className="font-medium text-stmp-main transition duration-200 ease-linear hover:text-stmp-main/80">
                            Documentation
                        </Link>
                        <Link href="https://discord.gg/stmp" target="_blank" rel="noopener noreferrer" className="font-medium text-stmp-main transition duration-200 ease-linear hover:text-stmp-main/80">
                            Support Server
                        </Link>
                    </div>
                </div>

                <div className="flex flex-col items-center sm:items-start">
                    <p className="text-xl font-semibold text-white">Legal</p>
                    <div className="mt-6 flex flex-col items-center sm:items-start gap-y-4">
                        <Link href="/terms" className="font-medium text-stmp-main transition duration-200 ease-linear hover:text-stmp-main/80">
                            Terms of Service
                        </Link>
                        <Link href="/privacy" className="font-medium text-stmp-main transition duration-200 ease-linear hover:text-stmp-main/80">
                            Privacy Policy
                        </Link>
                        <Link href="/refunds" className="font-medium text-stmp-main transition duration-200 ease-linear hover:text-stmp-main/80">
                            Refund Policy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}