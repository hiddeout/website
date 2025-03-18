import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function GET(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleRequest(req, params.path, 'GET');
}

export async function POST(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleRequest(req, params.path, 'POST');
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleRequest(req, params.path, 'PUT');
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleRequest(req, params.path, 'DELETE');
}

export async function OPTIONS(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}

async function handleRequest(
  req: NextRequest,
  pathSegments: string[],
  method: string
) {
  try {
    // Construct the path to the backend API correctly
    let path = pathSegments.join('/');
    
    // Log the path segments for debugging
    console.log('Path segments:', pathSegments);
    
    // Construct URL carefully to avoid issues with @ symbols and double slashes
    let url;
    if (path.startsWith('@')) {
      // If API_URL already has a trailing slash, we don't need to add one
      const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
      url = `${baseUrl}/${path}`;
    } else {
      // Standard URL construction
      const baseUrl = API_URL.endsWith('/') ? API_URL : `${API_URL}/`;
      url = `${baseUrl}${path}`;
    }
    
    console.log(`Proxying ${method} request to ${url}`);
    
    // Get token from NextAuth
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    // Get token from cookie if available (since backend supports this)
    const cookieToken = req.cookies.get('token')?.value;
    
    // Prepare headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Add authorization if we have a token
    if (token?.accessToken) {
      headers['Authorization'] = `Bearer ${token.accessToken}`;
      console.log('Using token from NextAuth session');
    } else if (cookieToken) {
      headers['Authorization'] = `Bearer ${cookieToken}`;
      console.log('Using token from cookie');
    } else {
      // Forward any authorization header from the original request
      const authHeader = req.headers.get('authorization');
      if (authHeader) {
        headers['Authorization'] = authHeader;
        console.log('Using token from request header');
      } else {
        console.log('No authorization token found');
      }
    }

    // Clone the request to modify it
    const options: RequestInit = {
      method,
      headers,
    };

    // For methods that can have a body, forward the body
    if (method !== 'GET' && method !== 'HEAD') {
      const body = await req.text();
      if (body) {
        options.body = body;
      }
    }

    const response = await fetch(url, options);
    
    console.log(`Response status: ${response.status}`);

    // Get the response data
    const data = await response.text();
    const contentType = response.headers.get('content-type') || 'application/json';

    console.log(`Response content-type: ${contentType}`);
    if (data.length < 1000) {
      console.log(`Response data: ${data}`);
    } else {
      console.log(`Response data length: ${data.length}`);
    }

    // Create a NextResponse with the data and appropriate headers
    return new NextResponse(data, {
      status: response.status,
      headers: {
        'Content-Type': contentType,
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy request', details: (error as Error).message },
      { status: 500 }
    );
  }
} 