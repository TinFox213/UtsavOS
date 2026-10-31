# **Security, Efficiency, Code Quality & PromptWars 6-Pillar Evaluation Rubric Playbook**

**Document ID:** 06\_Security\_Efficiency\_Code\_Quality\_and\_PromptWars\_Rubric\_Playbook  
**Parent Folder:** [Promptwars \- Challenge 5](https://drive.google.com/drive/folders/1_X0KYzGtE3KIC3PJVvHtiW4JfhCmILt5)

# **1\. The PromptWars 6-Pillar Evaluation Engineering Matrix**

PromptWars evaluates submissions using an automated code/deployment analyzer combined with jury review across six core pillars: **Code Quality**, **Security**, **Efficiency**, **Testing**, **Accessibility**, and **Problem Statement Alignment**. This playbook defines the non-negotiable engineering standards Antigravity must implement so our repository ranks \#1 on the global leaderboard.

| Evaluation Pillar | Weight / Impact | Mandatory Engineering Controls Implemented in AuraPlan AI |
| :---- | :---- | :---- |
| **1\. Code Quality** | High (Static Analysis & AST Audit) | • TypeScript `strict: true`, `noImplicitAny: true`, `noUnusedLocals: true` in `tsconfig.json`.• Zero `any` types across the entire `src/` directory.• Clean separation of concerns: `src/shared/` (pure deterministic math), `src/schemas/` (Zod validation), `src/services/` (API & persistence), `src/components/` (modular UI under 250 lines per file).• Comprehensive JSDoc headers on all exported functions. |
| **2\. Security** | High (Secret Scanning, OWASP Web & LLM) | • Zero hardcoded secrets: `GEMINI_API_KEY` accessed exclusively via server environment variables (`process.env.GEMINI_API_KEY`) with `.env.example` template.• **OWASP LLM01 Prompt Injection Shield:** Regex \+ token sanitizer (`sanitizePromptInput()`) blocking instruction-override attacks (`"Ignore previous instructions"`, `"Reveal system prompt"`, `<script>`).• **HTTP Security Headers** in `vercel.json` / server middleware: `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`.• Rate limiting (`30 req/min` per IP) on `/api/v1/ai-generate`. |
| **3\. Efficiency** | High (Bundle Size, Latency & Web Vitals) | • Isomorphic budget & timeline recalculation in `<5ms` (O(1) / O(V+E) topological pass) using `useMemo` and `requestAnimationFrame`\-safe state updates.• Route/Tab code-splitting via `React.lazy()` and `Suspense` so initial JS payload is `<120 KB` gzipped.• Client-side caching of recent Gemini responses keyed by SHA-256 input signature to prevent duplicate API token burn. |
| **4\. Testing** | High (Automated Suite \+ Live Video QA) | • 25+ Vitest unit & integration tests (`tests/budgetEngine.test.ts`, `tests/timelineEngine.test.ts`, `tests/validationSchemas.test.ts`, `tests/dynamicDiffEngine.test.ts`).• Built-in **In-App Live Testing & Edge-Case Verification Bar** allowing live 1-click and manual edge-case testing during the demo video. |
| **5\. Accessibility** | High (Lighthouse A11y & WCAG 2.1 AA) | • 100% semantic landmarks (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`).• Explicit `<label htmlFor="...">`, `aria-invalid`, `aria-describedby`, and `role="alert"` on every input field.• Verified `>= 4.5:1` contrast ratios across all badges and text tokens.• Keyboard shortcuts and focus ring visibility (`focus-visible:ring-4`). |
| **6\. Problem Statement Alignment** | Critical (Jury & Rubric Verification) | • Explicitly models **Weddings**, **Birthdays**, and **Community Events**.• Explicitly delivers **Budgets** (12-category parametric allocator), **Timelines** (CPM countdown \+ minute-by-minute run-of-show), **Vendor Checklists** (120 items \+ payment tranches), and **Personalized Ideas** (5 Gemini 2.5 Flash copilots with Prompt X-Ray). |

# **2\. Security Implementation Blueprint (`src/shared/securityGuardrails.ts`)**

const PROMPT\_INJECTION\_PATTERNS: RegExp\[\] \= \[

  /ignore\\s+(all\\s+)?(previous\|prior\|above)\\s+instructions/i,

  /reveal\\s+(your\\s+)?(system\\s+prompt\|hidden\\s+instructions\|api\\s+key)/i,

  /\<script\\b\[^\<\]\*(?:(?\!\<\\/script\>)\<\[^\<\]\*)\*\<\\/script\>/gi,

  /javascript:/gi,

  /on(load\|error\|click\|mouseover)\\s\*=/gi,

  /drop\\s+table\|union\\s+select\|--\\s\*\$/i,

\];

export interface SecurityAuditResult {

  isSafe: boolean;

  sanitizedText: string;

  triggeredRule: string \| null;

}

export function auditAndSanitizeInput(rawInput: string): SecurityAuditResult {

  const trimmed \= rawInput.trim();

  for (const pattern of PROMPT\_INJECTION\_PATTERNS) {

    if (pattern.test(trimmed)) {

      return {

        isSafe: false,

        sanitizedText: '',

        triggeredRule: \`Blocked by OWASP LLM01 / XSS Guardrail: matched restricted pattern (\${pattern.source})\`,

      };

    }

  }

  const sanitized \= trimmed

    .replace(/\</g, '\&lt;')

    .replace(/\>/g, '\&gt;');

  return {

    isSafe: true,

    sanitizedText: sanitized,

    triggeredRule: null,

  };

}

# **3\. Efficiency & Core Web Vitals Engineering**

1. **Zero-Allocation Hot Loop in Budget Studio:**  
   * Slider drag events update local numeric state immediately and compute the 12 category allocations via pure arithmetic (`src/shared/budgetEngine.ts`), achieving `<2ms` execution time per frame (`60 FPS`).  
2. **Deterministic Response Caching:**  
   * Every Gemini prompt execution computes a fast hash of `{ copilotMode, eventType, subType, guestCount, totalBudget, userPrompt }`. If an identical request was already executed in the session, the user can either view the cached result (`0ms`) or click **"Force Live Re-Run"** to demonstrate real-time generation.  
3. **Security & Caching Headers (`vercel.json`):**  
   * Static assets (`/assets/*`) served with `Cache-Control: public, max-age=31536000, immutable`.  
   * API endpoints (`/api/v1/*`) served with `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, and strict CORS policies.

