// src/components/BudgetStudioView.tsx
import React from 'react';
import { Sparkles } from 'lucide-react';
import { BudgetSummary, VendorCategoryKey } from '../types/event';
import { rebalanceBudget } from '../shared/budgetEngine';
import { BudgetCategoryRow } from './budget/BudgetCategoryRow';
import { BudgetFeasibilityBadge } from './budget/BudgetFeasibilityBadge';

export interface BudgetStudioViewProps {
  budget: BudgetSummary;
  currency: string;
  guestCount: number;
  onUpdateBudget: (updated: BudgetSummary) => void;
  onTriggerAIOptimizer: () => void;
}

/**
 * Step 3 12-category interactive budget allocation studio with proportional rebalancing
 * and deficit detection.
 */
export const BudgetStudioView: React.FC<BudgetStudioViewProps> = ({
  budget,
  currency,
  guestCount,
  onUpdateBudget,
  onTriggerAIOptimizer,
}) => {
  const handleSliderChange = (key: VendorCategoryKey, newAmount: number) => {
    const updated = rebalanceBudget(budget, key, newAmount);
    onUpdateBudget(updated);
  };

  const handleToggleLock = (key: VendorCategoryKey) => {
    const updatedCategories = budget.categories.map((c) =>
      c.key === key ? { ...c, isLocked: !c.isLocked } : c
    );
    onUpdateBudget({ ...budget, categories: updatedCategories });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Step 3: 12-Category Interactive Budget Studio
          </h2>
          <p className="text-xs text-slate-500">
            Lock any category and drag other sliders. Unlocked categories rebalance proportionally in &lt;16ms at 60 FPS.
          </p>
        </div>

        <button
          type="button"
          onClick={onTriggerAIOptimizer}
          className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-300" aria-hidden="true" />
          <span>Optimize Budget with Gemini AI</span>
        </button>
      </div>

      <BudgetFeasibilityBadge
        budget={budget}
        currency={currency}
        guestCount={guestCount}
        onTriggerRescue={onTriggerAIOptimizer}
      />

      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
        <h3 className="font-bold text-sm text-slate-800">12 Expense Allocations with Lock Protection</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {budget.categories.map((cat) => (
            <BudgetCategoryRow
              key={cat.key}
              cat={cat}
              currency={currency}
              netAllocatableBudget={budget.netAllocatableBudget}
              onToggleLock={handleToggleLock}
              onSliderChange={handleSliderChange}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
