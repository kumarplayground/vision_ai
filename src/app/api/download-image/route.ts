import { NextRequest, NextResponse } from 'next/server';

function sanitizeFilename(value: string) {
  const trimmed = value.trim();
  const cleaned = trimmed
    .replace(/[\\/:*?"<>|]+/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return cleaned || 'image';
}

function extensionFromContentType(contentType: string | null) {
  if (!contentType) return 'jpg';
  const lower = contentType.toLowerCase();
  if (lower.includes('image/png')) return 'png';
  if (lower.includes('image/webp')) return 'webp';
  if (lower.includes('image/jpeg') || lower.includes('image/jpg')) return 'jpg';
  return 'jpg';
}

function isAllowedHost(hostname: string) {
  // Prevent SSRF: only allow known image/CDN hosts used by this app.
  const allowedExact = new Set<string>([
    'ai-statics.freepik.com',
    'cdn-front.freepik.com',
    'res.cloudinary.com',
  ]);

  if (allowedExact.has(hostname)) return true;
  if (hostname.endsWith('.freepik.com')) return true;
  if (hostname.endsWith('.freepikcdn.com')) return true;
  if (hostname.endsWith('.cloudinary.com')) return true;

  return false;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const urlParam = searchParams.get('url');
  const filenameParam = searchParams.get('filename');

  if (!urlParam) {
    return NextResponse.json({ message: 'Missing url' }, { status: 400 });
  }

  let remoteUrl: URL;
  try {
    remoteUrl = new URL(urlParam);
  } catch {
    return NextResponse.json({ message: 'Invalid url' }, { status: 400 });
  }

  if (remoteUrl.protocol !== 'https:') {
    return NextResponse.json({ message: 'Only https URLs are allowed' }, { status: 400 });
  }

  if (!isAllowedHost(remoteUrl.hostname)) {
    return NextResponse.json({ message: 'Host not allowed' }, { status: 403 });
  }

  const upstream = await fetch(remoteUrl.toString(), {
    cache: 'no-store',
    // Freepik/CDN endpoints may block unknown user agents; keep it browser-like.
    headers: {
      'User-Agent': 'Mozilla/5.0',
      Accept: 'image/*,*/*;q=0.8',
    },
  });

  if (!upstream.ok) {
    return NextResponse.json(
      { message: `Upstream error: ${upstream.status}` },
      { status: 502 }
    );
  }

  const contentType = upstream.headers.get('content-type') || 'application/octet-stream';
  const ext = extensionFromContentType(contentType);

  const base = sanitizeFilename(filenameParam || 'image');
  const filename = base.toLowerCase().endsWith(`.${ext}`) ? base : `${base}.${ext}`;

  const arrayBuffer = await upstream.arrayBuffer();

  return new NextResponse(arrayBuffer, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  });
}
