import NextAuth from "next-auth"
import { AuthOptions } from "next-auth"
import DiscordProvider from "next-auth/providers/discord"

export const authOptions: AuthOptions = {
    providers: [
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID as string,
            clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
            authorization: {
                params: {
                    scope: "identify email guilds"
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, account, profile }) {
            // Persist the OAuth access_token to the token right after sign in
            if (account && account.access_token && account.token_type) {
                token.accessToken = account.access_token
                token.tokenType = account.token_type
                token.expiresAt = account.expires_at
                token.refreshToken = account.refresh_token
            }
            return token
        },
        async session({ session, token }) {
            // Send properties to the client
            session.accessToken = token.accessToken as string
            session.tokenType = token.tokenType as string
            return session
        },
        async redirect({ url, baseUrl }) {
            // Redirect to our callback endpoint after login to sync with backend
            if (url.startsWith(baseUrl)) {
                if (url.includes('/api/auth/callback/discord')) {
                    return `${baseUrl}/api/auth/callback`;
                }
                return url;
            }
            // Prevent open redirects
            return baseUrl;
        }
    },
    pages: {
        signIn: "/login",
        error: "/auth/error",
        signOut: "/"
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60 // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST } 