// src/components/DashboardView.tsx
import React from 'react';
import { AlertOctagon, CheckCircle, Clock } from 'lucide-react';
import { EventPlanState } from '../types/event';
import { MetricsPanel } from './dashboard/MetricsPanel';
import { StudioNavCards } from './dashboard/StudioNavCards';

export interface DashboardViewProps {
  eventPlan: EventPlanState;
  onNavigateTab: (step: number) => void;
}

/**
 * Step 2 Command Center Dashboard providing high-altitude oversight of financial health,
 * CPM critical paths, vendor onboarding scores, and dietary distributions.
 */
export const DashboardView: React.FC<DashboardViewProps> = ({ eventPlan, onNavigateTab }) => {
  const { budget, guestCount } = eventPlan;

  return (
    <div className="space-y-6">
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

        <div className="text-right">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-bold">Feasibility Status</div>
          <div className="mt-1">
            {budget.feasibilityStatus === 'OPTIMAL' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-sm font-black">
                <CheckCircle className="w-4 h-4" aria-hidden="true" /> OPTIMAL (Healthy Margin)
              </span>
            )}
            {budget.feasibilityStatus === 'TIGHT_VIABLE' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-400/40 text-sm font-black">
                <Clock className="w-4 h-4" aria-hidden="true" /> TIGHT MARGIN (Viable)
              </span>
            )}
            {budget.feasibilityStatus === 'CRITICAL_DEFICIT' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-400/40 text-sm font-black animate-pulse">
                <AlertOctagon className="w-4 h-4" aria-hidden="true" /> CRITICAL DEFICIT
              </span>
            )}
          </div>
        </div>
      </div>

      <MetricsPanel eventPlan={eventPlan} />

      <StudioNavCards onNavigateTab={onNavigateTab} />
    </div>
  );
};
