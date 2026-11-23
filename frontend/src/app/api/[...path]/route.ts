const apiRoots = new Set([
  'auth',
  'cards',
  'card-types',
  'collections',
  'rarities',
  'users',
]);
const maxRequestBodyBytes = 1024 * 1024;

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

async function readRequestBody(
  request: Request,
): Promise<ArrayBuffer | Response | undefined> {
  if (!request.body) return undefined;

  const contentLength = Number(request.headers.get('content-length'));
  if (contentLength > maxRequestBodyBytes) {
    return Response.json(
      { message: 'Request body too large' },
      { status: 413 },
    );
  }

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    totalBytes += value.byteLength;
    if (totalBytes > maxRequestBodyBytes) {
      await reader.cancel();
      return Response.json(
        { message: 'Request body too large' },
        { status: 413 },
      );
    }

    chunks.push(value);
  }

  const buffer = new ArrayBuffer(totalBytes);
  const body = new Uint8Array(buffer);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return buffer;
}

async function proxyApiRequest(
  request: Request,
  context: RouteContext,
): Promise<Response> {
  const { path } = await context.params;
  if (!path.length || !apiRoots.has(path[0])) {
    return Response.json({ message: 'Not Found' }, { status: 404 });
  }

  const configuredOrigin =
    process.env.NEST_API_ORIGIN ??
    (process.env.NODE_ENV === 'production'
      ? undefined
      : 'http://localhost:3003');
  if (!configuredOrigin) {
    throw new Error('NEST_API_ORIGIN must be set in production');
  }

  const origin = new URL(configuredOrigin);
  if (
    !['http:', 'https:'].includes(origin.protocol) ||
    origin.username ||
    origin.password ||
    origin.pathname !== '/' ||
    origin.search ||
    origin.hash
  ) {
    throw new Error('NEST_API_ORIGIN must be an HTTP(S) origin without a path');
  }

  const upstreamUrl = new URL(
    path.map((segment) => encodeURIComponent(segment)).join('/'),
    origin,
  );
  upstreamUrl.search = new URL(request.url).search;

  const headers = new Headers();
  for (const header of ['accept', 'authorization', 'content-type']) {
    const value = request.headers.get(header);
    if (value) headers.set(header, value);
  }

  const hasBody = !['GET', 'HEAD'].includes(request.method);
  const body = hasBody ? await readRequestBody(request) : undefined;
  if (body instanceof Response) return body;

  const upstreamResponse = await fetch(upstreamUrl, {
    method: request.method,
    headers,
    body,
    cache: 'no-store',
    redirect: 'manual',
  });

  const responseHeaders = new Headers();
  for (const header of ['content-type', 'cache-control', 'etag']) {
    const value = upstreamResponse.headers.get(header);
    if (value) responseHeaders.set(header, value);
  }

  const responseBody =
    [204, 205, 304].includes(upstreamResponse.status) ||
    request.method === 'HEAD'
      ? null
      : upstreamResponse.body;

  return new Response(responseBody, {
    status: upstreamResponse.status,
    headers: responseHeaders,
  });
}

export const dynamic = 'force-dynamic';
export const GET = proxyApiRequest;
export const HEAD = proxyApiRequest;
export const POST = proxyApiRequest;
export const PUT = proxyApiRequest;
export const PATCH = proxyApiRequest;
export const DELETE = proxyApiRequest;
export const OPTIONS = proxyApiRequest;
