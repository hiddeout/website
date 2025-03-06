"use client"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "@/components/ui/accordion"
import { PiTextAlignRightBold } from "react-icons/pi"

const HTMLContent = ({ html }: { html: string }) => {
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

const faqItems = [
    {
        question: "Is stmp available for free and public use?",
        answer: "No, stmp is a premium discord bot. You must purchase either a <strong>one-time</strong> or <strong>monthly</strong> subscription in order to be whitelisted."
    },
    {
        question: "How can I pay for stmp?",
        answer: 'You can pay for stmp by making a ticket in the <a href="https://discord.gg/hGHjhGnCk4" target="_blank" rel="noopener noreferrer" style="color:rgb(114, 162, 172);">Discord Server</a>. Accepted payment methods are: <strong>PayPal, Venmo, CashApp, Bitcoin, Ethereum, Litecoin, Apple Pay, Google Pay, Bank Transfer, Debit & Credit Cards.</strong>'
    },
    {
        question: "How much does stmp cost?",
        answer: "stmp costs either <strong>$5 USD. USD monthly</strong> or <strong>$20.00 USD one-time.</strong> Bare in mind, the $11.50 monthly payment is indefinite, it does not end after three months."
    }
]

const FAQPage = () => {
    return (
        <div className="w-full flex flex-col pb-[40rem] sm:pb-[20rem] pt-[5rem] max-w-5xl mx-auto">
            <h1 className="flex items-center tracking-tight text-3xl font-semibold text-white">
                <span className="p-3 mr-5 inline-flex items-center justify-center bg-stmp-300 rounded-full text-stmp-main">
                    <PiTextAlignRightBold />
                </span>
                <span className="hidden sm:inline-block">Frequently Asked Questions</span>
                <span className="inline-block sm:hidden">FAQ</span>
            </h1>

            <div className="mt-10">
                <Accordion type="single" collapsible className="space-y-4">
                    {faqItems.map((item, index) => (
                        <AccordionItem
                            key={index}
                            value={`item-${index}`}
                            className="border border-stmp-card-border rounded-2xl overflow-hidden bg-stmp-200"
                        >
                            <AccordionTrigger className="px-5 py-6 text-white text-lg font-medium group flex flex-1 text-left cursor-pointer items-center justify-between outline-none no-underline hover:no-underline">
                                {item.question}
                            </AccordionTrigger>
                            <AccordionContent className="bg-stmp-300 text-white font-normal px-5 py-6 text-xl">
                                <HTMLContent html={item.answer} />
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </div>
    )
}

export default FAQPage