import type { IncomingMessage, ServerResponse } from 'http';

export interface VercelCompatibleRequest extends IncomingMessage {
  body?: any;
  query?: Record<string, string | string[]>;
  cookies?: Record<string, string>;
}

export interface VercelCompatibleResponse extends ServerResponse {
  status?: (statusCode: number) => VercelCompatibleResponse;
  json?: (data: any) => void;
}

export type VercelRequest = VercelCompatibleRequest;
export type VercelResponse = VercelCompatibleResponse;

export async function parseIncomingBody(req: VercelCompatibleRequest): Promise<any> {
  if (req.body !== undefined && req.body !== null) {
    if (typeof req.body === 'string') {
      try {
        return JSON.parse(req.body);
      } catch {
        return req.body;
      }
    }
    return req.body;
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
        resolve(JSON.parse(raw));
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
  payload: Record<string, any>
): void {
  if (typeof res.status === 'function' && typeof res.json === 'function') {
    res.status(statusCode);
    res.json(payload);
    return;
  }

  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}
