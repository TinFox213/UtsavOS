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
