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
