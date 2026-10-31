# **Product Requirements Document (PRD)**

# **AuraPlan AI (UtsavOS) — Autonomous Multimodal Celebration & Event Planning Operating System**

**Document ID:** 01\_Master\_PRD\_Celebration\_and\_Event\_Planner\_OS  
**Parent Folder:** [Promptwars \- Challenge 5](https://drive.google.com/drive/folders/1_X0KYzGtE3KIC3PJVvHtiW4JfhCmILt5)

**Related Specs:** [Doc 00: Master Index](https://docs.google.com/document/d/1L2rmtJSWnXYNlwOA1Ui0quWtqxg1EbtwByVe0MWZIwk/edit) \| [Doc 02: Budget & Timeline Math Engine](https://docs.google.com/document/d/1TEfOgp85mhXoCTsTk2ThqRVt4RfQ2EUnGWCmLm3yBMk/edit) \| [Doc 03: GenAI & Prompt Engineering Spec](https://docs.google.com/document/d/13Zj1AVND9-dmR7mi665iV0UEKOD6wkWYs-Wqp2d9UrE/edit) \| [Doc 08: Antigravity Build Plan](https://docs.google.com/document/d/18EN03DeeoswOQyP5Q01XSajQhuC3XLISCZUbLsJ1KDM/edit)  
\|---\|---\|

# **1\. Executive Summary & Product Vision**

Organizing a wedding, milestone birthday, or large community event (such as a college festival, hackathon, or cultural gala) involves coordinating dozens of interdependent variables: per-plate catering math, hidden venue taxes, critical-path timelines, vendor payment tranches, dietary restrictions, and creative theme curation. Existing tools fall into two broken extremes:

1. **Static Spreadsheets & Checklist Apps:** Require manual formula entry and offer zero creative or adaptive intelligence when budgets change or vendors delay.  
2. **Generic LLM Wrappers:** Output generic paragraphs of "party ideas" without deterministic budget math, timeline dependency resolution, or verifiable vendor tracking.

**AuraPlan AI (UtsavOS)** bridges this gap by combining a **Deterministic Parametric Budget, Critical-Path Timeline & Vendor Readiness Engine** with **Gemini 2.5 Flash Multimodal Generative AI** and a **Live Prompt X-Ray & Dynamic Diff Inspector**.

# **2\. Deep Coverage of the 3 Core Event Archetypes**

To guarantee 100% alignment with the PromptWars Challenge 5 problem statement (*"organize weddings, birthdays, and community events with budgets, timelines, vendor checklists, and personalized ideas"*), AuraPlan AI ships with three deeply modeled domain engines:

| Archetype | Sub-Types Supported | Specialized Domain Workflows & Built-In Intelligence |
| :---- | :---- | :---- |
| **1\. Weddings & Multi-Day Ceremonies** | • South/North/Regional Indian Weddings (Mehendi, Sangeet, Muhurtham, Reception)• Western Ceremony & Cocktail Reception• Intimate Destination / Micro-Weddings | • **Multi-Function Guest Split:** Different guest counts and per-plate catering tiers per ceremony (e.g., 150 for Sangeet, 600 for Reception).• **Ritual & Trousseau Checklist:** Priest/Officiant, Mandap/Stage floral BOM, Bridal/Groom HMU trials, Photography deliverables (Drone, Candid, Traditional).• **Family & VIP Seating / Accommodation Matrix:** Outstation guest room blocks and airport/station transport logistics. |
| **2\. Birthdays & Milestone Celebrations** | • 1st Birthday / Naming Ceremony• Kids' Theme Party (Superhero, Space, Princess)• Milestone 18th / 21st / 25th / 50th / 75th Gala• Surprise Rooftop / House Party | • **Precision Cake & Catering Calculator:** Computes exact cake weight (`GuestCount * 110g` \+ tier buffer), appetizer pass counts, and kid-vs-adult menu splits.• **Interactive Theme & Game Engine:** Generates age-calibrated party games, emcee scripts, playlist cues, and return-gift/goodie-bag BOM within budget.• **Custom E-Invite & RSVP Copy Generator:** Instant WhatsApp/Email invitation cards with dietary & allergy intake. |
| **3\. Community Events, College Fests & Hackathons** | • College Tech/Cultural Fest & Hackathon• Charity Fundraiser / NGO Gala• Neighborhood Cultural Mela / Festival• Corporate Townhall / Product Launch | • **Sponsorship & Ticket Revenue Offset Ledger:** Tracks sponsor inflows (`Title`, `Gold`, `Silver`, `Stall Rent`) against gross expense budgets.• **Multi-Track Stage & AV Run-of-Show:** Soundcheck slots, chief guest protocol, volunteer shift rosters, Wi-Fi/power load checklists, and fire/police NOC permits.• **Zero-Waste Sustainability & Crowd Safety Calculator:** Drinking water station math, waste bin ratios, and volunteer-to-attendee safety ratios (`1:25`). |

# **3\. Target User Personas & Core User Stories**

## **3.1 User Personas**

1. **Priya & Karthik (Wedding Planners / Couple):** Planning a 2-day, 350-guest wedding in Tamil Nadu/Bangalore on a ₹12,00,000 (\$15,000) budget; need strict vendor tranche tracking, auspicious timeline scheduling, and AI value-engineering when catering quotes exceed budget.  
2. **Sneha (Parent / Milestone Birthday Host):** Planning a 60-guest 1st Birthday or 21st Milestone Party on a ₹45,000 (\$600) budget; wants instant theme moodboards, cake sizing, dietary tracking (Nut-Free, Vegan, Jain), and a 2-hour minute-by-minute party schedule.  
3. **Arikaran (College Fest / Hackathon Lead):** Organizing a 400-participant inter-college hackathon/fest on a ₹1,50,000 (\$2,000) budget; needs stage run-of-show, sponsor tier tracking, certificate/swag procurement deadlines, and live crisis rescheduling if a keynote speaker or caterer is delayed.

## **3.2 Core User Stories & Acceptance Criteria**

| Story ID | Feature Pillar | User Story | Verifiable Acceptance Criteria |
| :---- | :---- | :---- | :---- |
| **US-01** | **Onboarding & Validation** | As an organizer, I want to create an event profile with live input validation so malformed emails, past dates, or negative budgets are caught immediately. | Entering `john@example.com` shows a green valid badge; entering `john@invalid` or budget `-500` or guest count `0` displays immediate inline error messages and blocks submission (`aria-invalid="true"`). |
| **US-02** | **Dynamic Budget Engine** | As an organizer, I want my total budget automatically split across 12 vendor categories with tax & contingency buffers, and warns me if my budget is below the minimum viable per-guest cost. | Adjusting Total Budget or Guest Count recalculates all 12 categories in `<16ms`, reserves configurable `8%` Contingency \+ GST/Tax, and triggers a **Per-Capita Deficit Alert** if budget per guest falls below the archetype floor. |
| **US-03** | **AI Value-Engineering** | As an organizer facing an over-budget warning, I want 1-click AI cost-saving swaps tailored to my event type. | Clicking **"Optimize Budget with AI"** generates 3 concrete, quantified trade-offs (e.g., *"Swap plated dinner for live regional stations: saves 22% (₹68,000)"*) with a 1-click **"Apply Swap to Ledger"** button. |
| **US-04** | **CPM Timeline & Run-of-Show** | As an organizer, I want both a countdown checklist from today until Event Day and a minute-by-minute Event Day Run-of-Show. | System generates milestone tasks (`T-90d`, `T-60d`, `T-30d`, `T-7d`, `T-1d`) adapting automatically if the event is only 5 days away (**Express Sprint Mode**), plus a conflict-free minute-by-minute schedule. |
| **US-05** | **Vendor Checklist & RFPs** | As an organizer, I want to track vendor quotes, payment tranches, and generate ready-to-send negotiation messages. | Displays 12 vendor categories with status (`Shortlisted`, `Booked`, `Advance Paid`, `Completed`), tranche math (`30% Advance / 50% Event Day / 20% Handover`), and 1-click AI WhatsApp/Email RFP generator. |
| **US-06** | **Personalized GenAI Ideas** | As an organizer, I want custom themes, decor BOMs, menus, and entertainment ideas that dynamically adapt to my exact inputs. | Changing Theme, Guest Count, or Dietary Needs triggers Gemini 2.5 Flash to return structured JSON ideas and updates the **Dynamic Diff Inspector** showing exact before-vs-after changes. |
| **US-07** | **Live Prompt X-Ray** | As a judge watching the demo video, I want to see the exact prompt going into Gemini and the structured response coming out. | Opening the **GenAI X-Ray Drawer** displays the exact interpolated prompt, system instructions, JSON schema, latency (`ms`), token count, and dynamic diff comparison. |
| **US-08** | **Crisis & Weather Simulator** | As an organizer, I want to simulate last-minute emergencies (rain, vendor delay, \+50 surprise guests) and get an instant recovery plan. | Triggering a crisis scenario dynamically shifts the Run-of-Show timeline, taps the Contingency Reserve, and generates a 5-step AI emergency action protocol. |

# **4\. Quantitative Success Metrics & SLAs**

| Metric Category | Target Benchmark | Verification Method |
| :---- | :---- | :---- |
| **Deterministic Budget / Timeline Recalculation** | `< 16 ms` (60 FPS) | Pure TypeScript isomorphic calculation on slider change. |
| **Gemini 2.5 Flash Structured Generation Latency** | `< 2.2 seconds (p95)` | Streamed / structured JSON schema response via `/api/v1/ai-generate`. |
| **Automated Test Coverage** | `>= 90%` Core Engine Coverage | Vitest unit/integration suite covering budget math, CPM timeline, validation, and AI schema parsing. |
| **Lighthouse Performance, Accessibility & Best Practices** | `>= 98 / 100` | Verified via semantic HTML5, WCAG 2.1 AA contrast tokens, and `<120KB` gzipped initial bundle. |

