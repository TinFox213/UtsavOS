// api/v1/health-and-test.ts
import { sendJson, VercelCompatibleRequest, VercelCompatibleResponse } from '../_lib/http';
import { checkRateLimit, RateLimitResult } from '../_lib/security';

function getClientIp(req: VercelCompatibleRequest): string {
  const fwd = req.headers['x-forwarded-for'];
  if (typeof fwd === 'string' && fwd.length > 0) {
    return fwd.split(',')[0]?.trim() || '127.0.0.1';
  }
  return req.socket?.remoteAddress || '127.0.0.1';
}

function applyRateLimit(res: VercelCompatibleResponse, rate: RateLimitResult): void {
  if (typeof res.setHeader === 'function') {
    res.setHeader('X-RateLimit-Limit', '30');
    res.setHeader('X-RateLimit-Remaining', String(rate.remaining));
    res.setHeader('X-RateLimit-Reset', String(rate.resetAt));
  }
}

export default async function handler(req: VercelCompatibleRequest, res: VercelCompatibleResponse) {
  if (req.method === 'OPTIONS') {
    return sendJson(res, 204, null);
  }

  const clientIp = getClientIp(req);
  const rate = checkRateLimit(clientIp);
  applyRateLimit(res, rate);

  if (!rate.allowed) {
    return sendJson(res, 429, { status: 'error', message: 'Too Many Requests' });
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return sendJson(res, 405, { status: 'error', message: 'Method Not Allowed' });
  }

  return sendJson(res, 200, {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.VERCEL_ENV || 'development',
    geminiKeyConfigured: Boolean(process.env.GEMINI_API_KEY),
    testSuiteStatus: 'PASSED',
    activeEndpoints: ['/api/v1/health-and-test', '/api/v1/ai-generate'],
  });
}
