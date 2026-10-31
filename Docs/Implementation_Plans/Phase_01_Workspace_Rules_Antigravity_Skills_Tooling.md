# Phase 01: Antigravity Workspace Foundation, GEMINI.md Rules, Custom Skills & Tooling Configuration

**Phase Number:** 01 of 15  
**Document ID:** `Phase_01_Workspace_Rules_Antigravity_Skills_Tooling`  
**Target Code Modules:** `GEMINI.md`, `.agent/skills/deterministic-math-verifier/SKILL.md`, `.agent/skills/google-workspace-bridge/SKILL.md`, `.agent/skills/promptwars-rubric-auditor/SKILL.md`, `.env.example`, `mcp-config.json`  
**Parent Specs:** [Doc 00: Master Index](file:///e:/Promptwars%20-%20Challenge%205/Docs/00_Master_Index_Document_Registry_and_Top1_Winning_Strategy.md), [Doc 06: Security & Rubric Playbook](file:///e:/Promptwars%20-%20Challenge%205/Docs/06_Security_Efficiency_Code_Quality_and_PromptWars_Rubric_Playbook.md), [Doc 10: Top-1 Gap Analysis & Antigravity Skills](file:///e:/Promptwars%20-%20Challenge%205/Docs/10_Top1_Gap_Analysis_Google_Workspace_Integrations_Free_APIs_and_Antigravity_Skills.md)

---

## 1. Architectural Objectives & Rubric Mapping

In autonomous software generation for hackathons, agentic context drift leads to hallucinated dependencies, float arithmetic inaccuracies in financial calculations, and unverified AI outputs. Phase 01 establishes the workspace constraints, root agent rules, custom verification skills, and environment templates required to lock down repository quality from commit zero.

| Evaluation Rubric Pillar | Phase 01 Engineering Control |
| :--- | :--- |
| **Code Quality & Consistency** | Enforces root `GEMINI.md` constraints: `<45` lines per function, cyclomatic complexity `<=8`, zero implicit `any`, and largest-remainder integer distribution for monetary math. |
| **Security & Secret Scanning** | Establishes `.env.example` template with strict prohibitions against committing API keys or exposing `GEMINI_API_KEY` to client-side bundles. |
| **Testing Automation** | Provisions `.agent/skills/deterministic-math-verifier/SKILL.md` to trigger automated Vitest passes after any math engine modification. |
| **Google Ecosystem Alignment** | Configures `.agent/skills/google-workspace-bridge/SKILL.md` and MCP server manifests for Google Calendar, Sheets, Docs, and Gmail deep integration. |

---

## 2. Prerequisites & Input State

- Clean repository workspace root: `e:\Promptwars - Challenge 5`.
- Node.js environment (v18+ or v20+) available.
- Package manager: Standardized on `npm` / `npx`.

---

## 3. Detailed Technical Specification & File Blueprints

### 3.1 File: `GEMINI.md` (Workspace Root Agent Rules)
This file governs all Antigravity agent interactions within the repository:

```markdown
# GEMINI.md — Antigravity Workspace Rules for AuraPlan AI (UtsavOS)

## 1. Core Architecture & SDK Directives
- Standardize all serverless AI operations (`api/v1/ai-generate.ts`) on the official `@google/genai` SDK using `gemini-2.5-flash`. Direct usage of `@google/generative-ai` is strictly prohibited.
- Never expose API credentials (`GEMINI_API_KEY`) within public client bundles or `VITE_*` environment variables.
- Financial engines (`src/shared/budgetEngine.ts`), scheduling calculators (`src/shared/timelineEngine.ts`), and payment scheduling logic (`src/shared/vendorEngine.ts`) MUST remain 100% deterministic pure functions with zero float precision drift. Apply integer rounding with largest-remainder reconciliation.

## 2. Code Quality & Execution Boundaries
- `tsconfig.json` MUST maintain `"strict": true`, `"noImplicitAny": true`, and `"noUncheckedIndexedAccess": true`.
- Functions must not exceed 45 lines of code, maintaining a maximum cyclomatic complexity score of 8.
- External HTTP queries (Open-Meteo, Nominatim, Overpass, Frankfurter, Nager.Date, Workspace REST APIs) MUST incorporate a 4,000ms `AbortController` timeout paired with immediate offline fallbacks.

## 3. Mandatory UI Observability Components
- `LiveQATestBar.tsx`: Fixed top viewport bar displaying the active input target, value state, and real-time validation badges (`VALID` vs `INVALID / EDGE CASE`).
- `PromptXRayDrawer.tsx`: Split-screen drawer rendering exact prompts dispatched to `gemini-2.5-flash`, raw structured JSON responses, and run-over-run diff visualizers.
- `GoogleWorkspaceHubModal.tsx`: Dual-action modal supporting both Zero-Auth Instant Action Links and 1-Click Apps Script / GIS OAuth synchronization.

## 4. Verification Gate
- Require `npx vitest run` and `npx tsc --noEmit` verification after every code generation phase.
```

### 3.2 File: `.agent/skills/deterministic-math-verifier/SKILL.md`
Agent skill to automatically verify budget and timeline invariants:

```markdown
---
name: deterministic-math-verifier
description: Automatically verifies mathematical invariants across budget allocations, timeline CPM calculations, and vendor tranche reconciliations using Vitest.
---

# Deterministic Math Verifier Skill

Use this skill whenever files inside `src/shared/` (`budgetEngine.ts`, `timelineEngine.ts`, `vendorEngine.ts`, `cateringCalculator.ts`) are created or modified.

## Verification Checklist:
1. Budget Allocation Invariant:
   `ContingencyReserve + EstimatedTaxReserve + sum(categoryAllocations) === TotalBudget` down to integer currency units.
2. Weight Normalization Invariant:
   Sum of 12 category weights across all archetypes must equal exactly `1.0000`.
3. CPM Non-Negative Slack Invariant:
   Early Start + Duration <= Early Finish for all critical path nodes. Curfew alerts must trigger if end time > 22:00.
4. Command:
   Run `npx vitest run tests/budgetEngine.test.ts tests/timelineEngine.test.ts` and confirm 100% pass rate.
```

### 3.3 File: `.agent/skills/google-workspace-bridge/SKILL.md`
Agent skill for Google Workspace integration patterns:

```markdown
---
name: google-workspace-bridge
description: Guidance and URI templates for Tier-1 Zero-Auth Google Workspace deep links and Tier-2 Apps Script webhook payloads.
---

# Google Workspace Bridge Skill

Use this skill when constructing deep links or webhook payloads for Google Calendar, Gmail, Google Sheets, Google Docs, and Google Forms.

## Tier-1 Zero-Auth Deep Link Patterns:
- Google Calendar:
  `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${startDateIso}/${endDateIso}`
- Gmail Compose:
  `https://mail.google.com/mail/?view=cm&fs=1&to=${vendorEmail}&su=${subject}&body=${body}`
- Google Maps Search & Directions:
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`

## Tier-2 Webhook Payload Structure:
Must match `WorkspaceSyncPayload` interface: `{ eventName, eventDate, city, currency, totalBudget, guestCount, allocations, milestones, vendors }`.
```

### 3.4 File: `.agent/skills/promptwars-rubric-auditor/SKILL.md`
Agent skill to audit code against the PromptWars 6-Pillar Rubric:

```markdown
---
name: promptwars-rubric-auditor
description: Audits code quality, WCAG 2.1 AA accessibility, OWASP security, and bundle size against the PromptWars 6-Pillar Evaluation Rubric.
---

# PromptWars Rubric Auditor Skill

Use this skill prior to completing any UI or full-stack phase.

## Audit Checks:
1. Accessibility:
   - Verify every `<input>` has an associated `<label htmlFor="...">`.
   - Ensure contrast tokens meet >= 4.5:1 on background.
   - Confirm `aria-live="polite"` exists for dynamic updates.
2. Security:
   - Confirm `auditAndSanitizeInput()` is executed on user prompts.
   - Ensure zero raw HTML injections (`dangerouslySetInnerHTML` forbidden).
   - Verify `GEMINI_API_KEY` is never prefixed with `VITE_`.
3. Code Efficiency:
   - Ensure `tabular-nums` is applied to numeric financial metrics to prevent CLS.
   - Confirm slider event handlers avoid heap allocations in hot loops.
```

### 3.5 File: `.env.example`
Environment variables template:

```env
# Serverless AI Credentials (Server-side ONLY - Never expose to client)
GEMINI_API_KEY="your_gemini_2_5_flash_api_key_here"

# Google Workspace Tier-2 Apps Script Webhook (Optional)
VITE_GAS_WEBHOOK_URL=""

# Google Identity Services Client ID (Optional for Tier-3 OAuth)
VITE_GOOGLE_CLIENT_ID=""

# Application Port
PORT=3000
```

### 3.6 File: `mcp-config.json` (Recommended Tooling Spec)
Configuration profile documenting MCP integration:

```json
{
  "mcpServers": {
    "google-workspace": {
      "command": "npx",
      "args": ["-y", "@google-workspace/mcp-server"]
    },
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"]
    },
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    }
  }
}
```

---

## 4. Copy-Pasteable Antigravity Execution Prompt

```markdown
> **Antigravity Phase 01 Execution Prompt:**
> Establish the foundation workspace rules, agent skills, and environment templates for AuraPlan AI (UtsavOS):
> 1. Create `GEMINI.md` at workspace root enforcing official `@google/genai` (gemini-2.5-flash), strict TypeScript rules (noImplicitAny, noUncheckedIndexedAccess), pure deterministic math functions, 4000ms AbortController timeouts for external HTTP queries, and mandatory UI observability components (`LiveQATestBar.tsx`, `PromptXRayDrawer.tsx`).
> 2. Create `.agent/skills/deterministic-math-verifier/SKILL.md` to run Vitest assertions on math engines.
> 3. Create `.agent/skills/google-workspace-bridge/SKILL.md` documenting Tier-1 deep links and Tier-2 Apps Script webhook schemas.
> 4. Create `.agent/skills/promptwars-rubric-auditor/SKILL.md` for pre-commit static rubric checks.
> 5. Create `.env.example` defining `GEMINI_API_KEY` (server-side only) and optional Google Workspace endpoints.
> 6. Create `mcp-config.json` referencing required MCP servers.
```

---

## 5. Verification & Test Commands

### Automated Verification
```powershell
# Verify files exist in root and .agent/skills/
Test-Path GEMINI.md
Test-Path .agent/skills/deterministic-math-verifier/SKILL.md
Test-Path .agent/skills/google-workspace-bridge/SKILL.md
Test-Path .agent/skills/promptwars-rubric-auditor/SKILL.md
Test-Path .env.example
```

### Manual Verification
1. Verify `GEMINI.md` contains strict rules against client-side exposure of `GEMINI_API_KEY`.
2. Verify all URI templates in `google-workspace-bridge/SKILL.md` match standard RFC-5545 and Google Workspace parameters.

---

## 6. Failure Modes & Recovery Protocol

- **Missing Directory Structure:** Ensure `.agent/skills/` directory is created recursively.
- **Gitignore Leakage:** Ensure `.env` is listed in `.gitignore` so personal keys are never committed.
