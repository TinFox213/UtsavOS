# Master 15-Phase Execution Roadmap & Registry — AuraPlan AI (UtsavOS)

**Project:** PromptWars Virtual — Challenge 5: Celebration & Event Planner  
**Product Name:** **AuraPlan AI (UtsavOS)** — Autonomous Multimodal Celebration & Event Planning Operating System  
**Parent Specification Suite:** [Docs Directory](file:///e:/Promptwars%20-%20Challenge%205/Docs)

---

## Executive Summary

This directory contains **15 sequential, self-contained, copy-pasteable implementation plans** engineered for **Google Antigravity**. Every phase is mapped directly to the PromptWars 6-Pillar Evaluation Rubric (**Code Quality**, **Security**, **Efficiency**, **Testing**, **Accessibility**, **Problem Alignment**) and covers all 24 architectural modules specified across Docs 00–10.

---

## Master 15-Phase Document Registry & Completion Status

| Phase | Document Link | Core Target Deliverables | Verification Gate | Status |
| :---: | :--- | :--- | :--- | :---: |
| **01** | [Phase 01: Workspace Rules & Skills](file:///e:/Promptwars%20-%20Challenge%205/Docs/Implementation_Plans/Phase_01_Workspace_Rules_Antigravity_Skills_Tooling.md) | `GEMINI.md`, `.agent/skills/*`, `.env.example`, `mcp-config.json` | Skill & rule syntax checks | ✓ Complete |
| **02** | [Phase 02: Scaffolding & Dependencies](file:///e:/Promptwars%20-%20Challenge%205/Docs/Implementation_Plans/Phase_02_Project_Scaffolding_TypeScript_Tailwind_Dependencies.md) | `package.json`, `tsconfig.json`, `vite.config.ts`, `vercel.json` | `npm install && npm run build` | ✓ Complete |
| **03** | [Phase 03: Domain Models & Seeds](file:///e:/Promptwars%20-%20Challenge%205/Docs/Implementation_Plans/Phase_03_Domain_Data_Models_Type_System_Archetype_Seeds.md) | `src/types/event.ts`, `src/data/archetypeSeeds.ts` | `npx tsc --noEmit` | ✓ Complete |
| **04** | [Phase 04: Security & Zod Validation](file:///e:/Promptwars%20-%20Challenge%205/Docs/Implementation_Plans/Phase_04_Security_Guardrails_OWASP_Sanitizer_Zod_Validation.md) | `src/shared/securityGuardrails.ts`, `src/schemas/validationSchemas.ts` | `npx vitest run tests/validationAndSecurity.test.ts` | ✓ Complete |
| **05** | [Phase 05: Parametric Budget Engine](file:///e:/Promptwars%20-%20Challenge%205/Docs/Implementation_Plans/Phase_05_Parametric_Budget_Engine_Tax_Contingency_Feasibility.md) | `src/shared/budgetEngine.ts`, 12-category math, 8% contingency & 10% tax | `npx vitest run tests/budgetEngine.test.ts` | ✓ Complete |
| **06** | [Phase 06: CPM Timeline & Run-of-Show](file:///e:/Promptwars%20-%20Challenge%205/Docs/Implementation_Plans/Phase_06_CPM_Timeline_Engine_RunOfShow_Delay_Ripple.md) | `src/shared/timelineEngine.ts`, CPM backward pass, delay ripple | `npx vitest run tests/timelineEngine.test.ts` | ✓ Complete |
| **07** | [Phase 07: Vendor Readiness & Dynamic Diff](file:///e:/Promptwars%20-%20Challenge%205/Docs/Implementation_Plans/Phase_07_Vendor_Readiness_Engine_Tranches_Dynamic_Diff.md) | `src/shared/vendorEngine.ts`, 30/50/20 tranches, `src/shared/dynamicDiffEngine.ts` | `npx vitest run tests/vendorAndDiffEngine.test.ts` | ✓ Complete |
| **08** | [Phase 08: Zero-Waste Catering BOM](file:///e:/Promptwars%20-%20Challenge%205/Docs/Implementation_Plans/Phase_08_ZeroWaste_Catering_BOM_Dietary_Calculator.md) | `src/shared/cateringCalculator.ts`, cake weight, Jain/Vegan splits, NGO rescue | `npx vitest run tests/cateringCalculator.test.ts` | ✓ Complete |
| **09** | [Phase 09: Zero-Key Public APIs & Utilities](file:///e:/Promptwars%20-%20Challenge%205/Docs/Implementation_Plans/Phase_09_ZeroKey_Public_APIs_UPI_QR_WebSpeech_ICS.md) | Open-Meteo, Overpass OSM, Frankfurter FX, Nager.Date, UPI QR, Web Speech | `npx vitest run tests/freePublicApis.test.ts` | ✓ Complete |
| **10** | [Phase 10: Serverless Gemini Proxy & 5 Copilots](file:///e:/Promptwars%20-%20Challenge%205/Docs/Implementation_Plans/Phase_10_Serverless_Gemini_Proxy_5_Copilots_Offline_Fallback.md) | `api/v1/ai-generate.ts`, 5 copilots, dynamic synthesis fallback | `npx vitest run tests/geminiService.test.ts` | ✓ Complete |
| **11** | [Phase 11: Stepper, WCAG Tokens & QA Bar](file:///e:/Promptwars%20-%20Challenge%205/Docs/Implementation_Plans/Phase_11_Navigation_Stepper_WCAG_Accessibility_Live_QA_Bar.md) | `src/components/LiveQATestBar.tsx`, `NavbarStepper.tsx`, `App.tsx` shell | `npm run build` | ✓ Complete |
| **12** | [Phase 12: Onboarding & Dashboard](file:///e:/Promptwars%20-%20Challenge%205/Docs/Implementation_Plans/Phase_12_Onboarding_Wizard_Command_Center_Dashboard.md) | `OnboardingWizardView.tsx`, `DashboardView.tsx`, 4 Hero KPIs | `npm run build` | ✓ Complete |
| **13** | [Phase 13: Budget Studio & Timeline UI](file:///e:/Promptwars%20-%20Challenge%205/Docs/Implementation_Plans/Phase_13_Budget_Studio_CPM_Timeline_Crisis_Simulator.md) | `BudgetStudioView.tsx`, `TimelineView.tsx`, live delay crisis triggers | `npm run build` | ✓ Complete |
| **14** | [Phase 14: Vendor & GenAI Studio + X-Ray](file:///e:/Promptwars%20-%20Challenge%205/Docs/Implementation_Plans/Phase_14_Vendor_Studio_GenAI_Studio_Prompt_XRay_Drawer.md) | `VendorChecklistView.tsx`, `GenAIStudioView.tsx`, `PromptXRayDrawer.tsx` | `npm run build` | ✓ Complete |
| **15** | [Phase 15: Google Workspace Hub & Launch](file:///e:/Promptwars%20-%20Challenge%205/Docs/Implementation_Plans/Phase_15_Google_Workspace_Hub_Dossier_Export_Submission.md) | `google-workspace-bridge.gs`, `GoogleWorkspaceHubModal.tsx`, `README.md` | `npx tsc --noEmit && npm run test && npm run build` | ✓ Complete |

---

## How to Execute with Google Antigravity

1. Open **Google Antigravity**.
2. Run each phase sequentially by copying the blockquoted prompt inside Section 4 of each phase document:
   ```markdown
   > **Antigravity Phase [XX] Execution Prompt:**
   > ...
   ```
3. Run the automated verification commands in Section 5 of the corresponding phase document before proceeding to the next phase.
