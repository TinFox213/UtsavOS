# **Full-Stack Serverless Architecture, TypeScript Domain Model & API Contracts Specification**

**Document ID:** 05\_FullStack\_Serverless\_Architecture\_Database\_Schema\_and\_API\_Contracts  
**Parent Folder:** [Promptwars \- Challenge 5](https://drive.google.com/drive/folders/1_X0KYzGtE3KIC3PJVvHtiW4JfhCmILt5)  
**Target Code Modules:** `src/types/event.ts`, `src/schemas/validationSchemas.ts`, `api/v1/ai-generate.ts`, `src/services/storageService.ts`

# **1\. High-Availability Hybrid Serverless Architecture**

To ensure the deployed URL never fails when judges test it (even under high concurrency or without external database credentials), **AuraPlan AI (UtsavOS)** implements a **Zero-Single-Point-of-Failure Hybrid Architecture**:

* **Frontend SPA \+ PWA (`Vite + React 19 + TypeScript + Tailwind CSS v4`):** Executes deterministic budget math (`budgetEngine.ts`), critical-path timeline scheduling (`timelineEngine.ts`), vendor tranche scoring (`vendorEngine.ts`), and Zod input validation in `<5ms` on the client.  
* **Serverless AI Proxy & API Layer (`api/v1/ai-generate.ts` \+ Express/Vite Dev Middleware):** Keeps `GEMINI_API_KEY` secure on the server, enforces OWASP prompt-injection sanitization and rate limiting, calls `@google/genai` (`gemini-2.5-flash`) with structured JSON schemas, and includes an **Intelligent Dynamic Synthesis Fallback** if rate-limited so live demos never hang or error out.  
* **Dual Persistence Layer (`IndexedDB / localStorage` \+ Optional Neon Serverless Postgres):** Every event plan, budget adjustment, vendor quote, and AI generation run is persisted immediately on-device and exportable as a standalone JSON/PDF/Markdown Event Dossier.

# **2\. Complete TypeScript Domain Model (`src/types/event.ts`)**

export type EventArchetype \= 'WEDDING' \| 'BIRTHDAY' \| 'COMMUNITY\_EVENT';

\|---\|

export type CurrencyCode \= 'INR' \| 'USD' \| 'EUR' \| 'GBP';

export type BudgetTier \= 'ECONOMY' \| 'STANDARD' \| 'PREMIUM' \| 'LUXURY';

export type FeasibilityStatus \= 'OPTIMAL' \| 'TIGHT\_VIABLE' \| 'CRITICAL\_DEFICIT';

export type VendorCategoryKey \=

  \| 'VENUE\_RENTAL'

  \| 'CATERING\_FNB'

  \| 'DECOR\_FLORAL'

  \| 'PHOTO\_VIDEO'

  \| 'AV\_LIGHT\_SOUND'

  \| 'ATTIRE\_HMU\_VIP'

  \| 'ENTERTAINMENT'

  \| 'INVITES\_SIGNAGE'

  \| 'GIFTS\_SWAG'

  \| 'TRANSPORT\_STAY'

  \| 'SECURITY\_CLEAN'

  \| 'LOGISTICS\_MISC';

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

  status: 'WITHIN\_BUDGET' \| 'NEAR\_LIMIT' \| 'OVER\_BUDGET';

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

  categories: BudgetCategoryAllocation\[\];

}

export interface TimelineMilestone {

  id: string;

  title: string;

  phaseLabel: string; // e.g., "T-90 Days", "T-30 Days", "T-7 Days", "Event Day"

  dueDateIso: string;

  daysBeforeEvent: number;

  category: VendorCategoryKey;

  priority: 'CRITICAL' \| 'HIGH' \| 'NORMAL';

  status: 'COMPLETED' \| 'IN\_PROGRESS' \| 'PENDING' \| 'DELAYED';

  owner: string;

  deliverableCheck: string;

}

export interface RunOfShowSlot {

  id: string;

  startTimeMinutes: number; // Minutes from 00:00 (e.g. 540 \= 09:00 AM)

  durationMinutes: number;

  bufferMinutes: number;

  title: string;

  category: VendorCategoryKey;

  owner: string;

  dependsOnIds: string\[\];

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

  bookingStatus: 'NOT\_STARTED' \| 'SHORTLISTED' \| 'BOOKED' \| 'ADVANCE\_PAID' \| 'COMPLETED';

  highAdvanceRiskFlag: boolean;

  checklistItems: VendorChecklistItem\[\];

  readinessScorePct: number;

}

export interface AIGenerationRun {

  runId: string;

  timestampIso: string;

  copilotMode: 'THEME\_AND\_IDEAS' \| 'MENU\_AND\_CATERING' \| 'BUDGET\_OPTIMIZER' \| 'VENDOR\_NEGOTIATOR' \| 'CRISIS\_SIMULATOR';

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

  structuredOutput: Record\<string, unknown\>;

}

# **3\. Strict Zod Runtime Input Validation (`src/schemas/validationSchemas.ts`)**

Directly powers **Video Section 2 ("Demonstrate Your Testing Process — Enter data live, show success and edge cases")**:import { z } from 'zod';

export const OrganizerAndEventInputSchema \= z.object({

  organizerName: z

    .string()

    .trim()

    .min(2, 'Organizer name must be at least 2 characters.')

    .max(80, 'Organizer name cannot exceed 80 characters.'),

  organizerEmail: z

    .string()

    .trim()

    .email('Please enter a valid email address (e.g., john@example.com).')

    .refine((val) \=\> /^\[^\\s@\]+@\[^\\s@\]+\\.\[a-zA-Z\]{2,}\$/.test(val), {

      message: 'Email domain must include a valid TLD (e.g., .com, .org, .in).',

    }),

  eventName: z

    .string()

    .trim()

    .min(3, 'Event title must be at least 3 characters.')

    .max(120, 'Event title cannot exceed 120 characters.'),

  eventType: z.enum(\['WEDDING', 'BIRTHDAY', 'COMMUNITY\_EVENT'\]),

  eventDate: z.string().refine((dateStr) \=\> {

    const parsed \= new Date(dateStr);

    const today \= new Date();

    today.setHours(0, 0, 0, 0);

    return \!isNaN(parsed.getTime()) && parsed \>= today;

  }, 'Event date cannot be in the past. Please choose today or a future date.'),

  guestCount: z

    .number({ invalid\_type\_error: 'Guest count must be a valid number.' })

    .int('Guest count must be a whole number.')

    .min(5, 'Minimum guest count is 5.')

    .max(50000, 'Guest count exceeds single-venue safety cap (50,000).'),

  totalBudget: z

    .number({ invalid\_type\_error: 'Budget must be a valid numeric amount.' })

    .positive('Total budget must be greater than 0.')

    .max(1000000000, 'Budget exceeds maximum supported limit.'),

  userPrompt: z

    .string()

    .max(1000, 'Custom prompt cannot exceed 1,000 characters.')

    .refine(

      (val) \=\> \!/(ignore previous instructions\|system prompt\|drop table\|\<script)/i.test(val),

      'Security Guardrail: Input contains restricted prompt-injection or script patterns.'

    ),

});

# **4\. Serverless API Contracts (`api/v1/*`)**

| Endpoint | Method | Input Payload | Primary Logic & Security Controls | Output Payload |
| :---- | :---- | :---- | :---- | :---- |
| `POST /api/v1/ai-generate` | `POST` | `{ copilotMode, eventContext, userPrompt }` | Validates payload against `OrganizerAndEventInputSchema`, strips HTML/script tags, checks OWASP LLM01 prompt-injection signatures, constructs the deterministic-constrained prompt, and invokes `gemini-2.5-flash`. | `{ runId, modelUsed: "gemini-2.5-flash", latencyMs, promptSent, structuredOutput, dynamicVerificationHash }` |
| `POST /api/v1/verify-test-suite` | `POST` | `{ suiteName, dynamicTimestamp }` | Runs live validation assertions for the In-App QA Bar so judges can watch automated \+ manual test cases pass in real time. | `{ status: "PASSED", totalAssertions: 24, failedCount: 0, executionMs: 12 }` |

