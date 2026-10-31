// tests/cateringCalculator.test.ts
import { describe, it, expect } from 'vitest';
import {
  calculateCakeWeightKg,
  calculateDietaryTally,
  calculateCateringBOM,
} from '../src/shared/cateringCalculator';

describe('Zero-Waste Catering BOM & Cake Sizing Engine', () => {
  it('Birthday Cake Math: Computes correct cake weight for 60 guests', () => {
    // 60 guests * 110g = 6600g + 500g buffer = 7100g = 7.1 kg
    const cakeKg = calculateCakeWeightKg(60);
    expect(cakeKg).toBe(7.1);
  });

  it('Birthday Cake Math: Computes correct cake weight for 25 guests', () => {
    // 25 guests * 110g = 2750g + 250g buffer = 3000g = 3.0 kg
    const cakeKg = calculateCakeWeightKg(25);
    expect(cakeKg).toBe(3.0);
  });

  it('Dietary Tally: Accurately converts percentage splits to attendee counts', () => {
    const tally = calculateDietaryTally(250, {
      vegetarianPct: 70,
      veganPct: 10,
      jainPct: 15,
      halalPct: 0,
      glutenFreeCount: 12,
      nutAllergyCount: 6,
    });
    expect(tally.veganCount).toBe(25); // 10% of 250
    expect(tally.jainCount).toBe(38); // 15% of 250
    expect(tally.glutenFreeCount).toBe(12);
    expect(tally.nutAllergyCount).toBe(6);
  });

  it('Catering BOM: Generates complete Lunch BOM with 10% safety buffer for 200 guests', () => {
    const result = calculateCateringBOM(200, 'LUNCH', {
      vegetarianPct: 80,
      veganPct: 10,
      jainPct: 10,
      halalPct: 0,
      glutenFreeCount: 5,
      nutAllergyCount: 2,
    });

    expect(result.bomItems.length).toBeGreaterThanOrEqual(6);
    const rice = result.bomItems.find((b) => b.name.includes('Rice'));
    expect(rice).toBeDefined();
    // 200 * 0.16 = 32 kg + 3.2 kg buffer = 35.2 kg
    expect(rice?.grossQuantity).toBe(35.2);
  });

  it('Surplus Rescue: Generates NGO donation protocol with estimated surplus', () => {
    const result = calculateCateringBOM(350, 'DINNER', {
      vegetarianPct: 70,
      veganPct: 10,
      jainPct: 20,
      halalPct: 0,
      glutenFreeCount: 0,
      nutAllergyCount: 0,
    });

    expect(result.surplusDonationProtocol.recommendedNgoPartners.length).toBe(3);
    expect(result.surplusDonationProtocol.surplusEstimatedKg).toBeGreaterThan(0);
  });
});
