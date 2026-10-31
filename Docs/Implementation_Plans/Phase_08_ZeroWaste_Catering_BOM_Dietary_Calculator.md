# Phase 08: Zero-Waste Catering BOM & Precision Dietary Quantity Calculator

**Phase Number:** 08 of 15  
**Document ID:** `Phase_08_ZeroWaste_Catering_BOM_Dietary_Calculator`  
**Target Code Modules:** `src/shared/cateringCalculator.ts`, `tests/cateringCalculator.test.ts`  
**Parent Specs:** [Doc 01: PRD](file:///e:/Promptwars%20-%20Challenge%205/Docs/01_Master_PRD_Celebration_and_Event_Planner_OS.md), [Doc 02: Math Engine Spec](file:///e:/Promptwars%20-%20Challenge%205/Docs/02_Deterministic_Budget_Timeline_and_Vendor_Math_Engine_Spec.md), [Doc 10: Top-1 Gap Analysis & Free APIs](file:///e:/Promptwars%20-%20Challenge%205/Docs/10_Top1_Gap_Analysis_Google_Workspace_Integrations_Free_APIs_and_Antigravity_Skills.md)

---

## 1. Architectural Objectives & Rubric Mapping

Phase 08 implements the mathematical catering bill-of-materials (BOM) and dietary calculation engine. In live events, food shortages cause reputational disaster, while excess food waste causes environmental damage and financial drain. This module calculates ingredient requirements down to kilograms, liters, and portion counts across specialized dietary profiles (Jain, Vegan, Gluten-Free, Halal) and provisions an automated NGO surplus food redistribution handoff.

| Evaluation Rubric Pillar | Phase 08 Engineering Control |
| :--- | :--- |
| **Problem Statement Alignment** | Solves food calculation for weddings, milestone birthdays, and large community fests with exact catering portion formulas. |
| **Sustainability & Innovation** | Implements the Zero-Waste Catering BOM with automatic calculation of food quantities and NGO surplus donation protocols. |
| **Dietary Precision** | Enforces separate preparation tallies for Jain (no root vegetables), Vegan, Gluten-Free, and Nut-Allergy meals. |

---

## 2. Prerequisites & Input State

- Completed Phase 03 (`src/types/event.ts`).
- Workspace targets: `src/shared/cateringCalculator.ts` and `tests/cateringCalculator.test.ts`.

---

## 3. Detailed Technical Specification & File Blueprints

### 3.1 File: `src/shared/cateringCalculator.ts`
Complete Catering BOM, cake sizing, and surplus food redistribution calculator:

```typescript
// src/shared/cateringCalculator.ts
import { DietaryBreakdown } from '../types/event';

export type MealTime = 'BREAKFAST' | 'LUNCH' | 'HIGH_TEA' | 'DINNER';

export interface CateringBOMItem {
  name: string;
  category: 'STAPLE' | 'PROTEIN_PULSE' | 'VEGETABLES' | 'DAIRY' | 'BEVERAGE' | 'DESSERT';
  unit: 'KG' | 'LITERS' | 'PIECES';
  quantityPerGuest: number;
  totalQuantity: number;
  bufferQuantity: number;
  grossQuantity: number;
  notes: string;
}

export interface DietaryTally {
  standardVegCount: number;
  jainCount: number;
  veganCount: number;
  halalCount: number;
  glutenFreeCount: number;
  nutAllergyCount: number;
}

export interface CateringCalculationResult {
  guestCount: number;
  mealTime: MealTime;
  dietaryTally: DietaryTally;
  bomItems: CateringBOMItem[];
  totalFoodWeightKg: number;
  beverageVolumeLiters: number;
  birthdayCakeWeightKg: number;
  surplusDonationProtocol: {
    recommendedNgoPartners: string[];
    pickupWindowHours: string;
    temperatureHoldingGuide: string;
    surplusEstimatedKg: number;
  };
}

/**
 * Calculates birthday cake weight requirement based on guest count and tier buffers.
 * Formula: GuestCount * 110g + safety buffer.
 */
export function calculateCakeWeightKg(guestCount: number): number {
  const baseWeightGrams = guestCount * 110;
  const tierBufferGrams = guestCount > 50 ? 500 : 250;
  const totalGrams = baseWeightGrams + tierBufferGrams;
  return Number((totalGrams / 1000).toFixed(1));
}

/**
 * Resolves percentage splits and explicit counts into absolute headcount tallies.
 */
export function calculateDietaryTally(guestCount: number, dietary: DietaryBreakdown): DietaryTally {
  const veganCount = Math.round((guestCount * dietary.veganPct) / 100);
  const jainCount = Math.round((guestCount * dietary.jainPct) / 100);
  const halalCount = Math.round((guestCount * dietary.halalPct) / 100);
  const explicitSpecialty = veganCount + jainCount + halalCount;
  const standardVegCount = Math.max(0, guestCount - explicitSpecialty);

  return {
    standardVegCount,
    jainCount,
    veganCount,
    halalCount,
    glutenFreeCount: dietary.glutenFreeCount,
    nutAllergyCount: dietary.nutAllergyCount,
  };
}

/**
 * Calculates complete Catering Bill of Materials (BOM), liquid volumes,
 * cake sizing, and surplus rescue protocols.
 */
export function calculateCateringBOM(
  guestCount: number,
  mealTime: MealTime,
  dietary: DietaryBreakdown
): CateringCalculationResult {
  const safeGuests = Math.max(1, guestCount);
  const dietaryTally = calculateDietaryTally(safeGuests, dietary);
  const cakeWeight = calculateCakeWeightKg(safeGuests);

  // Per-attendee base standards (in KG / Liters / Pieces)
  const multipliers: Record<MealTime, Record<string, { qty: number; unit: 'KG' | 'LITERS' | 'PIECES'; cat: CateringBOMItem['category']; notes: string }>> = {
    BREAKFAST: {
      'Idli / Dosa Batter / Breads': { qty: 0.18, unit: 'KG', cat: 'STAPLE', notes: 'Includes gluten-free rice batter' },
      'Sambar / Chutney / Curries': { qty: 0.15, unit: 'KG', cat: 'VEGETABLES', notes: 'Separate batch with no onion/garlic for Jain' },
      'Filter Coffee / Tea': { qty: 0.25, unit: 'LITERS', cat: 'BEVERAGE', notes: 'Oat/Almond milk reserve for Vegan guests' },
      'Fresh Cut Fruits': { qty: 0.10, unit: 'KG', cat: 'DESSERT', notes: 'Hygienically covered chilled display' },
    },
    LUNCH: {
      'Aromatic Biryani / Basmati Rice': { qty: 0.16, unit: 'KG', cat: 'STAPLE', notes: 'Separate Jain biryani without potatoes' },
      'Dal Makhani / Sambar / Lentil Curry': { qty: 0.12, unit: 'KG', cat: 'PROTEIN_PULSE', notes: 'High-protein pulse baseline' },
      'Paneer / Tofu / Specialty Gravy': { qty: 0.15, unit: 'KG', cat: 'VEGETABLES', notes: 'Organic non-GMO tofu substituted for vegan' },
      'Breads (Naan, Roti, Poori)': { qty: 2.5, unit: 'PIECES', cat: 'STAPLE', notes: 'Warm tandoor service with GF options' },
      'Curd / Raita / Chilled Buttermilk': { qty: 0.15, unit: 'LITERS', cat: 'DAIRY', notes: 'Plant-based yogurt alternative for vegan' },
      'Dessert (Gulab Jamun / Payasam)': { qty: 0.09, unit: 'KG', cat: 'DESSERT', notes: 'Refined sugar-free badge provided' },
      'Packaged Mineral Drinking Water': { qty: 0.75, unit: 'LITERS', cat: 'BEVERAGE', notes: 'Zero-waste glass bottle dispensers preferred' },
    },
    HIGH_TEA: {
      'Savory Finger Food (Samosas/Puffs)': { qty: 3.0, unit: 'PIECES', cat: 'STAPLE', notes: 'Assorted baked/fried with allergen labels' },
      'Mini Sandwiches & Sliders': { qty: 2.0, unit: 'PIECES', cat: 'STAPLE', notes: 'Gluten-free bread options segregated' },
      'Masala Chai & Darjeeling Tea': { qty: 0.20, unit: 'LITERS', cat: 'BEVERAGE', notes: 'Freshly brewed hot samovar service' },
      'Petits Fours / Cookies': { qty: 2.0, unit: 'PIECES', cat: 'DESSERT', notes: 'Nut-free bakery certification' },
    },
    DINNER: {
      'Pulao / Fragrant Rice Varieties': { qty: 0.15, unit: 'KG', cat: 'STAPLE', notes: 'Jeera and saffron rice blends' },
      'Rich Kofta / Makhani Gravy': { qty: 0.16, unit: 'KG', cat: 'VEGETABLES', notes: 'Cashew paste replaced in nut-free line' },
      'Live Chaat & Starter Stations': { qty: 3.5, unit: 'PIECES', cat: 'STAPLE', notes: 'Cooked fresh on order' },
      'Fresh Flatbreads': { qty: 2.5, unit: 'PIECES', cat: 'STAPLE', notes: 'Direct from tawa to table' },
      'Artisanal Ice Cream / Kulfi': { qty: 0.10, unit: 'KG', cat: 'DESSERT', notes: 'Served on compostable wooden spoons' },
      'Packaged Drinking Water': { qty: 0.80, unit: 'LITERS', cat: 'BEVERAGE', notes: 'Refillable stations stationed every 20m' },
    },
  };

  const selectedMenu = multipliers[mealTime];
  const bomItems: CateringBOMItem[] = Object.keys(selectedMenu).map((name) => {
    const item = selectedMenu[name]!;
    const baseTotal = item.qty * safeGuests;
    const buffer = baseTotal * 0.10; // 10% safety buffer
    const gross = baseTotal + buffer;

    return {
      name,
      category: item.cat,
      unit: item.unit,
      quantityPerGuest: item.qty,
      totalQuantity: Number(baseTotal.toFixed(1)),
      bufferQuantity: Number(buffer.toFixed(1)),
      grossQuantity: Number(gross.toFixed(1)),
      notes: item.notes,
    };
  });

  const totalFoodWeightKg = bomItems
    .filter((b) => b.unit === 'KG')
    .reduce((sum, b) => sum + b.grossQuantity, 0);

  const beverageVolumeLiters = bomItems
    .filter((b) => b.unit === 'LITERS')
    .reduce((sum, b) => sum + b.grossQuantity, 0);

  return {
    guestCount: safeGuests,
    mealTime,
    dietaryTally,
    bomItems,
    totalFoodWeightKg: Number(totalFoodWeightKg.toFixed(1)),
    beverageVolumeLiters: Number(beverageVolumeLiters.toFixed(1)),
    birthdayCakeWeightKg: cakeWeight,
    surplusDonationProtocol: {
      recommendedNgoPartners: [
        'Feeding India (Zomato Giving)',
        'Robin Hood Army',
        'No Food Waste Foundation',
      ],
      pickupWindowHours: 'Within 90 minutes of banquet conclusion',
      temperatureHoldingGuide: 'Hot foods maintained above 60°C; chilled foods maintained below 5°C',
      surplusEstimatedKg: Number((totalFoodWeightKg * 0.08).toFixed(1)), // Anticipated 8% unconsumed surplus
    },
  };
}
```

### 3.2 File: `tests/cateringCalculator.test.ts`
Unit tests for cake weight math, dietary split headcounts, and BOM items:

```typescript
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
```

---

## 4. Copy-Pasteable Antigravity Execution Prompt

```markdown
> **Antigravity Phase 08 Execution Prompt:**
> Build the Zero-Waste Catering BOM and dietary calculator for AuraPlan AI (UtsavOS):
> 1. Create `src/shared/cateringCalculator.ts`:
>    - Implement `calculateCakeWeightKg()` using the formula `guestCount * 110g + tierBuffer`.
>    - Implement `calculateDietaryTally()` separating Jain, Vegan, Halal, Gluten-Free, and Nut-Allergy headcounts.
>    - Implement `calculateCateringBOM()` generating detailed kg/liter/piece breakdowns across Breakfast, Lunch, High-Tea, and Dinner with a 10% safety buffer and NGO surplus donation guidance.
> 2. Create `tests/cateringCalculator.test.ts` with unit tests verifying cake sizing, dietary tallies, and BOM weights.
> 3. Verify with `npx vitest run tests/cateringCalculator.test.ts`.
```

---

## 5. Verification & Test Commands

### Automated Verification
```powershell
# Run the catering calculator test suite
npx vitest run tests/cateringCalculator.test.ts
```

### Manual Verification
1. Verify cake sizing for 60 guests outputs `7.1 kg`.
2. Confirm that Jain and Vegan counts scale mathematically with total guest count.

---

## 6. Failure Modes & Recovery Protocol

- **Rounding Cumulative Drift in Headcounts:** Ensure `standardVegCount` uses `Math.max(0, guestCount - specialtyCounts)` so total headcount never exceeds `guestCount`.
