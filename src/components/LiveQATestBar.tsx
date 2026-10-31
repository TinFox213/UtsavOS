// src/components/LiveQATestBar.tsx
import React from 'react';
import { ShieldCheck, AlertCircle, CheckCircle2, FlaskConical } from 'lucide-react';

export interface LiveQATestBarProps {
  activeField: string;
  activeValue: string | number;
  validationStatus: 'VALID' | 'INVALID' | 'NEUTRAL';
  statusMessage: string;
}

export const LiveQATestBar: React.FC<LiveQATestBarProps> = ({
  activeField,
  activeValue,
  validationStatus,
  statusMessage,
}) => {
  return (
    <div
      role="region"
      aria-label="Live Video QA & Validation Mirror Bar"
      className="sticky top-0 z-50 w-full bg-slate-900 text-white border-b-2 border-indigo-500 shadow-md px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-sm"
    >
      {/* Title & Badge */}
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-600 font-semibold text-xs tracking-wider uppercase">
          <FlaskConical className="w-3.5 h-3.5" /> Live Judge QA Bar
        </span>
        <span className="text-slate-400 hidden sm:inline text-xs">
          (Video Section 2 Testing Inspector)
        </span>
      </div>

      {/* Active Field & Value Mirror */}
      <div className="flex items-center gap-2 bg-slate-800/90 px-3 py-1 rounded-lg border border-slate-700">
        <span className="text-slate-400 text-xs uppercase font-medium">{activeField || 'Input'}:</span>
        <span className="font-mono text-base font-bold text-amber-300">
          {String(activeValue || '—')}
        </span>
      </div>

      {/* Reactive Status Badge */}
      <div className="flex items-center gap-2">
        {validationStatus === 'VALID' && (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-600 text-white font-bold text-xs uppercase tracking-wide">
            <CheckCircle2 className="w-4 h-4" />
            {statusMessage || 'Valid Input Verified'}
          </span>
        )}
        {validationStatus === 'INVALID' && (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-rose-600 text-white font-bold text-xs uppercase tracking-wide animate-pulse">
            <AlertCircle className="w-4 h-4" />
            {statusMessage || 'Edge Case / Validation Failure'}
          </span>
        )}
        {validationStatus === 'NEUTRAL' && (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-700 text-slate-300 font-medium text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Ready for Live Entry
          </span>
        )}
      </div>
    </div>
  );
};
