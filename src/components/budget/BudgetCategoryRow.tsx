// src/components/budget/BudgetCategoryRow.tsx
import React from 'react';
import { Lock, Unlock } from 'lucide-react';
import { BudgetCategoryAllocation, VendorCategoryKey } from '../../types/event';

interface BudgetCategoryRowProps {
  cat: BudgetCategoryAllocation;
  currency: string;
  netAllocatableBudget: number;
  onToggleLock: (key: VendorCategoryKey) => void;
  onSliderChange: (key: VendorCategoryKey, amount: number) => void;
}

/**
 * Interactive category allocation row with lock state toggle and accessible range slider.
 */
export const BudgetCategoryRow: React.FC<BudgetCategoryRowProps> = ({
  cat,
  currency,
  netAllocatableBudget,
  onToggleLock,
  onSliderChange,
}) => {
  const percent = ((cat.allocatedAmount / (netAllocatableBudget || 1)) * 100).toFixed(1);
  const sliderId = `slider-${cat.key}`;

  return (
    <div
      className={`p-3.5 rounded-xl border transition-all ${
        cat.isLocked ? 'border-amber-400 bg-amber-50/40' : 'border-slate-200 bg-white'
      }`}
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onToggleLock(cat.key)}
            title={cat.isLocked ? 'Unlock category' : 'Lock category amount'}
            aria-label={`Toggle lock for ${cat.label}`}
            aria-pressed={cat.isLocked}
            className={`p-1.5 rounded-md cursor-pointer ${
              cat.isLocked ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-400 hover:text-slate-700'
            }`}
          >
            {cat.isLocked ? <Lock className="w-3.5 h-3.5" aria-hidden="true" /> : <Unlock className="w-3.5 h-3.5" aria-hidden="true" />}
          </button>
          <label htmlFor={sliderId} className="font-bold text-xs text-slate-800 truncate max-w-[180px] cursor-pointer">
            {cat.label}
          </label>
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

      <input
        id={sliderId}
        type="range"
        min={0}
        max={netAllocatableBudget}
        step={500}
        disabled={cat.isLocked}
        value={cat.allocatedAmount}
        aria-label={`${cat.label} budget allocation slider`}
        aria-valuemin={0}
        aria-valuemax={netAllocatableBudget}
        aria-valuenow={cat.allocatedAmount}
        onChange={(e) => onSliderChange(cat.key, Number(e.target.value))}
        className="w-full accent-indigo-600 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
      />

      <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
        <span>Per guest: {currency} {cat.perCapitaAmount}</span>
        <span>{cat.rationale}</span>
      </div>
    </div>
  );
};
