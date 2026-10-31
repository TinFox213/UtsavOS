# **Deterministic Budget Allocation, Critical-Path Timeline & Vendor Readiness Math Engine Specification**

**Document ID:** 02\_Deterministic\_Budget\_Timeline\_and\_Vendor\_Math\_Engine\_Spec  
**Parent Folder:** [Promptwars \- Challenge 5](https://drive.google.com/drive/folders/1_X0KYzGtE3KIC3PJVvHtiW4JfhCmILt5)  
**Target Code Modules:** `src/shared/budgetEngine.ts`, `src/shared/timelineEngine.ts`, `src/shared/vendorEngine.ts`

# **1\. Architectural Philosophy: Why Deterministic Math \+ GenAI Beats Pure LLM Guesswork**

LLMs alone frequently hallucinate arithmetic (e.g., outputting category budgets that sum to 118% of the total budget, forgetting GST/service taxes, or scheduling soundcheck after the keynote starts). AuraPlan AI (UtsavOS) separates concerns into two tightly coupled layers:

1. **Isomorphic Deterministic Math Engine (`src/shared/*`):** Runs in `<5ms` on both client and serverless backend to guarantee 100% mathematical precision for budget splits, tax/contingency shields, per-capita feasibility checks, critical-path scheduling, and vendor tranche reconciliation.  
2. **Gemini 2.5 Flash Reasoning & Personalization Engine:** Receives the exact mathematical constraints and generates creative themes, dietary menus, vendor negotiation scripts, and value-engineering recommendations that strictly obey the deterministic numbers.

# **2\. The 12-Category Parametric Budget Allocation Engine (`src/shared/budgetEngine.ts`)**

## **2.1 Tax, Contingency & Allocatable Net Pool Formula**

Given user inputs:

* `TotalBudget` (\$B\_{\\text{total}} \> 0\$)  
* `GuestCount` (\$N \\ge 1\$)  
* `ContingencyRate` (\$r\_{\\text{cont}} \\in \[0.05, 0.15\]\$, default `0.08` \= 8%)  
* `TaxAndServiceRate` (\$r\_{\\text{tax}} \\in \[0.00, 0.18\]\$, default `0.10` blended GST/Service Tax)

The engine first isolates the Protected Reserve so the user never overspends:

* \$\\text{ContingencyReserve} \= \\text{round}(B\_{\\text{total}} \\times r\_{\\text{cont}})\$  
* \$\\text{EstimatedTaxReserve} \= \\text{round}\\left((B\_{\\text{total}} \- \\text{ContingencyReserve}) \\times \\frac{r\_{\\text{tax}}}{1 \+ r\_{\\text{tax}}}\\right)\$  
* \$\\text{NetAllocatableBudget } (B\_{\\text{net}}) \= B\_{\\text{total}} \- \\text{ContingencyReserve} \- \\text{EstimatedTaxReserve}\$

## **2.2 Archetype Weight Matrix Across 12 Canonical Expense Categories**

Each of the 3 core event archetypes defines normalized base allocation weights (\$W\_{a,c}\$ where \$\\sum\_{c=1}^{12} W\_{a,c} \= 1.00\$):

| \# | Category Key | Category Display Name | Wedding Weight (\$W\_{\\text{wed}}\$) | Birthday Weight (\$W\_{\\text{bday}}\$) | Community / Fest Weight (\$W\_{\\text{comm}}\$) | Scaling Mode |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| 1 | `VENUE_RENTAL` | Venue, Mandapam & Permits | 0.20 (20%) | 0.18 (18%) | 0.16 (16%) | Step-Function by Capacity (\$N\$) |
| 2 | `CATERING_FNB` | Catering, Beverages & Cake | 0.30 (30%) | 0.34 (34%) | 0.26 (26%) | Linear Per-Capita (\$N \\times \\text{Cost}\_{\\text{plate}}\$) |
| 3 | `DECOR_FLORAL` | Decor, Floral, Stage & Thematic Design | 0.14 (14%) | 0.15 (15%) | 0.12 (12%) | Hybrid Fixed \+ Venue Scale |
| 4 | `PHOTO_VIDEO` | Photography, Cinematography & Drone | 0.10 (10%) | 0.08 (8%) | 0.06 (6%) | Tier-Based Fixed |
| 5 | `AV_LIGHT_SOUND` | Audio-Visual, LED Wall, Lighting & DJ | 0.05 (5%) | 0.07 (7%) | 0.18 (18%) | High Priority in Community/Fests |
| 6 | `ATTIRE_HMU_VIP` | Bridal/Host Attire, Makeup & VIP Hospitality | 0.07 (7%) | 0.04 (4%) | 0.05 (5%) | Archetype-Specific (Chief Guest / Bridal) |
| 7 | `ENTERTAINMENT` | Live Artists, Emcee, Games & Activities | 0.04 (4%) | 0.06 (6%) | 0.06 (6%) | Duration & Crowd Scaled |
| 8 | `INVITES_SIGNAGE` | Digital/Print Invites, Badges, Flex & Signage | 0.02 (2%) | 0.02 (2%) | 0.04 (4%) | Linear Per-Attendee / Stall |
| 9 | `GIFTS_SWAG` | Return Gifts, Trousseau, Trophies & Swag Kits | 0.03 (3%) | 0.04 (4%) | 0.04 (4%) | Linear Per-Guest (\$N\$) |
| 10 | `TRANSPORT_STAY` | Guest Transport, Valet & Accommodation | 0.03 (3%) | 0.01 (1%) | 0.01 (1%) | Outstation Guest Ratio |
| 11 | `SECURITY_CLEAN` | Crowd Security, Housekeeping & Medical First-Aid | 0.01 (1%) | 0.005 (0.5%) | 0.015 (1.5%) | Mandatory Safety Ratio (\$1:25\$ in Fests) |
| 12 | `LOGISTICS_MISC` | Rituals / Stationery / Eco-Waste Disposal | 0.01 (1%) | 0.005 (0.5%) | 0.005 (0.5%) | Base Operational Buffer |

## **2.3 Guest-Elasticity & Per-Capita Feasibility Validator (Edge-Case Catcher)**

When a user enters a very high guest count (\$N\$) with a low total budget (\$B\_{\\text{total}}\$)—a mandatory edge case for **Video Section 2 (Live Testing)**—the engine calculates:

1. **Actual Per-Capita All-In Budget:** \$P\_{\\text{actual}} \= \\frac{B\_{\\text{total}}}{N}\$  
2. **Minimum Viable Per-Capita Floor (\$P\_{\\text{min}}\$)** by Archetype, Currency, and Tier (`Economy`, `Standard`, `Premium`, `Luxury`):  
   * *Wedding (INR / USD):* Economy: `₹650 / $28` per guest \| Standard: `₹1,400 / $65` \| Premium: `₹2,800 / $140` \| Luxury: `₹6,000 / $300`  
   * *Birthday (INR / USD):* Economy: `₹350 / $15` per guest \| Standard: `₹750 / $32` \| Premium: `₹1,500 / $65` \| Luxury: `₹3,000 / $130`  
   * *Community / College Fest (INR / USD):* Economy: `₹180 / $8` per attendee \| Standard: `₹400 / $18` \| Premium: `₹850 / $38` \| Luxury: `₹1,800 / $80`  
3. **Feasibility Score & Status Band:**  
   * \$\\text{FeasibilityRatio } (R\_f) \= \\frac{P\_{\\text{actual}}}{P\_{\\text{min}}}\$  
   * If \$R\_f \\ge 1.15\$: `OPTIMAL` (Emerald Badge — "Healthy Per-Capita Margin")  
   * If \$0.90 \\le R\_f \< 1.15\$: `TIGHT_VIABLE` (Amber Badge — "Tight Margin: Strict Vendor Caps Enabled")  
   * If \$R\_f \< 0.90\$: `CRITICAL_DEFICIT` (Rose Alert Banner — "Per-Capita Deficit: Budget is \$(1 \- R\_f)\\times 100%\$ below minimum viable cost for \$N\$ guests. Minimum recommended budget: \$N \\times P\_{\\text{min}}\$ OR max viable guests: \$\\lfloor B\_{\\text{total}} / P\_{\\text{min}} \\rfloor\$").

## **2.4 Proportional Lock-and-Rebalance Slider Math**

Users can lock any category (e.g., locking `VENUE_RENTAL` at a fixed quote) and drag any other category slider. Remaining unlocked categories rebalance proportionally in \$\<16\\text{ms}\$:

\$\$B\_{i}^{\\text{new}} \= B\_{i}^{\\text{old}} \+ \\Delta B \\times \\frac{W\_i}{\\sum\_{j \\in \\text{Unlocked}} W\_j}\$\$

# **3\. Critical Path Method (CPM) Timeline & Run-of-Show Engine (`src/shared/timelineEngine.ts`)**

## **3.1 Adaptive Countdown Compression Formula**

Given `EventDate` (\$T\_{\\text{event}}\$) and `CurrentDate` (\$T\_{\\text{now}}\$):

* \$\\text{LeadDays } (D) \= \\max(0, \\lceil (T\_{\\text{event}} \- T\_{\\text{now}}) / \\text{86,400,000} \\rceil)\$  
* **Standard Planning Mode (\$D \\ge 30\$):** Maps 6 Planning Phases across proportional lead-time anchors (`100% -> 75% -> 50% -> 25% -> 7d -> 1d`).  
* **Express Sprint Mode (\$1 \\le D \< 30\$):** Automatically compresses all critical-path booking tasks into a 48-hour/7-day sprint, highlighting `IMMEDIATE_ACTION` tasks in amber.  
* **Invalid Past Date Guard (\$D \< 0\$):** Rejects past dates during live form testing with explicit error: `"Event date cannot be in the past. Please select today or a future date."`

## **3.2 Minute-by-Minute Event Day Run-of-Show & Live Crisis Ripple Calculator**

Each event archetype generates a sequential **Event Day Run-of-Show** graph of nodes \$E\_k \= (\\text{id}, \\text{startMin}, \\text{durationMin}, \\text{bufferMin}, \\text{dependsOn}\[\], \\text{category}, \\text{owner})\$.

* **Live Delay / Crisis Injection (`applyTimelineDelay(nodeId, delayMinutes, weatherAlert)`):**  
  * Absorbs up to `bufferMin` in non-critical slack slots, then propagates net remaining delay (\$\\text{netShift} \= \\max(0, \\text{delayMinutes} \- \\text{bufferMin})\$) down all dependent nodes in topological order.  
  * Flags any node that pushes past the Venue Curfew (`22:00` for outdoor audio / `23:30` hall close) with a `CURFEW_CONFLICT` warning.

# **4\. 120-Point Vendor Checklist & Payment Tranche Engine (`src/shared/vendorEngine.ts`)**

Every vendor item tracks:

* **Checklist Readiness Score (0–100%):** Weighted completion across `Discovery (15%)` \-\> `Quote Comparison (20%)` \-\> `Contract & SLA Signed (25%)` \-\> `Advance Paid (20%)` \-\> `Event-Day Confirmation (20%)`.  
* **Standardized 3-Tranche Payment Guardrail:**  
  * `Tranche 1 (Booking Advance):` 25%–35% upon contract signing.  
  * `Tranche 2 (Pre-Event / Arrival):` 45%–55% upon material delivery / setup on event day.  
  * `Tranche 3 (Post-Event Quality Holdback):` 15%–20% released after final deliverables (e.g., raw photos/videos delivered, zero venue damage clearance).  
  * **Over-Advance Risk Warning:** If a user enters an upfront vendor advance \$\> 50%\$, the engine triggers a `HIGH_ADVANCE_RISK` security warning recommending a holdback clause.

