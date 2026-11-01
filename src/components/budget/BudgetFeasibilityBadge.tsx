// src/components/budget/BudgetFeasibilityBadge.tsx
import React from 'react';
import { AlertOctagon } from 'lucide-react';
import { BudgetSummary } from '../../types/event';

interface BudgetFeasibilityBadgeProps {
  budget: BudgetSummary;
  currency: string;
  guestCount: number;
  onTriggerRescue: () => void;
}

/**
 * Deficit warning alert and reserve pool overview cards.
 */
export const BudgetFeasibilityBadge: React.FC<BudgetFeasibilityBadgeProps> = ({
  budget,
  currency,
  guestCount,
  onTriggerRescue,
}) => {
  return (
    <div className="space-y-4">
      {budget.feasibilityStatus === 'CRITICAL_DEFICIT' && (
        <div
          role="alert"
          aria-live="assertive"
          className="bg-rose-50 border-2 border-rose-500 rounded-2xl p-4 sm:p-5 flex flex-wrap items-start justify-between gap-4 animate-pulse"
        >
          <div className="flex items-start gap-3 max-w-2xl">
            <AlertOctagon className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <h3 className="font-black text-rose-900 text-sm tracking-tight">
                CRITICAL PER-CAPITA DEFICIT DETECTED
              </h3>
              <p className="text-xs text-rose-800 mt-1 leading-relaxed">
                Your budget of <span className="font-bold">{currency} {budget.totalBudget.toLocaleString()}</span> for{' '}
                <span className="font-bold">{guestCount} guests</span> provides only{' '}
                <span className="font-bold">{currency} {budget.perCapitaActual}/guest</span>, below the floor of{' '}
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
            onClick={onTriggerRescue}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs shrink-0 cursor-pointer"
          >
            Run Gemini Value-Engineering Rescue
          </button>
        </div>
      )}

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
    </div>
  );
};
