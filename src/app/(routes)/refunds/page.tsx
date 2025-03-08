"use client"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "@/components/ui/accordion"
import { PiTextAlignRightBold } from "react-icons/pi"

const RefundPolicy = () => {
    return (
        <div className="w-full flex flex-col pb-[40rem] sm:pb-[20rem] pt-[5rem] max-w-5xl mx-auto">
            <h1 className="flex items-center tracking-tight text-3xl font-semibold text-white">
                <span className="p-3 mr-5 inline-flex items-center justify-center bg-stmp-300 rounded-full text-stmp-main">
                    <PiTextAlignRightBold />
                </span>
                <span className="hidden sm:inline-block">Refund Policy</span>
                <span className="inline-block sm:hidden">Refunds</span>
            </h1>

            <div className="mt-10">
                <div className="bg-stmp-200 border border-stmp-card-border rounded-2xl p-6 text-white">
                    <p className="mb-4 text-xl">Last updated and effective: 2024-01-01</p>
                    <p className="mb-6">We ("stmp", "stmp Bot", "us", "our") have a strict policy on refunds and will deny you for any refund request for one of the following reasons listed.</p>
                    
                    <h2 className="text-2xl font-medium mb-4">No refunds will be issued if:</h2>
                    <ul className="list-disc pl-6 space-y-2 mb-6">
                        <li>You elude a ban or blacklist issued by using alternative accounts or sending other individuals to make a payment on your behalf without disclosing it.</li>
                        <li>You have sent the payment and have broken any rule in our Community Discord Server after sending payment.</li>
                        <li>You are being disrespectful to stmp itself or stmp developers along with moderators or any support team.</li>
                        <li>A purchase has already been made for a server that you made again (another server will be whitelisted).</li>
                        <li>A command or any other feature has been used by you or any of your server members.</li>
                        <li>A full 24 hour cycle has progressed since the purchase by you.</li>
                        <li>You are a blacklisted user across all of our services.</li>
                        <li>You have malicious intentions with your refund.</li>
                        <li>You are forging or hiding details.</li>
                    </ul>
                    
                    <h2 className="text-2xl font-medium mb-4">Changes to the Refund Policy</h2>
                    <p>We can update these terms at any time without notice. Continuing to use our services after any changes will mean that you agree with these terms and violation of our terms of service could result in a permanent ban across all of our services.</p>
                </div>
            </div>
        </div>
    )
}

export default RefundPolicy