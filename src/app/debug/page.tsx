'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { getSession } from 'next-auth/react';

export default function DebugPage() {
  const [token, setToken] = useState<string | null>(null);
  const [userResponse, setUserResponse] = useState<string | null>(null);
  const [guildsResponse, setGuildsResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const session = await getSession();
        if (session?.accessToken) {
          setToken(session.accessToken);
        }
      } catch (err) {
        setError(`Session error: ${(err as Error).message}`);
      }
    };
    
    loadSession();
  }, []);

  const testDirectProxy = async (endpoint: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = token;
      }
      
      const response = await fetch(`/api/proxy/${endpoint}`, {
        headers,
        credentials: 'include'
      });
      
      if (!response.ok) {
        setError(`API Error: ${response.status} ${response.statusText}`);
        const errorText = await response.text();
        return `Error ${response.status}: ${errorText}`;
      }
      
      const data = await response.json();
      return JSON.stringify(data, null, 2);
    } catch (err) {
      const message = `Request error: ${(err as Error).message}`;
      setError(message);
      return `Error: ${message}`;
    } finally {
      setLoading(false);
    }
  };

  const testApiClient = async () => {
    setLoading(true);
    setError(null);
    
    try {
      setUserResponse('Loading user data...');
      const userData = await api.getUserInfo();
      setUserResponse(JSON.stringify(userData, null, 2));
      
      setGuildsResponse('Loading guilds data...');
      const guildsData = await api.getGuilds();
      setGuildsResponse(JSON.stringify(guildsData, null, 2));
    } catch (err) {
      setError(`API client error: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">API Debug Page</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}
      
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Session</h2>
        <p>Token: {token ? '✅ Present' : '❌ Missing'}</p>
        {token && (
          <div className="mt-2">
            <details>
              <summary>Show Token</summary>
              <pre className="bg-gray-100 p-2 rounded mt-2 overflow-x-auto">{token}</pre>
            </details>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <button
          onClick={() => testDirectProxy('@me').then(setUserResponse)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          disabled={loading}
        >
          Test Direct User Proxy
        </button>
        
        <button
          onClick={() => testDirectProxy('@me/guilds').then(setGuildsResponse)}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          disabled={loading}
        >
          Test Direct Guilds Proxy
        </button>
        
        <button
          onClick={testApiClient}
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded md:col-span-2"
          disabled={loading}
        >
          Test API Client
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">User Response</h2>
          <pre className="bg-gray-100 p-4 rounded h-64 overflow-auto">
            {userResponse || 'No data'}
          </pre>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-2">Guilds Response</h2>
          <pre className="bg-gray-100 p-4 rounded h-64 overflow-auto">
            {guildsResponse || 'No data'}
          </pre>
        </div>
      </div>
    </div>
  );
} 