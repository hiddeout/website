import "@/styles/globals.css"
import type { Metadata, Viewport } from "next"

export const viewport: Viewport = {
    themeColor: "transparent"
}

type Props = {
    children: React.ReactNode
    params: { page?: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const pageName = params.page ? ` - ${params.page}` : ''
    
    return {
        title: `stmp${pageName}`,
        description: "a premium discord bot giving you the resources to create a powerful and versatile community at the tip of your fingers.",
        twitter: {
            site: "https://stmp.dev/",
            card: "player"
        },
        openGraph: {
            url: "https://stmp.dev/",
            type: "website",
            title: `stmp${pageName}`,
            siteName: "stmp.dev",
            description: "a premium discord bot giving you the resources to create a powerful and versatile community at the tip of your fingers.",
            images: [
                {
                    url: "https://cdn.stmp.dev/stmppp.png",
                    width: 500,
                    height: 500,
                    alt: "stmp"
                }
            ]
        }
    }
}

export default function RootLayout({ children }: Props) {
    return (
        <html lang="en">
            <body className={`font-satoshi flex flex-col m-h-screen justify-between`}>
                {children}
            </body>
        </html>
    )
}