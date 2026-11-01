// api/v1/ai-generate.ts
import { GoogleGenAI } from '@google/genai';
import { parseIncomingBody, sendJson, VercelCompatibleRequest, VercelCompatibleResponse } from '../_lib/http';
import { auditAndSanitizeInput, checkRateLimit, RateLimitResult } from '../_lib/security';
import {
  generateDynamicSynthesisFallback,
  SynthesisInput,
  CopilotMode,
  EventArchetype,
  CurrencyCode,
} from '../_lib/synthesizer';

export interface EventAIRequestBody extends SynthesisInput {
  copilotMode: CopilotMode;
  eventType: EventArchetype;
  subType: string;
  eventName: string;
  guestCount: number;
  totalBudget: number;
  currency: CurrencyCode;
  netAllocatableBudget: number;
  cateringCap: number;
  decorCap: number;
  venueCap: number;
  location: string;
  userPrompt: string;
}

export function buildEventCopilotPrompt(input: EventAIRequestBody): string {
  return [
    'You are AuraPlan AI (UtsavOS), a world-class Celebration & Event Engineering Copilot.',
    'STRICT MATHEMATICAL & DOMAIN CONSTRAINTS:',
    `1. Event Archetype: ${input.eventType} (${input.subType}) | Title: "${input.eventName}"`,
    `2. Guest Count: ${input.guestCount} guests | Location/City: ${input.location}`,
    `3. Total Budget: ${input.currency} ${input.totalBudget.toLocaleString()} (Net Allocatable: ${input.currency} ${input.netAllocatableBudget.toLocaleString()})`,
    `4. Category Caps -> Catering Cap: ${input.currency} ${input.cateringCap.toLocaleString()}, Decor Cap: ${input.currency} ${input.decorCap.toLocaleString()}, Venue Cap: ${input.currency} ${input.venueCap.toLocaleString()}`,
    `5. Dietary & Cultural Context: ${JSON.stringify(input.dietaryAndCultural || {})}`,
    `6. User Specific Vibe / Scenario: "${input.userPrompt}"`,
    'Every single recommendation, menu quantity, and cost figure MUST scale mathematically to the exact Guest Count and stay strictly within the Category Caps above.',
    `Specific Copilot Mission Mode: ${input.copilotMode}. Return valid JSON matching the schema for this mode.`,
  ].join('\n');
}

async function callGeminiModel(apiKey: string, promptText: string) {
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: promptText,
    config: {
      responseMimeType: 'application/json',
    },
  });
  const rawText = response.text || '{}';
  return JSON.parse(rawText);
}

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

async function executeCopilotPipeline(
  res: VercelCompatibleResponse,
  body: EventAIRequestBody,
  startTime: number
) {
  const promptText = buildEventCopilotPrompt(body);
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    const fallback = generateDynamicSynthesisFallback(body, promptText, startTime);
    return sendJson(res, 200, { ...fallback, fallbackMode: true });
  }

  try {
    const structuredOutput = await callGeminiModel(apiKey, promptText);
    return sendJson(res, 200, {
      runId: `run_${Date.now()}`,
      modelUsed: 'gemini-2.5-flash',
      latencyMs: Date.now() - startTime,
      promptSent: promptText,
      structuredOutput,
    });
  } catch {
    const fallback = generateDynamicSynthesisFallback(body, promptText, startTime);
    return sendJson(res, 200, { ...fallback, fallbackMode: true });
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
    return sendJson(res, 429, { error: 'Too Many Requests', message: 'Rate limit exceeded' });
  }

  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Method not allowed. Use POST.' });
  }

  const startTime = Date.now();
  let body: EventAIRequestBody;
  try {
    const raw = await parseIncomingBody(req);
    body = raw as unknown as EventAIRequestBody;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return sendJson(res, 400, { error: 'Invalid JSON', message });
  }

  const audit = auditAndSanitizeInput(body.userPrompt || '');
  if (!audit.isSafe) {
    return sendJson(res, 400, {
      error: 'Security Guardrail Violation',
      message: audit.triggeredRule,
    });
  }

  return executeCopilotPipeline(res, body, startTime);
}
