// tests/vendorAndDiffEngine.test.ts
import { describe, it, expect } from 'vitest';
import { calculateBudgetSummary } from '../src/shared/budgetEngine';
import {
  initializeVendorRecords,
  calculateVendorReadiness,
  evaluateAdvanceRisk,
} from '../src/shared/vendorEngine';
import { computeDynamicDiff } from '../src/shared/dynamicDiffEngine';
import { AIGenerationRun } from '../src/types/event';

describe('Vendor Readiness & Dynamic Diff Engine', () => {
  it('Initializes 12 vendor categories with 10 checklist items each (120 total)', () => {
    const budget = calculateBudgetSummary({
      totalBudget: 850000,
      guestCount: 250,
      archetype: 'WEDDING',
      currency: 'INR',
    });
    const vendors = initializeVendorRecords(budget);
    expect(vendors.length).toBe(12);

    const totalChecklistItems = vendors.reduce((acc, v) => acc + v.checklistItems.length, 0);
    expect(totalChecklistItems).toBe(120);
  });

  it('Calculates vendor readiness percentage accurately', () => {
    const items = [
      { id: '1', category: 'VENUE_RENTAL' as const, taskTitle: 'T1', completed: true, isMandatorySafetyOrSLA: false },
      { id: '2', category: 'VENUE_RENTAL' as const, taskTitle: 'T2', completed: true, isMandatorySafetyOrSLA: false },
      { id: '3', category: 'VENUE_RENTAL' as const, taskTitle: 'T3', completed: false, isMandatorySafetyOrSLA: false },
      { id: '4', category: 'VENUE_RENTAL' as const, taskTitle: 'T4', completed: false, isMandatorySafetyOrSLA: false },
    ];
    // 50% checklist = 40 pts; 30% advance = 20 pts -> 60%
    const score = calculateVendorReadiness(items, 30);
    expect(score).toBe(60);
  });

  it('Detects and warns on high advance payments (>50%)', () => {
    const safeCheck = evaluateAdvanceRisk(30);
    expect(safeCheck.isHighRisk).toBe(false);

    const riskyCheck = evaluateAdvanceRisk(70);
    expect(riskyCheck.isHighRisk).toBe(true);
    expect(riskyCheck.message).toContain('High Advance Risk');
  });

  it('Dynamic Diff: Accurately detects mutated fields between two AI runs', () => {
    const run1: AIGenerationRun = {
      runId: 'run-1',
      timestampIso: '2026-10-24T10:00:00Z',
      copilotMode: 'THEME_AND_IDEAS',
      modelUsed: 'gemini-2.5-flash',
      latencyMs: 1200,
      inputSnapshot: {
        eventType: 'WEDDING',
        subType: 'Heritage Wedding',
        guestCount: 250,
        totalBudget: 850000,
        currency: 'INR',
        location: 'Chennai',
        userPrompt: 'Traditional brass lamps and Chettinad decor',
      },
      promptSent: 'prompt 1',
      structuredOutput: {
        themeTitle: 'Royal Chettinad',
        palette: ['#B8860B', '#800000'],
        menuKg: 45,
      },
    };

    const run2: AIGenerationRun = {
      runId: 'run-2',
      timestampIso: '2026-10-24T10:05:00Z',
      copilotMode: 'THEME_AND_IDEAS',
      modelUsed: 'gemini-2.5-flash',
      latencyMs: 1100,
      inputSnapshot: {
        eventType: 'COMMUNITY_EVENT',
        subType: 'AI Hackathon',
        guestCount: 400,
        totalBudget: 150000,
        currency: 'INR',
        location: 'Coimbatore',
        userPrompt: 'Cyberpunk neon stage setup',
      },
      promptSent: 'prompt 2',
      structuredOutput: {
        themeTitle: 'Cyberpunk Neon Matrix',
        palette: ['#00FFFF', '#FF00FF'],
        menuKg: 90,
      },
    };

    const diff = computeDynamicDiff(run1, run2);
    expect(diff.inputDeltas.length).toBe(4);
    expect(diff.mutatedFields.length).toBe(4);
    expect(diff.summary).toContain('Verified Dynamic AI Generation');
  });
});
