import { NextRequest, NextResponse } from 'next/server';

const BACKEND_API_URL = process.env.BACKEND_API_URL;

export const dynamic = 'force-dynamic';

async function handleRequest(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> | { path: string[] } }
) {
  if (!BACKEND_API_URL) {
    console.error('BACKEND_API_URL environment variable is not set.');
    return NextResponse.json(
      { detail: 'Service temporarily unavailable.' },
      { status: 503 }
    );
  }

  const resolvedParams = await params;
  const pathString = resolvedParams.path.join('/');
  const searchParams = request.nextUrl.search;
  
  const targetUrl = `${BACKEND_API_URL}/${pathString}${searchParams}`;

  const headers = new Headers(request.headers);
  headers.delete('host');
  headers.delete('connection');
  headers.delete('expect');

  const fetchOptions: RequestInit = {
    method: request.method,
    headers,
  };

  try {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      const bodyBuffer = await request.arrayBuffer();
      headers.set('content-length', bodyBuffer.byteLength.toString());
      fetchOptions.body = bodyBuffer;
    }
    
    const response = await fetch(targetUrl, fetchOptions);

    const responseHeaders = new Headers(response.headers);
    responseHeaders.delete('content-encoding');

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('API Proxy Error:', error);
    return NextResponse.json(
      { detail: 'Backend service unavailable.' },
      { status: 502 }
    );
  }
}

export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const DELETE = handleRequest;
export const PATCH = handleRequest;
export const OPTIONS = handleRequest;
