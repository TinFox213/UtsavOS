// api/v1/ai-generate.ts
import { GoogleGenAI } from '@google/genai';
import { auditAndSanitizeInput } from '../../src/shared/securityGuardrails';
import { CopilotMode, EventArchetype, CurrencyCode, DietaryBreakdown } from '../../src/types/event';

export interface EventAIRequestBody {
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
  dietaryAndCultural?: Record<string, unknown> | DietaryBreakdown;
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

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const startTime = Date.now();
  const body: EventAIRequestBody = req.body;

  // 1. OWASP LLM01 Sanitization
  const audit = auditAndSanitizeInput(body.userPrompt || '');
  if (!audit.isSafe) {
    return res.status(400).json({
      error: 'Security Guardrail Violation',
      message: audit.triggeredRule,
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'Configuration Error',
      message: 'GEMINI_API_KEY environment variable is not configured on server.',
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const promptText = buildEventCopilotPrompt(body);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: promptText,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const latencyMs = Date.now() - startTime;
    const rawText = response.text || '{}';
    const structuredOutput = JSON.parse(rawText);

    return res.status(200).json({
      runId: `run_${Date.now()}`,
      modelUsed: 'gemini-2.5-flash',
      latencyMs,
      promptSent: promptText,
      structuredOutput,
    });
  } catch (err: any) {
    return res.status(500).json({
      error: 'Gemini Generation Error',
      message: err.message || 'Failed to generate structured AI response.',
    });
  }
}
