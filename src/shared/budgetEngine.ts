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
  contingencyRate?: number;
  taxRate?: number;
}

export interface BudgetReserves {
  contingencyReserve: number;
  estimatedTaxReserve: number;
  netAllocatableBudget: number;
}

export interface FeasibilityAssessment {
  perCapitaActual: number;
  perCapitaMinimumViable: number;
  feasibilityRatio: number;
  feasibilityStatus: FeasibilityStatus;
  deficitAmount: number;
  maxViableGuestsAtCurrentBudget: number;
}

/**
 * Calculates contingency and tax reserves with integer precision.
 */
export function calculateReserves(
  safeTotalBudget: number,
  contingencyRate: number,
  taxRate: number
): BudgetReserves {
  const contingencyReserve = Math.round(safeTotalBudget * contingencyRate);
  const remaining = safeTotalBudget - contingencyReserve;
  const estimatedTaxReserve = Math.round(remaining * (taxRate / (1 + taxRate)));
  const netAllocatableBudget = safeTotalBudget - contingencyReserve - estimatedTaxReserve;
  return { contingencyReserve, estimatedTaxReserve, netAllocatableBudget };
}

/**
 * Evaluates per-capita financial feasibility against market tier baselines.
 */
export function evaluateFeasibility(
  safeTotalBudget: number,
  safeGuestCount: number,
  archetype: EventArchetype,
  tier: BudgetTier,
  currency: CurrencyCode
): FeasibilityAssessment {
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

  return {
    perCapitaActual,
    perCapitaMinimumViable,
    feasibilityRatio,
    feasibilityStatus,
    deficitAmount,
    maxViableGuestsAtCurrentBudget,
  };
}

/**
 * Distributes net budget across categories using largest-remainder algorithm.
 */
export function allocateCategories(
  netAllocatableBudget: number,
  safeGuestCount: number,
  archetype: EventArchetype
): BudgetCategoryAllocation[] {
  const weights = BASE_WEIGHTS[archetype];
  const keys = Object.keys(weights) as VendorCategoryKey[];

  const rawAmounts = keys.map((key) => {
    const exact = netAllocatableBudget * weights[key];
    const floorAmount = Math.floor(exact);
    return { key, weight: weights[key], floorAmount, remainder: exact - floorAmount };
  });

  const floorSum = rawAmounts.reduce((sum, item) => sum + item.floorAmount, 0);
  const discrepancy = netAllocatableBudget - floorSum;

  rawAmounts.sort((a, b) => b.remainder - a.remainder);
  for (let i = 0; i < discrepancy; i++) {
    const item = rawAmounts[i];
    if (item) item.floorAmount += 1;
  }

  return keys.map((key) => {
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
}

/**
 * Calculates a complete, mathematically balanced budget summary.
 */
export function calculateBudgetSummary(params: CalculateBudgetParams): BudgetSummary {
  const safeTotalBudget = Math.max(1, Math.round(params.totalBudget));
  const safeGuestCount = Math.max(1, Math.round(params.guestCount));
  const contingencyRate = params.contingencyRate ?? 0.08;
  const taxRate = params.taxRate ?? 0.10;
  const tier = params.tier ?? 'STANDARD';

  const reserves = calculateReserves(safeTotalBudget, contingencyRate, taxRate);
  const feasibility = evaluateFeasibility(safeTotalBudget, safeGuestCount, params.archetype, tier, params.currency);
  const categories = allocateCategories(reserves.netAllocatableBudget, safeGuestCount, params.archetype);

  return {
    totalBudget: safeTotalBudget,
    contingencyRate,
    taxRate,
    ...reserves,
    ...feasibility,
    categories,
  };
}

/**
 * Rebalances unlocked categories proportionally when a user adjusts a slider.
 */
export function rebalanceBudget(
  current: BudgetSummary,
  changedKey: VendorCategoryKey,
  newAmount: number
): BudgetSummary {
  const boundedNew = Math.max(0, Math.min(newAmount, current.netAllocatableBudget));
  const target = current.categories.find((c) => c.key === changedKey);
  if (!target) return current;

  const lockedSum = current.categories
    .filter((c) => c.isLocked || c.key === changedKey)
    .reduce((sum, c) => sum + (c.key === changedKey ? boundedNew : c.allocatedAmount), 0);

  const available = Math.max(0, current.netAllocatableBudget - lockedSum);
  const unlocked = current.categories.filter((c) => !c.isLocked && c.key !== changedKey);
  const totalWeight = unlocked.reduce((sum, c) => sum + c.weight, 0);
  const guestCount = current.totalBudget / current.perCapitaActual;

  const categories = current.categories.map((c) => {
    if (c.key === changedKey) {
      return { ...c, allocatedAmount: boundedNew, perCapitaAmount: Math.round(boundedNew / guestCount) };
    }
    if (c.isLocked) return c;
    const share = totalWeight > 0 ? Math.round((c.weight / totalWeight) * available) : 0;
    return { ...c, allocatedAmount: share, perCapitaAmount: Math.round(share / guestCount) };
  });

  return { ...current, categories };
}
