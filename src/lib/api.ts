import { getSession } from "next-auth/react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

class ApiClient {
    private token: string | null = null
    
    async init() {
        const session = await getSession()
        if (session?.accessToken) {
            this.token = session.accessToken
        }
    }
    
    async request<T>(
        endpoint: string, 
        options: RequestInit = {}
    ): Promise<T> {
        await this.init()
        
        const headers = {
            "Content-Type": "application/json",
            ...(this.token ? { Authorization: this.token } : {}),
            ...options.headers
        }
        
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers,
            credentials: "include"
        })
        
        if (!response.ok) {
            const error = await response.json().catch(() => null)
            throw new Error(error?.message || `API request failed with status ${response.status}`)
        }
        
        return response.json()
    }
    
    // User endpoints
    async getUserInfo() {
        return this.request<{
            id: number
            username: string
            global_name?: string
            avatar_url: string
        }>('/@me')
    }
    
    // Guild endpoints
    async getGuilds() {
        return this.request<Array<{
            id: number
            name: string
            icon_url: string
            owner: boolean
            administrator: boolean
            bot: boolean
        }>>('/@me/guilds')
    }
    
    async getGuild(guildId: string) {
        return this.request<{
            id: number
            name: string
            icon_url: string | null
            roles: Array<{
                id: number
                name: string
                color: number
                permissions: number
            }>
            channels: Array<{
                id: number
                name: string
                type: string
                position: number
                parent_id: number | null
            }>
        }>(`/@me/guilds/${guildId}`)
    }
    
    // Gateway connection for WebSockets
    createGatewayConnection(guildId: string) {
        if (!this.token) {
            throw new Error("Authentication required")
        }
        
        const wsUrl = `${API_URL.replace('http', 'ws')}/gateway?token=${this.token}&guild_id=${guildId}`
        return new WebSocket(wsUrl)
    }
}

export const api = new ApiClient() 