/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    async rewrites() {
        return [
            {
                source: "/",
                destination: "/index.html"
            }
        ]
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'i.imgur.com',
                pathname: '/**'
            },
            {
                protocol: 'https',
                hostname: 'cdn.stmp.dev',
                pathname: '/**'
            }
        ]
    }
}

export default nextConfig
