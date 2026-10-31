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
