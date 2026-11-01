// src/components/timeline/CrisisSimulatorPanel.tsx
import React from 'react';
import { AlertTriangle, Clock, CloudRain } from 'lucide-react';

interface CrisisSimulatorPanelProps {
  crisisAlert: string | null;
  onApplyDelay: (nodeId: string, delayMins: number, scenarioLabel: string) => void;
}

/**
 * Live delay injection control panel simulating vendor ripple effects and curfew conflicts.
 */
export const CrisisSimulatorPanel: React.FC<CrisisSimulatorPanelProps> = ({
  crisisAlert,
  onApplyDelay,
}) => {
  return (
    <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 border border-slate-800 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-400" aria-hidden="true" />
          <h3 className="font-extrabold text-sm tracking-tight">Live Crisis & Delay Simulator (Video Sec 4)</h3>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">Curfew Cutoff: 22:00 PM</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onApplyDelay('ros-w1', 45, 'Bridal Makeup / Floral Setup Delay')}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-amber-300 flex items-center gap-1.5 cursor-pointer"
        >
          <Clock className="w-3.5 h-3.5" aria-hidden="true" /> +45m HMU / Setup Delay
        </button>
        <button
          type="button"
          onClick={() => onApplyDelay('ros-w4', 30, 'Catering Delivery Traffic Delay')}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-amber-300 flex items-center gap-1.5 cursor-pointer"
        >
          <Clock className="w-3.5 h-3.5" aria-hidden="true" /> +30m Caterer Delay
        </button>
        <button
          type="button"
          onClick={() => onApplyDelay('ros-w5', 60, 'Outdoor Rain Contingency Shift')}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-rose-300 flex items-center gap-1.5 cursor-pointer"
        >
          <CloudRain className="w-3.5 h-3.5" aria-hidden="true" /> Sudden Rain Reroute (+60m)
        </button>
      </div>

      {crisisAlert && (
        <div
          role="status"
          aria-live="polite"
          className="p-2.5 rounded-lg bg-amber-500/20 text-amber-200 border border-amber-500/40 text-xs font-semibold"
        >
          {crisisAlert}
        </div>
      )}
    </div>
  );
};
