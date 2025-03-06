"use client"

import Particles from "@/components/ui/particles"
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text"
import Navbar from "@/components/(global)/navbar/Navbar"
import "@/styles/globals.css"
import { HeroLanding } from "@/components/sections/hero-landing"
import { motion } from "framer-motion"
import { ReactNode } from "react"
import { LuPanelLeftOpen, LuRadiation } from "react-icons/lu"
import { RiDiscordLine } from "react-icons/ri"

export default function Home() {


    return (
        <>
            <Particles />
            <Navbar />
        </>
    )
}


