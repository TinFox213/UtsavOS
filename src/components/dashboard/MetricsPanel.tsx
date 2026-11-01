// src/components/dashboard/MetricsPanel.tsx
import React from 'react';
import { Wallet, Users, CalendarCheck, Building2, Salad, ShieldAlert } from 'lucide-react';
import { EventPlanState } from '../../types/event';

interface MetricsPanelProps {
  eventPlan: EventPlanState;
}

/**
 * 4 Hero KPI metric cards and dietary distribution breakdown.
 */
export const MetricsPanel: React.FC<MetricsPanelProps> = ({ eventPlan }) => {
  const { budget, milestones, vendors, dietary, currency } = eventPlan;
  const completedTasks = milestones.filter((m) => m.status === 'COMPLETED').length;
  const bookedVendors = vendors.filter((v) => v.bookingStatus !== 'NOT_STARTED').length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Budget</span>
            <Wallet className="w-4 h-4 text-indigo-600" aria-hidden="true" />
          </div>
          <div className="text-2xl font-black text-slate-900 tabular-nums">
            {currency} {budget.totalBudget.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
            <span>Net Allocatable:</span>
            <span className="font-semibold text-slate-800">{currency} {budget.netAllocatableBudget.toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Per-Guest Cost</span>
            <Users className="w-4 h-4 text-emerald-600" aria-hidden="true" />
          </div>
          <div className="text-2xl font-black text-slate-900 tabular-nums">
            {currency} {budget.perCapitaActual.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
            <span>Min Viable Floor:</span>
            <span className="font-semibold text-slate-800">{currency} {budget.perCapitaMinimumViable.toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">CPM Readiness</span>
            <CalendarCheck className="w-4 h-4 text-blue-600" aria-hidden="true" />
          </div>
          <div className="text-2xl font-black text-slate-900 tabular-nums">
            {completedTasks} / {milestones.length}
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
            <span>Next Action:</span>
            <span className="font-semibold text-slate-800 truncate max-w-[120px]">{milestones[0]?.title ?? 'Kickoff'}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Vendor Onboarding</span>
            <Building2 className="w-4 h-4 text-amber-600" aria-hidden="true" />
          </div>
          <div className="text-2xl font-black text-slate-900 tabular-nums">
            {bookedVendors} / {vendors.length}
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
            <span>Safe Tranches:</span>
            <span className="font-semibold text-emerald-700">30 / 50 / 20 Active</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <Salad className="w-4 h-4 text-emerald-600" aria-hidden="true" />
            <h3 className="font-bold text-sm text-slate-900">Dietary & Cultural Preference Distribution</h3>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-emerald-50 border border-emerald-100 p-2.5 rounded-lg">
              <div className="text-lg font-black text-emerald-700 tabular-nums">{dietary.vegetarianPct}%</div>
              <div className="text-[11px] font-semibold text-emerald-900">Standard Veg</div>
            </div>
            <div className="bg-amber-50 border border-amber-100 p-2.5 rounded-lg">
              <div className="text-lg font-black text-amber-700 tabular-nums">{dietary.jainPct}%</div>
              <div className="text-[11px] font-semibold text-amber-900">Jain (No Root Veg)</div>
            </div>
            <div className="bg-indigo-50 border border-indigo-100 p-2.5 rounded-lg">
              <div className="text-lg font-black text-indigo-700 tabular-nums">{dietary.veganPct}%</div>
              <div className="text-[11px] font-semibold text-indigo-900">Vegan</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <ShieldAlert className="w-4 h-4 text-indigo-600" aria-hidden="true" />
            <h3 className="font-bold text-sm text-slate-900">Financial Tax & Contingency Shield</h3>
          </div>
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
              <span className="text-slate-600 font-medium">Contingency Reserve (8%):</span>
              <span className="font-bold text-slate-900 tabular-nums">
                {currency} {budget.contingencyReserve.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
              <span className="text-slate-600 font-medium">Estimated GST & Service Tax (10%):</span>
              <span className="font-bold text-slate-900 tabular-nums">
                {currency} {budget.estimatedTaxReserve.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
