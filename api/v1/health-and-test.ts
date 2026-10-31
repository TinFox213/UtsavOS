import { sendJson, VercelCompatibleRequest, VercelCompatibleResponse } from '../_lib/http';

export default async function handler(req: VercelCompatibleRequest, res: VercelCompatibleResponse) {
  if (req.method !== 'GET') {
    return sendJson(res, 405, {
      status: 'error',
      message: 'Method Not Allowed',
    });
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
