// src/components/DashboardView.tsx
import React from 'react';
import {
  Wallet,
  Users,
  CalendarCheck,
  Building2,
  Salad,
  AlertOctagon,
  CheckCircle,
  Clock,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { EventPlanState } from '../types/event';

export interface DashboardViewProps {
  eventPlan: EventPlanState;
  onNavigateTab: (step: number) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ eventPlan, onNavigateTab }) => {
  const { budget, milestones, vendors, dietary, currency, guestCount } = eventPlan;
  const completedTasks = milestones.filter((m) => m.status === 'COMPLETED').length;
  const bookedVendors = vendors.filter((v) => v.bookingStatus !== 'NOT_STARTED').length;

  return (
    <div className="space-y-6">
      {/* Event Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-linear-to-r from-indigo-900 to-slate-900 text-white rounded-2xl p-6 shadow-sm">
        <div>
          <span className="px-2.5 py-1 rounded-md bg-indigo-500/30 text-indigo-200 font-semibold text-xs tracking-wider uppercase border border-indigo-400/20">
            {eventPlan.archetype}
          </span>
          <h2 className="text-2xl font-black tracking-tight mt-2">{eventPlan.eventName}</h2>
          <p className="text-slate-300 text-xs mt-1">
            {eventPlan.city} • {eventPlan.eventDateIso} • {guestCount} Guests
          </p>
        </div>

        {/* Feasibility Status Pill */}
        <div className="text-right">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-bold">Feasibility Status</div>
          <div className="mt-1">
            {budget.feasibilityStatus === 'OPTIMAL' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-sm font-black">
                <CheckCircle className="w-4 h-4" /> OPTIMAL (Healthy Margin)
              </span>
            )}
            {budget.feasibilityStatus === 'TIGHT_VIABLE' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-400/40 text-sm font-black">
                <Clock className="w-4 h-4" /> TIGHT MARGIN (Viable)
              </span>
            )}
            {budget.feasibilityStatus === 'CRITICAL_DEFICIT' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-400/40 text-sm font-black animate-pulse">
                <AlertOctagon className="w-4 h-4" /> CRITICAL DEFICIT
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 4 Hero KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Budget */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Budget</span>
            <Wallet className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 tabular-nums">
            {currency} {budget.totalBudget.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
            <span>Net Allocatable:</span>
            <span className="font-semibold text-slate-800">{currency} {budget.netAllocatableBudget.toLocaleString()}</span>
          </div>
        </div>

        {/* KPI 2: Per-Guest Allowance */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Per-Guest Cost</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 tabular-nums">
            {currency} {budget.perCapitaActual.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
            <span>Min Viable Floor:</span>
            <span className="font-semibold text-slate-800">{currency} {budget.perCapitaMinimumViable.toLocaleString()}</span>
          </div>
        </div>

        {/* KPI 3: CPM Timeline Readiness */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">CPM Readiness</span>
            <CalendarCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 tabular-nums">
            {completedTasks} / {milestones.length}
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
            <span>Next Action:</span>
            <span className="font-semibold text-slate-800 truncate max-w-[120px]">{milestones[0]?.title ?? 'Kickoff'}</span>
          </div>
        </div>

        {/* KPI 4: Vendor Onboarding */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Vendor Onboarding</span>
            <Building2 className="w-4 h-4 text-amber-600" />
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

      {/* Dietary Breakdown & Protection Shield */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Dietary Distribution */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <Salad className="w-4 h-4 text-emerald-600" />
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

        {/* Contingency & Tax Shield */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <ShieldAlert className="w-4 h-4 text-indigo-600" />
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

      {/* Quick Launchpad to Studios */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h4 className="font-bold text-sm text-slate-800">Operational Studios</h4>
          <p className="text-xs text-slate-500">Jump directly into fine-tuning allocations, timeline crisis simulations, or AI copilots.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab(3)}
            className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-bold flex items-center gap-1 cursor-pointer"
          >
            Budget Studio <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onNavigateTab(4)}
            className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-bold flex items-center gap-1 cursor-pointer"
          >
            Timeline & Crises <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onNavigateTab(6)}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
          >
            GenAI Studio <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
