// tests/geminiService.test.ts
import { describe, it, expect } from 'vitest';
import { buildEventCopilotPrompt } from '../api/v1/ai-generate';
import { generateDynamicSynthesisFallback } from '../src/services/geminiService';

describe('Gemini Copilot Service & Dynamic Fallback', () => {
  const sampleRequest = {
    copilotMode: 'THEME_AND_IDEAS' as const,
    eventType: 'WEDDING' as const,
    subType: 'Heritage Wedding',
    eventName: 'Priya & Karthik Wedding',
    guestCount: 250,
    totalBudget: 850000,
    currency: 'INR' as const,
    netAllocatableBudget: 710909,
    cateringCap: 213273,
    decorCap: 99527,
    venueCap: 142182,
    location: 'Chennai',
    userPrompt: 'Eco-friendly brass lamps and floral decor',
  };

  it('Builds structured prompt containing all mathematical constraints', () => {
    const prompt = buildEventCopilotPrompt(sampleRequest);
    expect(prompt).toContain('Priya & Karthik Wedding');
    expect(prompt).toContain('250 guests');
    expect(prompt).toContain(`Catering Cap: INR ${(sampleRequest.cateringCap).toLocaleString()}`);
    expect(prompt).toContain('Eco-friendly brass lamps');
  });

  it('Fallback Synthesizer dynamically adapts to Wedding archetype and guest count', () => {
    const result = generateDynamicSynthesisFallback(sampleRequest, 'prompt', Date.now());
    expect(result.structuredOutput.themeTitle).toContain('Chettinad');
    expect(result.structuredOutput.colorPalette).toBeDefined();
    expect((result.structuredOutput.colorPalette as string[]).length).toBe(5);
  });

  it('Fallback Synthesizer dynamically changes for Community Event / Hackathon', () => {
    const hackathonReq = {
      ...sampleRequest,
      eventType: 'COMMUNITY_EVENT' as const,
      eventName: 'AI Hackathon',
      guestCount: 400,
      totalBudget: 150000,
      userPrompt: 'Cyberpunk neon stage setup',
    };
    const result = generateDynamicSynthesisFallback(hackathonReq, 'prompt', Date.now());
    expect(result.structuredOutput.themeTitle).toContain('Cyberpunk');
    expect((result.structuredOutput.colorPalette as string[])[0]).toBe('#00FFFF');
  });
});
