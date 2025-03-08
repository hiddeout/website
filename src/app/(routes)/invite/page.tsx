import { useEffect } from 'react';

'use client';


export default function InvitePage() {
    useEffect(() => {
        window.location.href = 'https://discordapp.com/oauth2/authorize?client_id=1306806003685265528&scope=bot+applications.commands&permissions=8';
    }, []);

    return (
        <div className="flex min-h-screen items-center justify-center">
            <p>Redirecting to Discord...</p>
        </div>
    );
}