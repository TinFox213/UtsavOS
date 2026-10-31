// src/components/BudgetStudioView.tsx
import React from 'react';
import {
  Lock,
  Unlock,
  AlertOctagon,
  Sparkles,
} from 'lucide-react';
import { BudgetSummary, VendorCategoryKey } from '../types/event';
import { rebalanceBudget } from '../shared/budgetEngine';

export interface BudgetStudioViewProps {
  budget: BudgetSummary;
  currency: string;
  guestCount: number;
  onUpdateBudget: (updated: BudgetSummary) => void;
  onTriggerAIOptimizer: () => void;
}

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
      {/* Header */}
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
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Optimize Budget with Gemini AI</span>
        </button>
      </div>

      {/* Critical Deficit Alert Banner (TC-05) */}
      {budget.feasibilityStatus === 'CRITICAL_DEFICIT' && (
        <div className="bg-rose-50 border-2 border-rose-500 rounded-2xl p-4 sm:p-5 flex flex-wrap items-start justify-between gap-4 animate-pulse">
          <div className="flex items-start gap-3 max-w-2xl">
            <AlertOctagon className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-black text-rose-900 text-sm tracking-tight">
                CRITICAL PER-CAPITA DEFICIT DETECTED
              </h3>
              <p className="text-xs text-rose-800 mt-1 leading-relaxed">
                Your budget of <span className="font-bold">{currency} {budget.totalBudget.toLocaleString()}</span> for{' '}
                <span className="font-bold">{guestCount} guests</span> provides only{' '}
                <span className="font-bold">{currency} {budget.perCapitaActual}/guest</span>, which is below the minimum viable floor of{' '}
                <span className="font-bold">{currency} {budget.perCapitaMinimumViable}/guest</span>. Shortfall:{' '}
                <span className="font-bold">{currency} {budget.deficitAmount.toLocaleString()}</span>.
              </p>
              <div className="mt-2 text-xs font-semibold text-rose-700">
                Recommended: Increase budget to <span className="underline">{currency} {(guestCount * budget.perCapitaMinimumViable).toLocaleString()}</span> OR limit guests to <span className="underline">{budget.maxViableGuestsAtCurrentBudget} guests</span>.
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onTriggerAIOptimizer}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs shrink-0 cursor-pointer"
          >
            Run Gemini Value-Engineering Rescue
          </button>
        </div>
      )}

      {/* Reserves Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
          <div className="text-[11px] font-bold uppercase text-slate-500">Net Allocatable Budget</div>
          <div className="text-lg font-black text-indigo-700 tabular-nums mt-0.5">
            {currency} {budget.netAllocatableBudget.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500">82% available pool</div>
        </div>
        <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
          <div className="text-[11px] font-bold uppercase text-slate-500">Contingency Reserve (8%)</div>
          <div className="text-lg font-black text-amber-700 tabular-nums mt-0.5">
            {currency} {budget.contingencyReserve.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500">Locked against emergencies</div>
        </div>
        <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
          <div className="text-[11px] font-bold uppercase text-slate-500">Estimated GST / Tax (10%)</div>
          <div className="text-lg font-black text-slate-700 tabular-nums mt-0.5">
            {currency} {budget.estimatedTaxReserve.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500">Blended tax shield</div>
        </div>
      </div>

      {/* 12 Category Sliders */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
        <h3 className="font-bold text-sm text-slate-800">12 Expense Allocations with Lock Protection</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {budget.categories.map((cat) => {
            const percent = ((cat.allocatedAmount / budget.netAllocatableBudget) * 100).toFixed(1);
            return (
              <div
                key={cat.key}
                className={`p-3.5 rounded-xl border transition-all ${
                  cat.isLocked ? 'border-amber-400 bg-amber-50/40' : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleLock(cat.key)}
                      title={cat.isLocked ? 'Unlock category' : 'Lock category amount'}
                      className={`p-1.5 rounded-md cursor-pointer ${
                        cat.isLocked ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-400 hover:text-slate-700'
                      }`}
                    >
                      {cat.isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                    </button>
                    <span className="font-bold text-xs text-slate-800 truncate max-w-[180px]">
                      {cat.label}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="font-extrabold text-sm text-slate-900 tabular-nums">
                      {currency} {cat.allocatedAmount.toLocaleString()}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400 ml-1.5 tabular-nums">
                      ({percent}%)
                    </span>
                  </div>
                </div>

                {/* Range Slider */}
                <input
                  type="range"
                  min={0}
                  max={budget.netAllocatableBudget}
                  step={500}
                  disabled={cat.isLocked}
                  value={cat.allocatedAmount}
                  onChange={(e) => handleSliderChange(cat.key, Number(e.target.value))}
                  className="w-full accent-indigo-600 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                />

                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                  <span>Per guest: {currency} {cat.perCapitaAmount}</span>
                  <span>{cat.rationale}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
