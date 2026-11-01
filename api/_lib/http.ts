// api/_lib/http.ts
import type { IncomingMessage, ServerResponse } from 'http';

export interface VercelCompatibleRequest extends IncomingMessage {
  body?: unknown;
  query?: Record<string, string | string[]>;
  cookies?: Record<string, string>;
}

export interface VercelCompatibleResponse extends ServerResponse {
  status?: (statusCode: number) => VercelCompatibleResponse;
  json?: (data: unknown) => void;
}

export type VercelRequest = VercelCompatibleRequest;
export type VercelResponse = VercelCompatibleResponse;

export function setSecurityHeaders(res: VercelCompatibleResponse): void {
  if (typeof res.setHeader === 'function') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, HEAD');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  }
}

export async function parseIncomingBody(req: VercelCompatibleRequest): Promise<Record<string, unknown>> {
  if (req.body !== undefined && req.body !== null) {
    if (typeof req.body === 'string') {
      try {
        return JSON.parse(req.body) as Record<string, unknown>;
      } catch {
        return { rawBody: req.body };
      }
    }
    return req.body as Record<string, unknown>;
  }

  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
    });

    req.on('end', () => {
      if (!raw.trim()) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw) as Record<string, unknown>);
      } catch {
        reject(new Error('Invalid JSON payload received in request stream'));
      }
    });

    req.on('error', (err) => reject(err));
  });
}

export function sendJson(
  res: VercelCompatibleResponse,
  statusCode: number,
  payload: unknown
): void {
  setSecurityHeaders(res);

  if (typeof res.status === 'function' && typeof res.json === 'function') {
    res.status(statusCode);
    res.json(payload);
    return;
  }

  res.statusCode = statusCode;
  if (typeof res.setHeader === 'function') {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
  }
  res.end(payload !== null && payload !== undefined ? JSON.stringify(payload) : '');
}
