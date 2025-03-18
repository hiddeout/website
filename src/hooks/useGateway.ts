import { useState, useEffect, useRef, useCallback } from "react"
import { api } from "@/lib/api"

type GatewayEvent = {
    event: string
    data: any
}

type GatewayState = {
    connected: boolean
    guild: any | null
    member: any | null
    error: Error | null
}

type GatewayOptions = {
    onEvent?: (event: string, data: any) => void
}

export function useGateway(guildId: string | null, options?: GatewayOptions) {
    const [state, setState] = useState<GatewayState>({
        connected: false,
        guild: null,
        member: null,
        error: null
    })
    
    const socketRef = useRef<WebSocket | null>(null)
    const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null)
    const lastHeartbeatAckRef = useRef<boolean>(false)
    const isConnectingRef = useRef<boolean>(false)
    
    const send = useCallback((event: string, data: any = {}) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({ event, data }))
            return true
        }
        return false
    }, [])
    
    const disconnect = useCallback(() => {
        if (heartbeatIntervalRef.current) {
            clearInterval(heartbeatIntervalRef.current)
            heartbeatIntervalRef.current = null
        }
        
        if (socketRef.current) {
            socketRef.current.close()
            socketRef.current = null
        }
        
        setState(prev => ({ ...prev, connected: false }))
    }, [])
    
    const connect = useCallback(async () => {
        if (!guildId || isConnectingRef.current || socketRef.current) return
        
        isConnectingRef.current = true
        
        try {
            const socket = await api.createGatewayConnection(guildId)
            socketRef.current = socket
            
            socket.onopen = () => {
                setState(prev => ({ ...prev, connected: true, error: null }))
                isConnectingRef.current = false
            }
            
            socket.onclose = () => {
                disconnect()
                isConnectingRef.current = false
            }
            
            socket.onerror = (error) => {
                setState(prev => ({ ...prev, error: new Error("WebSocket error") }))
                disconnect()
                isConnectingRef.current = false
            }
            
            socket.onmessage = (event) => {
                try {
                    const message: GatewayEvent = JSON.parse(event.data)
                    
                    switch (message.event) {
                        case "PREPARE":
                            const heartbeatInterval = message.data.interval
                            
                            // Set up heartbeat
                            if (heartbeatIntervalRef.current) {
                                clearInterval(heartbeatIntervalRef.current)
                            }
                            
                            heartbeatIntervalRef.current = setInterval(() => {
                                if (!lastHeartbeatAckRef.current) {
                                    // No heartbeat acknowledgement, reconnect
                                    disconnect()
                                    setTimeout(() => connect(), 5000)
                                    return
                                }
                                
                                lastHeartbeatAckRef.current = false
                                send("HEARTBEAT", {})
                            }, heartbeatInterval)
                            break
                            
                        case "HEARTBEAT_ACK":
                            lastHeartbeatAckRef.current = true
                            break
                            
                        case "IDENTIFY":
                            setState(prev => ({
                                ...prev,
                                guild: message.data.guild,
                                member: message.data.member
                            }))
                            break
                            
                        default:
                            // Handle custom events
                            options?.onEvent?.(message.event, message.data)
                            break
                    }
                } catch (err) {
                    console.error("Failed to parse gateway message", err)
                }
            }
        } catch (error) {
            console.error("Failed to connect to gateway", error)
            setState(prev => ({ ...prev, error: error as Error }))
            isConnectingRef.current = false
        }
    }, [guildId, disconnect, send, options])
    
    useEffect(() => {
        let isMounted = true
        
        if (guildId && isMounted && !isConnectingRef.current && !socketRef.current) {
            connect();
        }
        
        return () => {
            isMounted = false
            disconnect()
        }
    }, [guildId, connect, disconnect])
    
    return {
        ...state,
        send,
        reconnect: connect,
        disconnect
    }
} 