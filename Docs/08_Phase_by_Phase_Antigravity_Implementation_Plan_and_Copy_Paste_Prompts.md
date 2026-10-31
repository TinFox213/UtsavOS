# **Phase-by-Phase Antigravity Implementation Plan & Copy-Pasteable Execution Prompts — AuraPlan AI (UtsavOS)**

**Document ID:** 08\_Phase\_by\_Phase\_Antigravity\_Implementation\_Plan\_and\_Copy\_Paste\_Prompts  
**Parent Folder:** [Promptwars \- Challenge 5](https://drive.google.com/drive/folders/1_X0KYzGtE3KIC3PJVvHtiW4JfhCmILt5)  
**Purpose:** Master implementation blueprint, target file tree, 10 sequential copy-pasteable prompts for Google Antigravity, deployment configs, and production README.md.

---

# **1\. Target Production Repository File Tree (auraplan-ai-event-planner/)**

t  
auraplan-ai-event-planner/  
├── README.md                                  \# Complete architecture, rubric mapping & setup guide  
├── package.json                               \# React 19, TypeScript, Tailwind v4, @google/genai, zod, lucide-react, vitest  
├── tsconfig.json                              \# Strict TypeScript configuration (strict: true, noImplicitAny: true)  
├── vite.config.ts                             \# Vite build, code-splitting & local API middleware plugin  
├── vercel.json                                \# Serverless function routing \+ CSP / OWASP security headers  
├── .env.example                               \# GEMINI\_API\_KEY template (zero secrets committed)  
├── api/  
│   └── v1/  
│       └── ai-generate.ts                     \# Stateless Gemini 2.5 Flash structured JSON endpoint \+ OWASP guardrail  
├── src/  
│   ├── types/  
│   │   └── event.ts                           \# Complete domain interfaces (Archetypes, Budgets, CPM Timeline, Vendors, AI Runs)  
│   ├── schemas/  
│   │   └── validationSchemas.ts               \# Strict Zod schemas (RFC-5322 email, positive budget, future date, prompt guardrail)  
│   ├── shared/  
│   │   ├── budgetEngine.ts                    \# 12-Category Parametric Allocator, Tax/Contingency Shield, Per-Capita Deficit math  
│   │   ├── timelineEngine.ts                  \# CPM Countdown Roadmap, Express Sprint mode & Run-of-Show Delay Ripple engine  
│   │   ├── vendorEngine.ts                    \# 120-Point Vendor Checklist, 3-Tranche Payment Guardrail & Readiness scorer  
│   │   ├── dynamicDiffEngine.ts               \# Compares Run \#1 vs Run \#2 to prove 100% dynamic GenAI responses  
│   │   └── securityGuardrails.ts              \# OWASP LLM01 prompt injection & XSS sanitizer  
│   ├── data/  
│   │   └── archetypeSeeds.ts                  \# Rich baseline templates for Weddings, Birthdays & Community Events/Fests  
│   ├── services/  
│   │   ├── geminiService.ts                   \# Client/Server bridge for 5 Gemini 2.5 Flash Copilots \+ dynamic synthesis fallback  
│   │   └── storageService.ts                  \# Offline-first localStorage / IndexedDB state manager & JSON/Markdown exporter  
│   ├── components/  
│   │   ├── NavbarStepper.tsx                  \# 6-Step Guided Workflow Navigation \+ High-Contrast & Currency Switcher  
│   │   ├── LiveQATestBar.tsx                  \# Zoomed-in Live Input & Validation Mirror Bar for Video Section 2  
│   │   ├── OnboardingWizardView.tsx           \# Step 1: Live-validated Organizer Login \+ Event Setup Form  
│   │   ├── DashboardView.tsx                  \# Step 2: 4 Hero KPIs, Feasibility Ring, Readiness Score & Dietary Matrix  
│   │   ├── BudgetStudioView.tsx               \# Step 3: 60 FPS 12-Category Lock/Rebalance Sliders \+ Deficit Rescue CTA  
│   │   ├── TimelineView.tsx                   \# Step 4: Countdown Milestones \+ Minute-by-Minute Run-of-Show \+ Delay Simulator  
│   │   ├── VendorChecklistView.tsx            \# Step 5: 12 Vendor Categories, 120 Checklists, 3-Tranche Tracker & AI RFP Generator  
│   │   ├── GenAIStudioView.tsx                \# Step 6: 5 Gemini Copilots (Theme, Menu, Budget Rescue, Vendor RFP, Crisis Sim)  
│   │   └── PromptXRayDrawer.tsx               \# Split-Screen "Prompt Going In \-\> Response Coming Out" \+ Dynamic Diff Proof  
│   ├── App.tsx                                \# Main application shell with ARIA live regions & keyboard shortcuts  
│   └── main.tsx                               \# Entry point  
└── tests/  
├── budgetEngine.test.ts                   \# 12 unit tests for parametric budget math & deficit detection  
├── timelineEngine.test.ts                 \# 8 unit tests for CPM scheduling & delay ripple math  
└── validationAndSecurity.test.ts          \# 10 unit tests for Zod validation (john@example.com) & OWASP guardrails

\---

\#\# 2\. Sequential Copy-Pasteable Antigravity Execution Prompts (Phases 1 to 10\)

Copy and paste each phase prompt below sequentially into \*\*Google Antigravity\*\*. Wait for each phase to finish and pass its verification command before running the next phase.

\#\#\# Phase 1 — Project Scaffolding, Strict TypeScript & Dependencies

\*\*Copy-Paste Prompt for Antigravity:\*\*

\> \*\*Antigravity Phase 1:\*\* Initialize a clean Vite \+ React 19 \+ TypeScript \+ Tailwind CSS v4 project for \*\*AuraPlan AI (UtsavOS)\*\* (\`\[Challenge 5\] Celebration & Event Planner\`). Install \`@google/genai\`, \`zod\`, \`lucide-react\`, and \`vitest\`. Configure \`tsconfig.json\` with \`"strict": true\` and \`"noImplicitAny": true\`. Create \`.env.example\` with \`GEMINI\_API\_KEY="your\_gemini\_api\_key\_here"\` and configure \`vercel.json\` with OWASP security headers (\`X-Content-Type-Options: nosniff\`, \`X-Frame-Options: DENY\`, \`Referrer-Policy: strict-origin-when-cross-origin\`). Verify \`npm run build\` succeeds.

\---

\#\#\# Phase 2 — Domain Model, Archetype Seeds & Zod Validation Engine

\*\*Copy-Paste Prompt for Antigravity:\*\*

\> \*\*Antigravity Phase 2:\*\* Read \`05\_FullStack\_Serverless\_Architecture\_Database\_Schema\_and\_API\_Contracts\` and \`06\_Security\_Efficiency\_Code\_Quality\_and\_PromptWars\_Rubric\_Playbook\`. Create:

\> 1\. \`src/types/event.ts\` implementing all TypeScript interfaces (\`EventArchetype\`, \`CurrencyCode\`, \`BudgetSummary\`, \`BudgetCategoryAllocation\`, \`TimelineMilestone\`, \`RunOfShowSlot\`, \`VendorRecord\`, \`AIGenerationRun\`).

\> 2\. \`src/shared/securityGuardrails.ts\` implementing \`auditAndSanitizeInput()\` to block XSS and OWASP LLM01 prompt injection (\`"Ignore previous instructions"\`, \`\<script\>\`, etc.).

\> 3\. \`src/schemas/validationSchemas.ts\` implementing \`OrganizerAndEventInputSchema\` with strict RFC-5322 email validation (\`john@example.com\` passes; \`john@invalid\` fails with clear message), positive budget validation, guest count bounds (\`5\` to \`50,000\`), and past-date rejection.

\> 4\. \`src/data/archetypeSeeds.ts\` with rich baseline templates for \*\*Weddings\*\* (South/North Indian & Western), \*\*Birthdays\*\* (Milestone & Theme), and \*\*Community Events\*\* (College Fest / Hackathon / Charity Gala).

\> Run \`npx tsc \--noEmit\` to verify zero type errors.

\---

\#\#\# Phase 3 — Isomorphic Budget, CPM Timeline & Vendor Math Engines \+ Unit Tests

\*\*Copy-Paste Prompt for Antigravity:\*\*

\> \*\*Antigravity Phase 3:\*\* Read \`02\_Deterministic\_Budget\_Timeline\_and\_Vendor\_Math\_Engine\_Spec\`. Implement:

\> 1\. \`src/shared/budgetEngine.ts\`: 12-category parametric allocation across \`WEDDING\`, \`BIRTHDAY\`, and \`COMMUNITY\_EVENT\`, isolating \`8%\` Contingency Reserve and \`10%\` Tax Reserve, computing \`perCapitaActual\` vs \`perCapitaMinimumViable\`, flagging \`OPTIMAL\` / \`TIGHT\_VIABLE\` / \`CRITICAL\_DEFICIT\`, and supporting \`\<16ms\` proportional lock-and-rebalance slider math.

\> 2\. \`src/shared/timelineEngine.ts\`: Critical Path Method (CPM) backward countdown generator (\`T-180d\` to \`T-1d\` with automatic \*\*Express Sprint Mode\*\* when lead time \`\< 14\` days) and Minute-by-Minute Event Day Run-of-Show with \`applyTimelineDelay()\` ripple calculation and \`22:00\` curfew conflict detection.

\> 3\. \`src/shared/vendorEngine.ts\`: 12 vendor categories with 10 domain-specific checklist items per category (120 total), 3-tranche payment tracker (\`30% Advance / 50% Event Day / 20% Holdback\`), and \`highAdvanceRiskFlag\` when advance \`\> 50%\`.

\> 4\. \`src/shared/dynamicDiffEngine.ts\`: Computes field-by-field diffs between two \`AIGenerationRun\` objects to prove dynamic AI outputs.

\> 5\. Create Vitest test suites in \`tests/budgetEngine.test.ts\`, \`tests/timelineEngine.test.ts\`, and \`tests/validationAndSecurity.test.ts\` and run \`npx vitest run\` to verify 100% pass rate.

\---

\#\#\# Phase 4 — Gemini 2.5 Flash Serverless Endpoint & 5 Specialized AI Copilots

\*\*Copy-Paste Prompt for Antigravity:\*\*

\> \*\*Antigravity Phase 4:\*\* Read \`03\_GenAI\_Architecture\_Prompt\_Engineering\_and\_Dynamic\_Proof\_Spec\`. Create:

\> 1\. \`api/v1/ai-generate.ts\` and a Vite dev server middleware route (\`/api/v1/ai-generate\`) that validates incoming requests with Zod \+ \`auditAndSanitizeInput()\`, constructs the deterministic-constrained prompt, calls \`@google/genai\` (\`model: 'gemini-2.5-flash'\`, \`responseMimeType: 'application/json'\`), and returns \`{ runId, modelUsed, latencyMs, promptSent, structuredOutput }\`.

\> 2\. \`src/services/geminiService.ts\` supporting all 5 Copilot Modes (\`THEME\_AND\_IDEAS\`, \`MENU\_AND\_CATERING\`, \`BUDGET\_OPTIMIZER\`, \`VENDOR\_NEGOTIATOR\`, \`CRISIS\_SIMULATOR\`), including a parameter-reactive dynamic fallback synthesizer if the user runs offline without an API key so the app never crashes during testing.

\---

\#\#\# Phase 5 — Step 1 UI: Live-Validated Onboarding Wizard & Live Judge QA Bar

\*\*Copy-Paste Prompt for Antigravity:\*\*

\> \*\*Antigravity Phase 5:\*\* Read \`04\_UI\_UX\_Design\_System\_Interactive\_Views\_and\_WCAG\_Accessibility\_Spec\` and \`07\_Comprehensive\_Testing\_Specification\_and\_Live\_Video\_QA\_Harness\`. Build:

\> 1\. \`src/components/NavbarStepper.tsx\`: 6-Step Guided Workflow bar (\`1. Setup & Live Test\`, \`2. Dashboard\`, \`3. Budget Studio\`, \`4. Timeline & Run-of-Show\`, \`5. Vendor Checklist\`, \`6. GenAI Studio & X-Ray\`), Currency Switcher (\`INR ₹\`, \`USD \$\`, \`EUR €\`, \`GBP £\`), and High-Contrast Accessibility Toggle.

\> 2\. \`src/components/LiveQATestBar.tsx\`: A collapsible \*\*"Live Testing & Validation Inspector"\*\* bar at the top of the screen that mirrors the currently focused input in large \`18px\` monospace text with real-time \`VALID\` (Emerald) vs \`INVALID / EDGE CASE\` (Crimson) badges so video judges can clearly read live test inputs like \`"john@example.com"\`, \`"john@invalid"\`, \`"-15000"\`, or \`500 guests on ₹25,000\`.

\> 3\. \`src/components/OnboardingWizardView.tsx\`: Complete live-validated form starting with \*\*empty/clean live-entry mode\*\* (plus optional 1-click scenario presets clearly labeled for comparison) so the user can type inputs live during the video.

\---

\#\#\# Phase 6 — Step 2 & Step 3 UI: Command Center Dashboard & 60 FPS Budget Studio

\*\*Copy-Paste Prompt for Antigravity:\*\*

\> \*\*Antigravity Phase 6:\*\* Build \`src/components/DashboardView.tsx\` and \`src/components/BudgetStudioView.tsx\`:

\> 1\. \`DashboardView.tsx\`: 4 Hero KPI cards (Total & Net Allocatable Budget, Per-Capita Feasibility Status Badge, Critical Path Countdown, Vendor Readiness Score) \+ Dietary Breakdown matrix (\`Veg\`, \`Vegan\`, \`Jain\`, \`Halal\`, \`Gluten-Free\`, \`Nut-Allergy\`).

\> 2\. \`BudgetStudioView.tsx\`: Interactive sliders for all 12 expense categories with Lock/Unlock toggles (\`\<16ms\` proportional rebalancing), Tax (\`10%\`) & Contingency (\`8%\`) shield cards, the \*\*Critical Per-Capita Deficit Alert Banner\*\*, and the 1-click \*\*"Optimize Budget with Gemini AI"\*\* button that applies AI value-engineering swaps directly to the ledger.

\---

\#\#\# Phase 7 — Step 4 & Step 5 UI: Critical-Path Timeline, Crisis Simulator & Vendor Checklist

\*\*Copy-Paste Prompt for Antigravity:\*\*

\> \*\*Antigravity Phase 7:\*\* Build \`src/components/TimelineView.tsx\` and \`src/components/VendorChecklistView.tsx\`:

\> 1\. \`TimelineView.tsx\`: Dual-tab view featuring (a) \*\*Macro Countdown Roadmap (\`T-180d\` to \`T-1d\`)\*\* with Express Sprint badge when \`\<14\` days away, and (b) \*\*Minute-by-Minute Event Day Run-of-Show\*\* with interactive \*\*Live Delay & Weather Crisis Injectors\*\* (\`+30m Caterer Delay\`, \`+45m Chief Guest Delay\`, \`Sudden Outdoor Rain\`) that ripple-shift dependent slots and highlight curfew conflicts.

\> 2\. \`VendorChecklistView.tsx\`: 12 expandable vendor categories, 120 interactive checklist items, Quote vs Allocation comparator, 3-Tranche Payment Guardrail (\`30% Advance / 50% Event Day / 20% Holdback\`) with \`\>50% Advance Risk Alert\`, and 1-click \*\*AI WhatsApp/Email RFP & Negotiation Script Generator\*\*.

\---

\#\#\# Phase 8 — Step 6 UI: GenAI Personalization Studio, Live Prompt X-Ray & Dynamic Diff Proof

\*\*Copy-Paste Prompt for Antigravity:\*\*

\> \*\*Antigravity Phase 8:\*\* Build \`src/components/GenAIStudioView.tsx\` and \`src/components/PromptXRayDrawer.tsx\` specifically optimized for \*\*Video Submission Guide Section 3 ("Highlight GenAI Integration")\*\*:

\> 1\. Provide interactive cards for all 5 Gemini 2.5 Flash Copilots (\*Theme & Decor BOM Architect\*, \*Multi-Dietary Menu & Quantity Planner\*, \*Budget Value-Engineering Optimizer\*, \*Vendor RFP Negotiator\*, and \*Crisis Rescue Simulator\*).

\> 2\. Build the split-screen \*\*Live Prompt X-Ray & Response Inspector\*\* displaying the exact interpolated prompt going IN (left pane) and the structured Gemini JSON response coming OUT (right pane) with live latency (\`ms\`) and model badges.

\> 3\. Build the \*\*Dynamic Mutation Diff Proof Viewer (\`Compare Run \#1 vs Run \#2\`)\*\* that highlights every input parameter changed and every output field that dynamically mutated, proving to judges that AI outputs are 100% dynamic and never hardcoded.

\---

\#\#\# Phase 9 — Accessibility, Export Dossier & End-to-End Polish

\*\*Copy-Paste Prompt for Antigravity:\*\*

\> \*\*Antigravity Phase 9:\*\* Wire all 6 views together in \`src/App.tsx\` with \`IndexedDB / localStorage\` persistence (\`src/services/storageService.ts\`), a 1-click \*\*"Export Complete Event Blueprint (Markdown / JSON / Print-Ready PDF View)"\*\* button, full WCAG 2.1 AA semantic landmarks, \`aria-live="polite"\` announcements, and keyboard navigation (\`Alt+1\` through \`Alt+6\` to switch steps, \`Alt+X\` to toggle the Prompt X-Ray Drawer).

\---

\#\#\# Phase 10 — Final Verification, Test Suite Execution & Production README

\*\*Copy-Paste Prompt for Antigravity:\*\*

\> \*\*Antigravity Phase 10:\*\* Run \`npx tsc \--noEmit\`, \`npx vitest run\`, and \`npm run build\`. Fix any warnings or errors until all tests and production build pass with zero warnings. Write a comprehensive production \`README.md\` documenting the problem statement alignment, architecture diagram, mathematical formulas, GenAI Prompt X-Ray design, 6-pillar PromptWars rubric compliance, and local/cloud setup instructions.

\---

# **\#\# 4\. Top-1 Worldwide Power-Up Prompts: GEMINI.md Rules, Zero-Key Live APIs & 3-Tier Google Workspace Command Hub**

\#\#\# Prompt 0 (Run Before Phase 1): Root GEMINI.md & .agent/skills/ Precision Setup  
\*\*Copy-Paste Prompt for Antigravity:\*\*  
\> Create a root GEMINI.md workspace rules file and three local Antigravity skill files (.agent/skills/deterministic-math-verifier/SKILL.md, .agent/skills/google-workspace-bridge/SKILL.md, and .agent/skills/promptwars-rubric-auditor/SKILL.md):  
\> 1\. Enforce @google/genai SDK (gemini-2.5-flash) exclusively on the serverless backend (api/v1/ai-generate.ts) with optional googleSearch grounding (tools: \[{ googleSearch: {} }\]).  
\> 2\. Enforce strict TypeScript (noImplicitAny, noUncheckedIndexedAccess), \<= 45 lines per function, cyclomatic complexity \<= 8, and 4,000ms AbortController timeouts with deterministic offline fallbacks on all external API requests.  
\> 3\. Require npx vitest run and npx tsc \--noEmit verification after every phase.

\---

\#\#\# Prompt 4.5 (Run After Phase 4): Zero-Key Live Intelligence APIs (src/services/freePublicApis.ts)  
\*\*Copy-Paste Prompt for Antigravity:\*\*  
\> Create src/services/freePublicApis.ts and src/shared/cateringCalculator.ts to integrate 10 zero-key, no-signup public APIs and calculators with 3,500ms AbortController timeouts and deterministic local fallbacks:  
\> 1\. Open-Meteo Geocoding API (https\://geocoding-api.open-meteo.com/v1/search?name={city}\&count=3) \+ Open-Meteo Weather Forecast & Historical Climate API (https\://api.open-meteo.com/v1/forecast) to detect rain probability (\>40%) or extreme heat (\>37°C) on the target event date and auto-suggest the "Outdoor Rain / Waterproof Tent & Backup Generator" crisis contingency.  
\> 2\. OpenStreetMap Overpass API (https\://overpass-api.de/api/interpreter) to fetch real banquet halls, hotels, and community centers within 10km of the target city coordinates with clickable Google Maps links.  
\> 3\. Frankfurter Live Central Bank FX API (https\://api.frankfurter.dev/v1/latest?base=INR\&symbols=USD,EUR,GBP) for live multi-currency conversion across INR, USD, EUR, and GBP with timestamp badge.  
\> 4\. Nager.Date Public Holidays API (https\://date.nager.at/api/v3/PublicHolidays/{year}/{countryCode}) \+ Indian Auspicious Muhurat & Festival Surge detector to flag holiday long-weekend surge pricing (+15% venue/travel demand).  
\> 5\. Zero-Waste Catering & Dietary BOM Calculator (src/shared/cateringCalculator.ts): computes exact kg/liters of food, birthday cake weight (guestCount \* 110g), and per-dietary splits (Standard Veg, Jain, Vegan, Gluten-Free, Halal, Kids) plus an NGO Surplus Food Donation handoff link.  
\> 6\. Client-side SVG QR Code generator for Indian Vendor UPI Milestone Tranche Payments (upi://pay?pa=...\&am=...\&cu=INR\&tn=...) and Signed Guest Entry Passes, plus Web Speech API (webkitSpeechRecognition & speechSynthesis) voice intake and audio run-of-show briefing.

\---

\#\#\# Prompt 8.5 (Run After Phase 8): 3-Tier Google Workspace & Google Apps Command Hub (src/services/googleWorkspaceService.ts & src/components/GoogleWorkspaceHubModal.tsx)  
\*\*Copy-Paste Prompt for Antigravity:\*\*  
\> Create src/services/googleWorkspaceService.ts, src/components/GoogleWorkspaceHubModal.tsx, and scripts/google-workspace-bridge.gs to deliver a complete 3-Tier Google Workspace & Google Apps Ecosystem integration:  
\> 1\. Tier 1 (Zero-Auth Instant Action Deep Links — works with 0 setup):  
\>    \- Google Calendar 1-Click Add (https\://calendar.google.com/calendar/render?action=TEMPLATE\&text=...\&dates=...\&details=...\&location=...) on every CPM Milestone and Event-Day Run-of-Show slot, plus RFC-5545 .ics batch download.  
\>    \- Gmail 1-Click Vendor RFP Compose (https\://mail.google.com/mail/?view=cm\&fs=1\&to=...\&su=...\&body=...) pre-filled with the AI-drafted vendor negotiation script and 30/50/20 payment SLA.  
\>    \- Google Maps Venue Search & Turn-by-Turn Directions links (https\://www\.google.com/maps/search/?api=1\&query=... and https\://www\.google.com/maps/dir/?api=1\&destination=...) plus embedded interactive venue map preview.  
\>    \- Google Meet Instant Vendor Walkthrough Launch (https\://meet.google.com/new) and WhatsApp Click-to-Chat (https\://wa.me/?text=...).  
\> 2\. Tier 2 (1-Click Live Google Drive Creation via Google Apps Script doPost Webhook Bridge):  
\>    \- Provide scripts/google-workspace-bridge.gs and a "1-Click Export Live to Google Workspace (Sheets \+ Docs \+ Forms \+ Calendar)" action in GoogleWorkspaceHubModal.tsx that posts the event JSON to VITE\_GAS\_WEBHOOK\_URL (with an instant interactive preview mode when no webhook URL is set) to create:  
\>      a) A 3-Tab Google Sheet (Budget\_Breakdown, Vendor\_30\_50\_20\_Ledger, Guest\_Dietary\_Matrix) with live formulas.  
\>      b) A formatted Google Doc (Master Event Executive Dossier & Vendor SLA Contract).  
\>      c) A live Google Form (Official Guest RSVP & Dietary Preference Form) linked to the Google Sheet.  
\> 3\. Tier 3 (Google Identity Services OAuth 2.0 Client Sync & Gemini Grounding):  
\>    \- Support optional VITE\_GOOGLE\_CLIENT\_ID token sync (https\://www\.googleapis.com/auth/calendar.events and https\://www\.googleapis.com/auth/spreadsheets) and display clickable Gemini Google Search / Maps Grounding source citations in the GenAI Studio.