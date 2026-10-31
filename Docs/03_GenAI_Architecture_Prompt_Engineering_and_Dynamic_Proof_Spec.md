# **GenAI Architecture, Gemini 2.5 Flash Prompt Engineering & Dynamic Proof Specification**

| Metadata Field | Specification Details |
| :---- | :---- |
| **Document ID** | `03_GenAI_Architecture_Prompt_Engineering_and_Dynamic_Proof_Spec` |
| **Parent Folder** | [Promptwars \- Challenge 5](https://drive.google.com/drive/folders/1_X0KYzGtE3KIC3PJVvHtiW4JfhCmILt5) |
| **Target Code Modules** | `api/v1/ai-generate.ts`, `src/services/geminiService.ts`, `src/components/PromptXRayDrawer.tsx`, `src/components/GenAIStudioView.tsx` |

---

# **1\. Engineered Specifically for Video Submission Criterion \#3 ("Highlight GenAI Integration")**

The PromptWars Video Submission Guide mandates four explicit proofs for GenAI usage:

1. **Point it out clearly:** Every AI-powered action features a glowing `"Powered by Gemini 2.5 Flash — Live GenAI"` badge and auto-opens the **Live Prompt X-Ray & Telemetry Panel**.  
2. **Show it working (Prompt In \-\> Response Out):** The UI renders a split-view **Prompt & Response Inspector** showing:  
   * **Left Pane ("Prompt Going In"):** The exact interpolated system instructions, deterministic budget/guest/dietary parameters, and user prompt sent to Gemini.  
   * **Right Pane ("Structured Response Coming Out"):** Real-time streaming output \+ formatted JSON cards with execution time (e.g., `1,140 ms`), model identifier (`gemini-2.5-flash`), and token usage.  
3. **Explain its purpose:** Each AI copilot card includes a 1-line **"Why GenAI Is Used Here"** header explaining the exact planning bottleneck solved.  
4. **Prove it's dynamic (Not Hardcoded):** The **Dynamic Mutation Diff Engine (`Compare Run #1 vs Run #2`)** stores the previous AI generation in state and highlights in green/amber every single field (theme palette, menu items, per-plate cost, decor BOM, vendor clauses) that dynamically mutated when the user changed inputs on screen.

---

# **2\. The 5 Specialized Gemini 2.5 Flash Copilots**

## **Copilot 1: Personalized Theme, Decor BOM & Moodboard Architect (`mode: "THEME_AND_IDEAS"`)**

* **Problem Solved:** Translates abstract user vibes (e.g., *"Eco-Friendly Royal Chettinad Wedding"*, *"Neon Cyberpunk 21st Birthday"*, or *"Zero-Waste Campus Tech Hackathon"*) into concrete, budget-bounded execution plans.  
* **Inputs Injected into Prompt:** `eventType`, `subType`, `guestCount`, `currency`, `decorBudgetAllowance`, `venueSetting` (`Indoor`, `Outdoor Lawn`, `Rooftop`, `Campus Auditorium`), `culturalTraditions`, `customUserPrompt`.  
* **Structured JSON Output Schema:**  
  * `themeTitle` & `tagline`  
  * `colorPalette[]` (5 hex codes \+ material/fabric pairings)  
  * `signatureZones[]` (Entrance Arch, Main Stage/Mandap, Photo Booth, Dining Table Centerpiece — each with estimated cost fitting within `decorBudgetAllowance`)  
  * `personalizedIdeas[]` (5 bespoke interactive guest experiences tailored to the exact prompt)  
  * `lightingAndAudioCue` (exact lighting temperature and music vibe)  
  * `sustainabilityUpcyclePlan` (how floral/stage materials are reused or donated post-event)

## **Copilot 2: Multi-Dietary Menu & Quantity Calculator (`mode: "MENU_AND_CATERING"`)**

* **Problem Solved:** Prevents food shortages and dietary exclusions while staying strictly under the deterministic `cateringPerPlateCap`.  
* **Inputs Injected:** `guestCount`, `cateringTotalBudget`, `perPlateCap`, `dietarySplit` (`vegetarianPct`, `veganPct`, `jainPct`, `halalPct`, `glutenFreeCount`, `nutAllergyCount`), `cuisinePreference`, `mealTime` (`Breakfast`, `Lunch`, `High-Tea`, `Dinner`).  
* **Structured JSON Output Schema:**  
  * `curatedMenuCourses[]` (Welcome Drink, Starters, Main Course, Breads/Rice, Desserts) with explicit dietary badges (`[VEG]`, `[JAIN-SAFE]`, `[VEGAN]`, `[GF]`, `[NUT-FREE]`)  
  * `quantityEstimationMatrix[]` (exact kg/liters/pieces required for `guestCount` \+ 10% buffer)  
  * `estimatedPerPlateCost` (verified \$\\le\$ `perPlateCap`)  
  * `foodRescuePartnerPlan` (zero-waste surplus redistribution workflow)

## **Copilot 3: Smart Budget Value-Engineering & Rebalancer (`mode: "BUDGET_OPTIMIZER"`)**

* **Problem Solved:** When a user's budget triggers a `CRITICAL_DEFICIT` or `TIGHT_VIABLE` warning, GenAI analyzes the 12 category allocations and proposes 3 surgical cost-reduction swaps without ruining the guest experience.  
* **Structured JSON Output Schema:**  
  * `diagnosisSummary`  
  * `valueEngineeringSwaps[]` (Category, Original Approach, AI Recommended Swap, Exact Savings Amount, Quality Impact Rating `Minimal | Low`, and 1-click `deltaAdjustment` payload to apply directly to the budget ledger).

## **Copilot 4: Vendor RFP, Negotiation & Contract Red-Flag Auditor (`mode: "VENDOR_NEGOTIATOR"`)**

* **Problem Solved:** Users lose money to vague vendor quotes, hidden generator/corkage fees, and 80% upfront payment demands.  
* **Structured JSON Output Schema:**  
  * `whatsappRfpMessage` (Ready-to-copy message with exact event date, guest count, target budget cap, and required deliverables)  
  * `emailProposalTemplate`  
  * `negotiationLeveragePoints[]` (3 tactical scripts to negotiate 10%–18% off quotes)  
  * `contractRedFlagsToVerify[]` (Cancellation refund clause, overtime hourly cap, backup equipment SLA, 20% post-event holdback)

## **Copilot 5: Live Crisis & Weather "What-If" Rescue Simulator (`mode: "CRISIS_SIMULATOR"`)**

* **Problem Solved:** Real-time emergency response when rain hits an outdoor venue, a vendor cancels, or 60 unannounced guests arrive.  
* **Structured JSON Output Schema:**  
  * `crisisSeverity` (`MODERATE | HIGH | CRITICAL`)  
  * `immediateNext15MinActions[]` (Owner, Action, Time Window)  
  * `timelineShiftRecommendations[]` (exact adjustments to the Run-of-Show)  
  * `contingencyBudgetDrawdown` (exact amount drawn from the 8% Contingency Reserve)  
  * `guestCommunicationBroadcast` (calm, polite announcement / WhatsApp message to guests)

---

# **3\. Exact System Prompt & Structured Schema Enforcement (`src/services/geminiService.ts`)**

Every call to `@google/genai` (`gemini-2.5-flash`) uses `responseMimeType: "application/json"` and `responseSchema` coupled with a post-generation **Zod Schema Validator**:export function buildEventCopilotPrompt(input: EventAIRequest): string {

  return \[

    "You are AuraPlan AI (UtsavOS), a world-class Celebration & Event Engineering Copilot.",

    "STRICT CONSTRAINTS:",

    \`1. Event Archetype: \${input.eventType} (\${input.subType}) \| Title: "\${input.eventName}"\`,

    \`2. Guest Count: \${input.guestCount} guests \| Location/City: \${input.location}\`,

    \`3. Total Budget: \${input.currency} \${input.totalBudget.toLocaleString()} (Net Allocatable: \${input.currency} \${input.netAllocatableBudget.toLocaleString()}, Per-Guest Cap: \${input.currency} \${input.perCapitaBudget})\`,

    \`4. Category Caps \-\> Catering: \${input.currency} \${input.cateringCap}, Decor: \${input.currency} \${input.decorCap}, Venue: \${input.currency} \${input.venueCap}\`,

    \`5. Dietary & Cultural Requirements: \${JSON.stringify(input.dietaryAndCultural)}\`,

    \`6. User Specific Request / Scenario: "\${input.userPrompt}"\`,

    "Every single recommendation, menu quantity, and cost figure MUST scale mathematically to the exact Guest Count and stay strictly within the Category Caps above.",

    "Return valid JSON matching the requested schema."

  \].join("\\n");

}

---

# **4\. Dynamic Mutation Diff Engine (`src/shared/dynamicDiffEngine.ts`)**

To give judges an unmistakable visual proof that AI responses are **dynamic and not hardcoded**:

1. Whenever a user runs any AI generation (`Run #1`), the app stores:{ "runId": "run\_01", "timestamp": "10:14:02", "inputSnapshot": { ... }, "promptSent": "...", "outputReceived": { ... } }  
2. When the user changes any input (e.g., changing Guest Count from `150` to `400`, or changing the prompt from `"Traditional South Indian Temple Wedding"` to `"Minimalist Sunset Beach Reception"`) and clicks **Regenerate (`Run #2`)**:  
3. The UI automatically displays a **"Dynamic AI Proof Badge: 100% Dynamic Response Verified"** and a side-by-side comparison table showing:  
   * **Input Delta:** `150 guests -> 400 guests`, `Prompt: Temple Wedding -> Sunset Beach Reception`  
   * **Prompt Delta:** Highlighted yellow tokens in the outgoing prompt.  
   * **Output Delta:** Highlighted green cards showing how menu quantities (`18 kg -> 48 kg`), per-plate allocations, color hexes, and decor items changed in real time.

