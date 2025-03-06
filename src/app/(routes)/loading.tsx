"use client"
import { motion } from "framer-motion"
import Image from "next/image"
import { useState, useEffect } from "react"
import stmp from "../../../public/stmppp.png"

export default function Loading({ onComplete }: { onComplete: () => void }) {
    const [isAtCenter, setIsAtCenter] = useState(false)
    const [hasAnimatedBefore, setHasAnimatedBefore] = useState(false)

    useEffect(() => {
        // Clear the animationPlayed flag on component mount
        localStorage.removeItem('animationPlayed')

        // Check if animation has played before
        const hasPlayed = localStorage.getItem('animationPlayed')
        setHasAnimatedBefore(!!hasPlayed)
        
        if (hasPlayed) {
            // Skip animation and complete immediately
            onComplete()
        }
    }, [onComplete])

    const handleAnimationComplete = () => {
        setIsAtCenter(true)
        // Store that animation has played
        localStorage.setItem('animationPlayed', 'true')
        setTimeout(onComplete, 1000)
    }

    // If animation has played before, don't render the loading screen
    if (hasAnimatedBefore) {
        return null
    }

    return (
        <div className="fixed inset-0 flex h-screen justify-center flex-col items-center bg-[#0c0d0d] z-[99]">
            <motion.div
                initial={{ opacity: 0, y: 500, scale: 0.4 }}
                animate={
                    isAtCenter
                        ? {
                              opacity: 1,
                              y: 0,
                              scale: [0.4, 0.5, 0.4],
                              transition: {
                                  duration: 1,
                                  repeat: Infinity,
                                  repeatType: "mirror"
                              }
                          }
                        : {
                              opacity: 1,
                              y: 0,
                              scale: [0.4, 0.8, 0.4],
                              transition: { duration: 1, ease: "easeInOut" }
                          }
                }
                onAnimationComplete={isAtCenter ? undefined : handleAnimationComplete}
                className="rounded-2xl">
                <Image src={stmp} alt="stmp" width={300} height={300} className="rounded-2xl" />
            </motion.div>
        </div>
    )
}
