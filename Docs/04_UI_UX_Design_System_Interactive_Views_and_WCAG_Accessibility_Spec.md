# **UI/UX Design System, Screen-by-Screen Interactive Flows & WCAG 2.1 AA Accessibility Specification**

**Document ID:** 04\_UI\_UX\_Design\_System\_Interactive\_Views\_and\_WCAG\_Accessibility\_Spec  
**Parent Folder:** [Promptwars \- Challenge 5](https://drive.google.com/drive/folders/1_X0KYzGtE3KIC3PJVvHtiW4JfhCmILt5)  
**Frontend Stack:** React 19, TypeScript, Tailwind CSS v4, Lucide React, Recharts / Custom SVG Rings, Framer Motion (`motion/react`)

---

# **1\. Visual Identity & Semantic Design Tokens**

AuraPlan AI (UtsavOS) blends the celebratory warmth of a premier event studio with the crisp financial and operational precision of an enterprise command center.

## **1.1 Color Palette & WCAG 2.1 AA Verified Contrast Matrix**

| Semantic Token | Tailwind Class / Hex | Usage & Meaning | Contrast Ratio on White (\#FFFFFF) |
| :---- | :---- | :---- | :---- |
| **Brand Primary (Royal Indigo)** | `indigo-600` (`#4F46E5`) / `indigo-700` (`#4338CA`) | Primary CTA buttons, active step indicators, navigation highlights | `6.8:1` (AAA) |
| **Celebration Accent (Festive Rose)** | `rose-600` (`#E11D48`) / `rose-50` (`#FFF1F2`) | Wedding/Birthday highlights, AI Copilot badges, milestone markers | `5.2:1` (AA) |
| **Budget Optimal (Emerald)** | `emerald-700` (`#047857`) / `emerald-50` (`#ECFDF5`) | Healthy per-capita budget margin, verified valid inputs, completed tasks | `5.6:1` (AA) |
| **Warning / Tight Margin (Amber)** | `amber-800` (`#92400E`) / `amber-50` (`#FFFBEB`) | Tight budget margin, Express Sprint timeline tasks, high advance warning | `6.4:1` (AA) |
| **Critical Deficit / Error (Crimson)** | `red-700` (`#B91C1C`) / `red-50` (`#FEF2F2`) | Invalid form inputs, Per-Capita Deficit alerts, curfew conflicts | `6.5:1` (AA) |
| **GenAI Telemetry Surface** | `slate-900` (`#0F172A`) with `emerald-400` (`#34D399`) text | Live Prompt X-Ray terminal & Dynamic Diff Inspector drawer | `11.2:1` (AAA) |

## **1.2 Typography & Anti-Jitter Numeric Rules**

* **UI Font:** `Inter, system-ui, -apple-system, sans-serif`  
* **Financial & Timeline Monospace Font:** `JetBrains Mono, monospace` with `tabular-nums` strictly enforced on all currency figures, percentages, countdown timers, and live validation counters so UI layouts never shift (`CLS = 0.00`) during live slider adjustments.  
* **Readable Input Sizing for Video Recording:** All form inputs (`email`, `eventName`, `totalBudget`, `guestCount`, `eventDate`, `customPrompt`) use `text-base (16px) font-medium px-4 py-3 rounded-xl border-2` with high-visibility focus rings (`focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-600`) and an inline **"Validation Status Pill"** right above each field so judges watching the 4-minute video can read every typed character effortlessly.

---

# **2\. Logical Step-by-Step User Journey (Engineered for Video Section 1 & Section 4\)**

To make the video walkthrough effortless to follow even without voiceover, the top navigation bar presents a numbered **6-Step Guided Workflow Stepper**:

## **Step 1: Login & Smart Event Onboarding (`OnboardingWizardView.tsx`)**

* **Organizer Sign-In & Profile Validation Card:**  
  * Fields: `Organizer Full Name`, `Organizer Email` (with live RFC-5322 \+ domain TLD validator showing green badge `"✓ Valid Email: john@example.com"` or red error badge `"✗ Invalid Email Format"`), `Organization / Family Name`, and `Phone / WhatsApp`.  
* **Event Archetype & Core Parameters Selector:**  
  * Interactive cards for **1\. Wedding & Ceremonies**, **2\. Birthday Celebration**, **3\. Community Event / College Fest**.  
  * Sub-type selector (e.g., *South Indian Multi-Day Wedding*, *Milestone 21st Birthday*, *Inter-College Hackathon & Cultural Fest*).  
  * Live-validated inputs for `Event Title`, `Event Date` (blocks past dates with clear error message; triggers *Express Sprint Mode* if `<14` days away), `City / Venue Type`, `Currency` (`INR ₹` / `USD $` / `EUR €` / `GBP £`), `Guest Count (N)`, and `Total Budget`.

## **Step 2: Command Center & Feasibility Dashboard (`DashboardView.tsx`)**

* **4 Hero KPI Cards:**  
  1. **Total Budget & Per-Guest Allowance:** Displays Total, Net Allocatable (`82%`), Tax Reserve (`10%`), Contingency (`8%`), and the live **Per-Capita Feasibility Status Badge** (`OPTIMAL` / `TIGHT_VIABLE` / `CRITICAL_DEFICIT`).  
  2. **Countdown & Critical Path Readiness:** Days remaining, completed vs pending critical tasks, and next immediate deadline.  
  3. **Vendor Readiness & Tranche Tracker:** Booked vendors (`X / 12`), total contracted amount vs budget cap, and safe holdback percentage.  
  4. **Dietary & Guest Matrix:** Breakdown of Vegetarian, Vegan, Jain, Halal, Gluten-Free, and VIP/Outstation guests.

## **Step 3: Interactive Budget Studio & AI Value-Engineering (`BudgetStudioView.tsx`)**

* **12-Category Interactive Sliders with Lock Toggle:**  
  * Lock any category (e.g., Venue locked at ₹1,50,000) and drag any other slider to watch the remaining 11 categories rebalance in `<16ms` at 60 FPS.  
  * **Per-Capita Deficit Stress Test Banner:** When a user enters an impossible budget (e.g., 500 guests on ₹15,000), displays a prominent red diagnostic banner with exact mathematical shortfall and a 1-click **"Run Gemini Value-Engineering Rescue"** button.

## **Step 4: Critical Path Timeline & Minute-by-Minute Run-of-Show (`TimelineView.tsx`)**

* **Tab A — Countdown Roadmap (`T-180d` to `T-1d`):** Filterable by category and priority (`CRITICAL`, `HIGH`, `NORMAL`).  
* **Tab B — Event Day Minute-by-Minute Run-of-Show:** Chronological schedule (`07:00 AM` to `11:00 PM`) with duration, buffer minutes, assigned owner, and **Live Delay / Crisis Simulator** (e.g., click *"+45 Min Caterer Delay"* or *"Outdoor Rain Alert"* to watch dependent slots ripple-shift in real time).

## **Step 5: 12-Category Vendor Checklist & Smart RFP Studio (`VendorChecklistView.tsx`)**

* Expandable cards for all 12 vendor categories with 120+ domain-specific checklist items.  
* **Quote vs Budget Comparator:** Enter actual vendor quotes, track 3 payment tranches (`30% Advance`, `50% Event Day`, `20% Holdback`), and click **"Generate AI Negotiation & WhatsApp RFP"** to produce ready-to-send vendor messages.

## **Step 6: GenAI Personalization Studio & Live Prompt X-Ray (`GenAIStudioView.tsx` \+ `PromptXRayDrawer.tsx`)**

* **Dedicated AI Showcase Screen for Video Section 3:**  
  * Choose any of the **5 Specialized Gemini Copilots** (*Theme & Decor Architect*, *Dietary Menu Planner*, *Budget Optimizer*, *Vendor Negotiator*, *Crisis Simulator*).  
  * **Split-Screen Live Prompt X-Ray:** Left panel shows the exact live prompt going IN; right panel shows the structured Gemini response coming OUT.  
  * **Dynamic Mutation Proof Panel (`Run #1 vs Run #2`):** Side-by-side comparison proving how changing event inputs dynamically changes the AI response.

---

# **3\. WCAG 2.1 AA Accessibility Specification (Scoring 100/100 on Accessibility Rubric)**

1. **Semantic HTML5 Landmarks:** `<header>`, `<nav aria-label="Event Planning Workflow">`, `<main id="main-content">`, `<aside aria-label="Live AI Prompt Inspector">`, `<footer>` with a visible-on-focus `"Skip to main content"` link.  
2. **Form Accessibility:** Every `<input>`, `<select>`, and `<textarea>` has an explicit `<label htmlFor="...">`, `aria-describedby` pointing to its helper/validation message, and `aria-invalid="true"` \+ `role="alert"` on validation errors.  
3. **Screen Reader Live Announcements:** An `aria-live="polite"` status announcer narrates budget rebalancing, validation outcomes, and Gemini streaming completion.  
4. **Keyboard-First Navigation:** All interactive sliders, tabs, modals, and the Prompt X-Ray drawer support full keyboard operation (`Tab`, `Shift+Tab`, `ArrowLeft/Right`, `Enter`, `Escape`).

