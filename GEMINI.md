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
