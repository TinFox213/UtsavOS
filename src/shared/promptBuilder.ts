// src/shared/promptBuilder.ts
import { EventAIRequestBody } from '../types/event';

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
