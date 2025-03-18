import { getSession } from "next-auth/react"

// Use our proxy instead of directly accessing the API
const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
const API_URL = "/api/proxy" // Local proxy to avoid CORS issues

// Helper function to get cookies
function getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;
    
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
}

// Extract token from Authorization header value
function extractToken(authHeader: string | null): string | null {
    if (!authHeader) return null;
    
    // If it starts with 'Bearer ', remove that prefix
    if (authHeader.startsWith('Bearer ')) {
        return authHeader.substring(7);
    }
    
    return authHeader;
}

class ApiClient {
    private token: string | null = null
    private initPromise: Promise<void> | null = null
    
    async init() {
        // If already initializing, wait for that to complete
        if (this.initPromise) return this.initPromise
        
        // If token is already set, no need to get session
        if (this.token) return Promise.resolve()
        
        // Create a new initialization promise
        this.initPromise = new Promise<void>(async (resolve) => {
            try {
                // Try to get token from cookies first (for the API server)
                const cookieToken = getCookie('token');
                if (cookieToken) {
                    this.token = cookieToken;
                    console.log("Using token from cookies");
                    resolve();
                    return;
                }
                
                // Fall back to session token (from Discord OAuth)
                const session = await getSession()
                if (session?.accessToken) {
                    this.token = session.accessToken
                    console.log("Using token from session");
                }
            } catch (error) {
                console.error("Failed to get session", error)
            } finally {
                this.initPromise = null
                resolve()
            }
        })
        
        return this.initPromise
    }
    
    async request<T>(
        endpoint: string, 
        options: RequestInit = {}
    ): Promise<T> {
        await this.init()
        
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
            ...options.headers as Record<string, string>
        }
        
        // Ensure the Authorization header is properly formatted
        if (this.token) {
            // Token will be prefixed with Bearer in the proxy
            headers["Authorization"] = this.token;
        }
        
        // Normalize the endpoint - remove leading / or @ to avoid double slashes
        let cleanEndpoint = endpoint;
        if (cleanEndpoint.startsWith('/')) {
            cleanEndpoint = cleanEndpoint.substring(1);
        }
        
        // Construct the URL properly
        const url = `${API_URL}${cleanEndpoint}`;
        
        console.log(`Making request to ${url} with token: ${this.token ? "present" : "missing"}`)
        
        const response = await fetch(url, {
            ...options,
            headers,
            // We can use include now since we're not making cross-origin requests
            credentials: 'include'
        })
        
        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: response.statusText }))
            console.error(`API Error (${response.status}): ${error.message || "Unknown error"}`)
            throw new Error(error.message || `API request failed with status ${response.status}`)
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
        }>('@me')
    }
    
    // Guild endpoints
    async getGuilds() {
        try {
            console.log('Fetching guilds from API...')
            const guilds = await this.request<Array<{
                id: number
                name: string
                icon_url: string
                owner: boolean
                administrator: boolean
                bot: boolean
            }>>('@me/guilds')
            
            console.log(`Fetched ${guilds.length} guilds`)
            return guilds
        } catch (error) {
            console.error('Failed to fetch guilds:', error)
            throw error
        }
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
        }>(`@me/guilds/${guildId}`)
    }
    
    // Gateway connection for WebSockets - this still needs to use the direct URL
    async createGatewayConnection(guildId: string) {
        await this.init()
        
        if (!this.token) {
            throw new Error("Authentication required")
        }
        
        // For WebSockets, we still need to use the direct backend URL
        const wsUrl = `${BACKEND_API_URL.replace(/^http/, 'ws')}/gateway?token=${this.token}&guild_id=${guildId}`
        console.log(`Creating WebSocket connection to ${wsUrl}`)
        return new WebSocket(wsUrl)
    }
    
    // Method to set token manually (useful for tests or when token is already known)
    setToken(token: string) {
        this.token = token
    }
}

export const api = new ApiClient() 