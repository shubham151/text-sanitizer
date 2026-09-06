import { NextResponse } from 'next/server';

async function handleProxy(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const resolvedParams = await params;
    const path = resolvedParams.path.join('/');
    
    // Hardcoded to backend Docker service, but fall back to localhost for local testing
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'http://backend:8000/api'
      : 'http://127.0.0.1:8000/api';
      
    const apiUrl = `${baseUrl}/${path}`;
    
    // Prepare fetch options
    const fetchOptions: RequestInit = {
      method: request.method,
      headers: {
        'Content-Type': request.headers.get('Content-Type') || 'application/json',
      },
    };
    
    // Only add body for methods that support it
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      const body = await request.text();
      if (body) {
        fetchOptions.body = body;
      }
    }
      
    const res = await fetch(apiUrl, fetchOptions);
    
    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json(
        { error: `Backend error: ${res.status} ${errorText}` },
        { status: res.status }
      );
    }
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error('API proxy error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const DELETE = handleProxy;
