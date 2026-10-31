// src/shared/budgetEngine.ts
import {
  EventArchetype,
  CurrencyCode,
  BudgetTier,
  FeasibilityStatus,
  VendorCategoryKey,
  BudgetCategoryAllocation,
  BudgetSummary,
} from '../types/event';

export const CATEGORY_LABELS: Record<VendorCategoryKey, string> = {
  VENUE_RENTAL: 'Venue, Mandapam & Permits',
  CATERING_FNB: 'Catering, Beverages & Cake',
  DECOR_FLORAL: 'Decor, Floral, Stage & Thematic Design',
  PHOTO_VIDEO: 'Photography, Cinematography & Drone',
  AV_LIGHT_SOUND: 'Audio-Visual, LED Wall, Lighting & DJ',
  ATTIRE_HMU_VIP: 'Bridal/Host Attire, Makeup & VIP Hospitality',
  ENTERTAINMENT: 'Live Artists, Emcee, Games & Activities',
  INVITES_SIGNAGE: 'Digital/Print Invites, Badges & Signage',
  GIFTS_SWAG: 'Return Gifts, Trousseau & Swag Kits',
  TRANSPORT_STAY: 'Guest Transport, Valet & Accommodation',
  SECURITY_CLEAN: 'Crowd Security, Housekeeping & First-Aid',
  LOGISTICS_MISC: 'Rituals, Waste Disposal & Operational Buffer',
};

export const BASE_WEIGHTS: Record<EventArchetype, Record<VendorCategoryKey, number>> = {
  WEDDING: {
    VENUE_RENTAL: 0.20,
    CATERING_FNB: 0.30,
    DECOR_FLORAL: 0.14,
    PHOTO_VIDEO: 0.10,
    AV_LIGHT_SOUND: 0.05,
    ATTIRE_HMU_VIP: 0.07,
    ENTERTAINMENT: 0.04,
    INVITES_SIGNAGE: 0.02,
    GIFTS_SWAG: 0.03,
    TRANSPORT_STAY: 0.03,
    SECURITY_CLEAN: 0.01,
    LOGISTICS_MISC: 0.01,
  },
  BIRTHDAY: {
    VENUE_RENTAL: 0.18,
    CATERING_FNB: 0.34,
    DECOR_FLORAL: 0.15,
    PHOTO_VIDEO: 0.08,
    AV_LIGHT_SOUND: 0.07,
    ATTIRE_HMU_VIP: 0.04,
    ENTERTAINMENT: 0.06,
    INVITES_SIGNAGE: 0.02,
    GIFTS_SWAG: 0.04,
    TRANSPORT_STAY: 0.01,
    SECURITY_CLEAN: 0.005,
    LOGISTICS_MISC: 0.005,
  },
  COMMUNITY_EVENT: {
    VENUE_RENTAL: 0.16,
    CATERING_FNB: 0.26,
    DECOR_FLORAL: 0.12,
    PHOTO_VIDEO: 0.06,
    AV_LIGHT_SOUND: 0.18,
    ATTIRE_HMU_VIP: 0.05,
    ENTERTAINMENT: 0.06,
    INVITES_SIGNAGE: 0.04,
    GIFTS_SWAG: 0.04,
    TRANSPORT_STAY: 0.01,
    SECURITY_CLEAN: 0.015,
    LOGISTICS_MISC: 0.005,
  },
};

export const MIN_PER_CAPITA_FLOOR: Record<EventArchetype, Record<BudgetTier, Record<CurrencyCode, number>>> = {
  WEDDING: {
    ECONOMY: { INR: 650, USD: 28, EUR: 26, GBP: 22 },
    STANDARD: { INR: 1400, USD: 65, EUR: 60, GBP: 52 },
    PREMIUM: { INR: 2800, USD: 140, EUR: 130, GBP: 110 },
    LUXURY: { INR: 6000, USD: 300, EUR: 280, GBP: 240 },
  },
  BIRTHDAY: {
    ECONOMY: { INR: 350, USD: 15, EUR: 14, GBP: 12 },
    STANDARD: { INR: 750, USD: 32, EUR: 30, GBP: 25 },
    PREMIUM: { INR: 1500, USD: 65, EUR: 60, GBP: 52 },
    LUXURY: { INR: 3000, USD: 130, EUR: 120, GBP: 105 },
  },
  COMMUNITY_EVENT: {
    ECONOMY: { INR: 180, USD: 8, EUR: 7, GBP: 6 },
    STANDARD: { INR: 400, USD: 18, EUR: 16, GBP: 14 },
    PREMIUM: { INR: 850, USD: 38, EUR: 35, GBP: 30 },
    LUXURY: { INR: 1800, USD: 80, EUR: 75, GBP: 65 },
  },
};

export interface CalculateBudgetParams {
  totalBudget: number;
  guestCount: number;
  archetype: EventArchetype;
  currency: CurrencyCode;
  tier?: BudgetTier;
  contingencyRate?: number; // Default 0.08 (8%)
  taxRate?: number; // Default 0.10 (10%)
}

/**
 * Calculates a complete, mathematically balanced budget summary with
 * tax and contingency reserves, per-capita feasibility checks, and 12-category distributions.
 */
export function calculateBudgetSummary(params: CalculateBudgetParams): BudgetSummary {
  const {
    totalBudget,
    guestCount,
    archetype,
    currency,
    tier = 'STANDARD',
    contingencyRate = 0.08,
    taxRate = 0.10,
  } = params;

  const safeTotalBudget = Math.max(1, Math.round(totalBudget));
  const safeGuestCount = Math.max(1, Math.round(guestCount));

  // 1. Isolate Reserves
  const contingencyReserve = Math.round(safeTotalBudget * contingencyRate);
  const remainingAfterContingency = safeTotalBudget - contingencyReserve;
  const estimatedTaxReserve = Math.round(remainingAfterContingency * (taxRate / (1 + taxRate)));
  const netAllocatableBudget = safeTotalBudget - contingencyReserve - estimatedTaxReserve;

  // 2. Per-Capita Feasibility Analysis
  const perCapitaActual = Math.round(safeTotalBudget / safeGuestCount);
  const perCapitaMinimumViable = MIN_PER_CAPITA_FLOOR[archetype][tier][currency];
  const feasibilityRatio = Number((perCapitaActual / perCapitaMinimumViable).toFixed(2));

  let feasibilityStatus: FeasibilityStatus = 'OPTIMAL';
  if (feasibilityRatio < 0.90) {
    feasibilityStatus = 'CRITICAL_DEFICIT';
  } else if (feasibilityRatio < 1.15) {
    feasibilityStatus = 'TIGHT_VIABLE';
  }

  const deficitAmount =
    feasibilityStatus === 'CRITICAL_DEFICIT'
      ? Math.max(0, safeGuestCount * perCapitaMinimumViable - safeTotalBudget)
      : 0;

  const maxViableGuestsAtCurrentBudget = Math.floor(safeTotalBudget / perCapitaMinimumViable);

  // 3. Category Allocation with Largest-Remainder Integer Distribution
  const weights = BASE_WEIGHTS[archetype];
  const keys = Object.keys(weights) as VendorCategoryKey[];

  const rawAmounts = keys.map((key) => ({
    key,
    label: CATEGORY_LABELS[key],
    weight: weights[key],
    exactAmount: netAllocatableBudget * weights[key],
    floorAmount: Math.floor(netAllocatableBudget * weights[key]),
    remainder: (netAllocatableBudget * weights[key]) - Math.floor(netAllocatableBudget * weights[key]),
  }));

  const floorSum = rawAmounts.reduce((sum, item) => sum + item.floorAmount, 0);
  const discrepancy = netAllocatableBudget - floorSum;

  // Sort by largest remainder and distribute difference
  rawAmounts.sort((a, b) => b.remainder - a.remainder);
  for (let i = 0; i < discrepancy; i++) {
    const item = rawAmounts[i];
    if (item) item.floorAmount += 1;
  }

  const categories: BudgetCategoryAllocation[] = keys.map((key) => {
    const found = rawAmounts.find((item) => item.key === key)!;
    const allocatedAmount = found.floorAmount;
    return {
      key,
      label: CATEGORY_LABELS[key],
      weight: weights[key],
      allocatedAmount,
      quotedAmount: allocatedAmount,
      isLocked: false,
      perCapitaAmount: Math.round(allocatedAmount / safeGuestCount),
      status: 'WITHIN_BUDGET',
      rationale: `${(weights[key] * 100).toFixed(1)}% base allocation for ${archetype}`,
    };
  });

  return {
    totalBudget: safeTotalBudget,
    contingencyRate,
    contingencyReserve,
    taxRate,
    estimatedTaxReserve,
    netAllocatableBudget,
    perCapitaActual,
    perCapitaMinimumViable,
    feasibilityRatio,
    feasibilityStatus,
    deficitAmount,
    maxViableGuestsAtCurrentBudget,
    categories,
  };
}

/**
 * Rebalances unlocked categories proportionally when a user adjusts a slider or locks a quote.
 * Guarantees that sum(categories) === netAllocatableBudget.
 */
export function rebalanceBudget(
  current: BudgetSummary,
  changedKey: VendorCategoryKey,
  newAmount: number
): BudgetSummary {
  const boundedNewAmount = Math.max(0, Math.min(newAmount, current.netAllocatableBudget));
  const targetCategory = current.categories.find((c) => c.key === changedKey);
  if (!targetCategory) return current;

  const lockedSum = current.categories
    .filter((c) => c.isLocked || c.key === changedKey)
    .reduce((sum, c) => sum + (c.key === changedKey ? boundedNewAmount : c.allocatedAmount), 0);

  const availableForUnlocked = Math.max(0, current.netAllocatableBudget - lockedSum);
  const unlockedCategories = current.categories.filter(
    (c) => !c.isLocked && c.key !== changedKey
  );

  const totalUnlockedWeight = unlockedCategories.reduce((sum, c) => sum + c.weight, 0);

  const updatedCategories = current.categories.map((c) => {
    if (c.key === changedKey) {
      return {
        ...c,
        allocatedAmount: boundedNewAmount,
        perCapitaAmount: Math.round(boundedNewAmount / (current.totalBudget / current.perCapitaActual)),
      };
    }
    if (c.isLocked) {
      return c;
    }
    const proportionalShare =
      totalUnlockedWeight > 0 ? (c.weight / totalUnlockedWeight) * availableForUnlocked : 0;
    const rebalancedAmount = Math.round(proportionalShare);
    return {
      ...c,
      allocatedAmount: rebalancedAmount,
      perCapitaAmount: Math.round(rebalancedAmount / (current.totalBudget / current.perCapitaActual)),
    };
  });

  return {
    ...current,
    categories: updatedCategories,
  };
}
