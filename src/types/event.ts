// src/types/event.ts

export type EventArchetype = 'WEDDING' | 'BIRTHDAY' | 'COMMUNITY_EVENT';

export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP';

export type BudgetTier = 'ECONOMY' | 'STANDARD' | 'PREMIUM' | 'LUXURY';

export type FeasibilityStatus = 'OPTIMAL' | 'TIGHT_VIABLE' | 'CRITICAL_DEFICIT';

export type VendorCategoryKey =
  | 'VENUE_RENTAL'
  | 'CATERING_FNB'
  | 'DECOR_FLORAL'
  | 'PHOTO_VIDEO'
  | 'AV_LIGHT_SOUND'
  | 'ATTIRE_HMU_VIP'
  | 'ENTERTAINMENT'
  | 'INVITES_SIGNAGE'
  | 'GIFTS_SWAG'
  | 'TRANSPORT_STAY'
  | 'SECURITY_CLEAN'
  | 'LOGISTICS_MISC';

export interface OrganizerProfile {
  fullName: string;
  email: string;
  phone: string;
  organizationOrFamily: string;
}

export interface DietaryBreakdown {
  vegetarianPct: number;
  veganPct: number;
  jainPct: number;
  halalPct: number;
  glutenFreeCount: number;
  nutAllergyCount: number;
}

export interface BudgetCategoryAllocation {
  key: VendorCategoryKey;
  label: string;
  weight: number;
  allocatedAmount: number;
  quotedAmount: number;
  isLocked: boolean;
  perCapitaAmount: number;
  status: 'WITHIN_BUDGET' | 'NEAR_LIMIT' | 'OVER_BUDGET';
  rationale: string;
}

export interface BudgetSummary {
  totalBudget: number;
  contingencyRate: number;
  contingencyReserve: number;
  taxRate: number;
  estimatedTaxReserve: number;
  netAllocatableBudget: number;
  perCapitaActual: number;
  perCapitaMinimumViable: number;
  feasibilityRatio: number;
  feasibilityStatus: FeasibilityStatus;
  deficitAmount: number;
  maxViableGuestsAtCurrentBudget: number;
  categories: BudgetCategoryAllocation[];
}

export interface TimelineMilestone {
  id: string;
  title: string;
  phaseLabel: string; // e.g. "T-90 Days", "T-30 Days", "T-7 Days", "Event Day"
  dueDateIso: string;
  daysBeforeEvent: number;
  category: VendorCategoryKey;
  priority: 'CRITICAL' | 'HIGH' | 'NORMAL';
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING' | 'DELAYED';
  owner: string;
  deliverableCheck: string;
}

export interface RunOfShowSlot {
  id: string;
  startTimeMinutes: number; // Minutes from 00:00 (e.g. 540 = 09:00 AM)
  durationMinutes: number;
  bufferMinutes: number;
  title: string;
  category: VendorCategoryKey;
  owner: string;
  dependsOnIds: string[];
  isCriticalPath: boolean;
  delayAppliedMinutes: number;
  hasCurfewConflict: boolean;
  notes: string;
}

export interface VendorChecklistItem {
  id: string;
  category: VendorCategoryKey;
  taskTitle: string;
  completed: boolean;
  isMandatorySafetyOrSLA: boolean;
}

export interface VendorRecord {
  category: VendorCategoryKey;
  categoryLabel: string;
  vendorName: string;
  contactEmailOrPhone: string;
  allocatedBudget: number;
  quotedPrice: number;
  advancePaidPct: number;
  eventDayTranchePct: number;
  postEventHoldbackPct: number;
  bookingStatus: 'NOT_STARTED' | 'SHORTLISTED' | 'BOOKED' | 'ADVANCE_PAID' | 'COMPLETED';
  highAdvanceRiskFlag: boolean;
  checklistItems: VendorChecklistItem[];
  readinessScorePct: number;
}

export type CopilotMode =
  | 'THEME_AND_IDEAS'
  | 'MENU_AND_CATERING'
  | 'BUDGET_OPTIMIZER'
  | 'VENDOR_NEGOTIATOR'
  | 'CRISIS_SIMULATOR';

export interface AIGenerationRun {
  runId: string;
  timestampIso: string;
  copilotMode: CopilotMode;
  modelUsed: string;
  latencyMs: number;
  inputSnapshot: {
    eventType: EventArchetype;
    subType: string;
    guestCount: number;
    totalBudget: number;
    currency: CurrencyCode;
    location: string;
    userPrompt: string;
  };
  promptSent: string;
  structuredOutput: Record<string, unknown>;
}

export interface DynamicDiffReport {
  runAId: string;
  runBId: string;
  inputDeltas: Array<{ field: string; from: string | number; to: string | number }>;
  mutatedFields: Array<{
    fieldPath: string;
    previousValue: unknown;
    updatedValue: unknown;
    category: string;
  }>;
  summary: string;
}

export interface EventPlanState {
  id: string;
  createdAtIso: string;
  updatedAtIso: string;
  organizer: OrganizerProfile;
  archetype: EventArchetype;
  subType: string;
  eventName: string;
  eventDateIso: string;
  city: string;
  currency: CurrencyCode;
  guestCount: number;
  dietary: DietaryBreakdown;
  budget: BudgetSummary;
  milestones: TimelineMilestone[];
  runOfShow: RunOfShowSlot[];
  vendors: VendorRecord[];
  aiRuns: AIGenerationRun[];
  customVibePrompt: string;
}

export interface WorkspaceSyncPayload {
  eventName: string;
  eventDate: string;
  city: string;
  currency: CurrencyCode;
  totalBudget: number;
  guestCount: number;
  allocations: Array<{ label: string; percent: number; amount: number; locked: boolean }>;
  milestones: Array<{ offsetLabel: string; title: string; owner: string; scheduledDate: string }>;
  vendors: Array<{
    category: string;
    totalAmount: number;
    advance30: number;
    eventDay50: number;
    holdback20: number;
    completedChecks: number;
  }>;
}
