import "next-auth"

declare module "next-auth" {
    interface Session {
        accessToken: string
        tokenType: string
        user: {
            id: string
            name: string
            email: string
            image: string
        }
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken: string
        tokenType: string
        expiresAt?: number
        refreshToken?: string
    }
} 