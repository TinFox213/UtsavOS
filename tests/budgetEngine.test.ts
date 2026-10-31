// tests/budgetEngine.test.ts
import { describe, it, expect } from 'vitest';
import { calculateBudgetSummary, rebalanceBudget, BASE_WEIGHTS } from '../src/shared/budgetEngine';

describe('Deterministic Budget & Feasibility Engine', () => {
  it('Invariant 1: Contingency + Tax + NetAllocatable === TotalBudget', () => {
    const summary = calculateBudgetSummary({
      totalBudget: 850000,
      guestCount: 250,
      archetype: 'WEDDING',
      currency: 'INR',
    });
    const sumReservesAndNet =
      summary.contingencyReserve + summary.estimatedTaxReserve + summary.netAllocatableBudget;
    expect(sumReservesAndNet).toBe(850000);
  });

  it('Invariant 2: Sum of 12 category allocations === NetAllocatableBudget', () => {
    const summary = calculateBudgetSummary({
      totalBudget: 850000,
      guestCount: 250,
      archetype: 'WEDDING',
      currency: 'INR',
    });
    const categorySum = summary.categories.reduce((acc, cat) => acc + cat.allocatedAmount, 0);
    expect(categorySum).toBe(summary.netAllocatableBudget);
  });

  it('Invariant 3: Base weights sum to 1.000 across all 3 archetypes', () => {
    (['WEDDING', 'BIRTHDAY', 'COMMUNITY_EVENT'] as const).forEach((arch) => {
      const weights = BASE_WEIGHTS[arch];
      const sum = Object.values(weights).reduce((a, b) => a + b, 0);
      expect(Number(sum.toFixed(4))).toBe(1.0000);
    });
  });

  it('TC-05: Triggers CRITICAL_DEFICIT when 500 guests enter on ₹25,000 budget', () => {
    const summary = calculateBudgetSummary({
      totalBudget: 25000,
      guestCount: 500,
      archetype: 'WEDDING',
      currency: 'INR',
      tier: 'ECONOMY',
    });
    expect(summary.perCapitaActual).toBe(50);
    expect(summary.feasibilityStatus).toBe('CRITICAL_DEFICIT');
    expect(summary.deficitAmount).toBe(300000); // 500 * 650 - 25,000 = 300,000
    expect(summary.maxViableGuestsAtCurrentBudget).toBe(38); // 25000 / 650 = 38
  });

  it('Feasibility State: Correctly flags OPTIMAL margin (250 guests on ₹8.5L)', () => {
    const summary = calculateBudgetSummary({
      totalBudget: 850000,
      guestCount: 250,
      archetype: 'WEDDING',
      currency: 'INR',
      tier: 'STANDARD',
    });
    expect(summary.perCapitaActual).toBe(3400);
    expect(summary.feasibilityStatus).toBe('OPTIMAL');
    expect(summary.deficitAmount).toBe(0);
  });

  it('Feasibility State: Correctly flags TIGHT_VIABLE margin', () => {
    const summary = calculateBudgetSummary({
      totalBudget: 140000,
      guestCount: 100,
      archetype: 'WEDDING',
      currency: 'INR',
      tier: 'STANDARD', // Standard min floor is 1400
    });
    expect(summary.feasibilityRatio).toBe(1.0);
    expect(summary.feasibilityStatus).toBe('TIGHT_VIABLE');
  });

  it('Multi-Currency: USD calculations balance correctly ($15,000 wedding)', () => {
    const summary = calculateBudgetSummary({
      totalBudget: 15000,
      guestCount: 120,
      archetype: 'WEDDING',
      currency: 'USD',
    });
    const sum = summary.contingencyReserve + summary.estimatedTaxReserve + summary.netAllocatableBudget;
    expect(sum).toBe(15000);
  });

  it('Lock & Rebalance: Locking Venue and dragging Catering updates unlocked categories', () => {
    const initial = calculateBudgetSummary({
      totalBudget: 850000,
      guestCount: 250,
      archetype: 'WEDDING',
      currency: 'INR',
    });
    // Lock Venue
    initial.categories.find((c) => c.key === 'VENUE_RENTAL')!.isLocked = true;

    // Increase Catering
    const rebalanced = rebalanceBudget(initial, 'CATERING_FNB', 300000);
    const cateringCat = rebalanced.categories.find((c) => c.key === 'CATERING_FNB');
    expect(cateringCat?.allocatedAmount).toBe(300000);
  });

  it('Stress Test: Handles prime number budget and guest count without decimal loss', () => {
    const summary = calculateBudgetSummary({
      totalBudget: 999983,
      guestCount: 197,
      archetype: 'COMMUNITY_EVENT',
      currency: 'INR',
    });
    const categorySum = summary.categories.reduce((acc, cat) => acc + cat.allocatedAmount, 0);
    expect(categorySum).toBe(summary.netAllocatableBudget);
  });

  it('Safety Bounds: Enforces non-negative category allocations on extreme slider drag', () => {
    const initial = calculateBudgetSummary({
      totalBudget: 100000,
      guestCount: 50,
      archetype: 'BIRTHDAY',
      currency: 'INR',
    });
    const rebalanced = rebalanceBudget(initial, 'CATERING_FNB', 200000);
    rebalanced.categories.forEach((c) => {
      expect(c.allocatedAmount).toBeGreaterThanOrEqual(0);
    });
  });

  it('Performance: calculateBudgetSummary executes in under 2ms', () => {
    const start = performance.now();
    for (let i = 0; i < 50; i++) {
      calculateBudgetSummary({
        totalBudget: 500000 + i * 1000,
        guestCount: 150,
        archetype: 'WEDDING',
        currency: 'INR',
      });
    }
    const end = performance.now();
    expect((end - start) / 50).toBeLessThan(2.0);
  });

  it('Birthday Weighting: Allocates higher percentage to Catering & Cake (34%)', () => {
    const summary = calculateBudgetSummary({
      totalBudget: 50000,
      guestCount: 50,
      archetype: 'BIRTHDAY',
      currency: 'INR',
    });
    const catering = summary.categories.find((c) => c.key === 'CATERING_FNB');
    expect(catering?.weight).toBe(0.34);
  });
});
