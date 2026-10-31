# Phase 03: Complete Domain Data Models, Type System & Archetype Baseline Seeds

**Phase Number:** 03 of 15  
**Document ID:** `Phase_03_Domain_Data_Models_Type_System_Archetype_Seeds`  
**Target Code Modules:** `src/types/event.ts`, `src/data/archetypeSeeds.ts`  
**Parent Specs:** [Doc 01: PRD](file:///e:/Promptwars%20-%20Challenge%205/Docs/01_Master_PRD_Celebration_and_Event_Planner_OS.md), [Doc 02: Budget & Timeline Math Engine](file:///e:/Promptwars%20-%20Challenge%205/Docs/02_Deterministic_Budget_Timeline_and_Vendor_Math_Engine_Spec.md), [Doc 05: Serverless Architecture & Schema](file:///e:/Promptwars%20-%20Challenge%205/Docs/05_FullStack_Serverless_Architecture_Database_Schema_and_API_Contracts.md)

---

## 1. Architectural Objectives & Rubric Mapping

Phase 03 establishes the single source of truth for all domain entities across the application lifecycle. By defining explicit TypeScript interfaces and seed datasets for the three event archetypes (**Weddings**, **Birthdays**, and **Community Events**), we satisfy the PromptWars Problem Statement alignment criteria and provide realistic data models for live testing.

| Evaluation Rubric Pillar | Phase 03 Engineering Control |
| :--- | :--- |
| **Problem Statement Alignment** | Fully models all 3 archetypes: Weddings (multi-ceremony), Birthdays (milestone & kids), and Community Events (hackathons, fests, galas). |
| **Code Quality** | Enforces strict, branded TypeScript domain types with zero use of `any`. |
| **Efficiency** | Pure immutable seed templates cached in memory with zero runtime overhead. |

---

## 2. Prerequisites & Input State

- Completed Phase 02 (Project scaffolding and TypeScript configuration).
- Workspace directory: `src/types/` and `src/data/`.

---

## 3. Detailed Technical Specification & File Blueprints

### 3.1 File: `src/types/event.ts`
Complete domain model supporting deterministic math, AI generation telemetry, vendor scoring, and Google Workspace synchronization:

```typescript
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
```

### 3.2 File: `src/data/archetypeSeeds.ts`
Rich baseline templates covering Weddings, Birthdays, and Community Events:

```typescript
// src/data/archetypeSeeds.ts
import { EventArchetype, CurrencyCode, VendorCategoryKey } from '../types/event';

export interface ArchetypePreset {
  id: string;
  archetype: EventArchetype;
  title: string;
  subType: string;
  defaultGuestCount: number;
  defaultBudget: Record<CurrencyCode, number>;
  defaultLocation: string;
  defaultVibePrompt: string;
  categoryWeights: Record<VendorCategoryKey, number>;
  defaultDietarySplit: {
    vegetarianPct: number;
    veganPct: number;
    jainPct: number;
    halalPct: number;
    glutenFreeCount: number;
    nutAllergyCount: number;
  };
}

export const ARCHETYPE_PRESETS: ArchetypePreset[] = [
  {
    id: 'wedding-heritage',
    archetype: 'WEDDING',
    title: 'Priya & Karthik Royal Heritage Wedding',
    subType: 'South Indian Multi-Day Wedding & Reception',
    defaultGuestCount: 250,
    defaultBudget: {
      INR: 850000,
      USD: 10500,
      EUR: 9800,
      GBP: 8400,
    },
    defaultLocation: 'Chennai, Tamil Nadu',
    defaultVibePrompt:
      'Eco-friendly Chettinad floral decor with brass lamps, traditional nadaswaram welcome, zero plastic, and banana leaf feast with 40 Jain-safe meals.',
    categoryWeights: {
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
    defaultDietarySplit: {
      vegetarianPct: 70,
      veganPct: 10,
      jainPct: 15,
      halalPct: 0,
      glutenFreeCount: 12,
      nutAllergyCount: 6,
    },
  },
  {
    id: 'birthday-milestone',
    archetype: 'BIRTHDAY',
    title: 'Aarav 1st Birthday / Naming Ceremony Gala',
    subType: 'Milestone Theme Birthday Celebration',
    defaultGuestCount: 60,
    defaultBudget: {
      INR: 45000,
      USD: 600,
      EUR: 550,
      GBP: 470,
    },
    defaultLocation: 'Bangalore, Karnataka',
    defaultVibePrompt:
      'Whimsical pastel hot-air balloon theme with interactive sensory play zone, 3-tier custom berry cake, and personalized storybook return gifts.',
    categoryWeights: {
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
    defaultDietarySplit: {
      vegetarianPct: 60,
      veganPct: 15,
      jainPct: 10,
      halalPct: 0,
      glutenFreeCount: 4,
      nutAllergyCount: 2,
    },
  },
  {
    id: 'community-hackathon',
    archetype: 'COMMUNITY_EVENT',
    title: 'Inter-College AI Hackathon & Cultural Night',
    subType: 'College Tech/Cultural Fest & Hackathon',
    defaultGuestCount: 400,
    defaultBudget: {
      INR: 150000,
      USD: 2000,
      EUR: 1850,
      GBP: 1600,
    },
    defaultLocation: 'Coimbatore, Tamil Nadu',
    defaultVibePrompt:
      'High-energy cyberpunk neon stage with 4K LED wall, late-night cold brew & vegan snack stations, sponsor booth aisles, and student swag kits.',
    categoryWeights: {
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
    defaultDietarySplit: {
      vegetarianPct: 50,
      veganPct: 20,
      jainPct: 5,
      halalPct: 15,
      glutenFreeCount: 8,
      nutAllergyCount: 4,
    },
  },
];
```

---

## 4. Copy-Pasteable Antigravity Execution Prompt

```markdown
> **Antigravity Phase 03 Execution Prompt:**
> Implement the complete domain data models and archetype seeds for AuraPlan AI (UtsavOS):
> 1. Create `src/types/event.ts` declaring all TypeScript interfaces: `EventArchetype`, `CurrencyCode`, `BudgetTier`, `FeasibilityStatus`, `VendorCategoryKey`, `OrganizerProfile`, `DietaryBreakdown`, `BudgetCategoryAllocation`, `BudgetSummary`, `TimelineMilestone`, `RunOfShowSlot`, `VendorChecklistItem`, `VendorRecord`, `CopilotMode`, `AIGenerationRun`, `DynamicDiffReport`, `EventPlanState`, and `WorkspaceSyncPayload`.
> 2. Create `src/data/archetypeSeeds.ts` defining `ARCHETYPE_PRESETS` with production baseline templates for Weddings, Birthdays, and Community Events/Fests.
> 3. Verify zero TypeScript errors with `npx tsc --noEmit`.
```

---

## 5. Verification & Test Commands

### Automated Verification
```powershell
# Type-check interfaces and data presets
npx tsc --noEmit
```

### Manual Verification
1. Verify `ARCHETYPE_PRESETS` has entries for `WEDDING`, `BIRTHDAY`, and `COMMUNITY_EVENT`.
2. Verify the sum of `categoryWeights` for each archetype equals exactly `1.0000` (e.g., `0.20 + 0.30 + 0.14 + 0.10 + 0.05 + 0.07 + 0.04 + 0.02 + 0.03 + 0.03 + 0.01 + 0.01 = 1.00`).

---

## 6. Failure Modes & Recovery Protocol

- **Floating Point Weight Drift:** If category weights sum to `0.9999` or `1.0001`, enforce exact 2-decimal floats and verify against the specification matrix in Doc 02.
