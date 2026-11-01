// src/components/timeline/RunOfShowTab.tsx
import React from 'react';
import { RunOfShowSlot } from '../../types/event';

interface RunOfShowTabProps {
  runOfShow: RunOfShowSlot[];
}

function formatMinutesToTime(totalMinutes: number): string {
  const hrs = Math.floor(totalMinutes / 60) % 24;
  const mins = totalMinutes % 60;
  const ampm = hrs >= 12 ? 'PM' : 'AM';
  const displayHrs = hrs % 12 === 0 ? 12 : hrs % 12;
  const displayMins = mins < 10 ? `0${mins}` : mins;
  return `${displayHrs}:${displayMins} ${ampm}`;
}

/**
 * Minute-by-minute event-day run-of-show schedule with curfew conflict warnings.
 */
export const RunOfShowTab: React.FC<RunOfShowTabProps> = ({ runOfShow }) => {
  return (
    <div id="panel-ros" role="tabpanel" aria-labelledby="tab-ros" className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
      <h3 className="font-bold text-sm text-slate-800">Event Day Minute-by-Minute Run-of-Show</h3>
      <div className="space-y-3">
        {runOfShow.map((slot) => {
          const endTimeMins = slot.startTimeMinutes + slot.durationMinutes;
          return (
            <div
              key={slot.id}
              className={`p-4 rounded-xl border transition-all ${
                slot.hasCurfewConflict
                  ? 'bg-rose-50 border-2 border-rose-500'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-black text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
                    {formatMinutesToTime(slot.startTimeMinutes)} – {formatMinutesToTime(endTimeMins)}
                  </span>
                  <span className="font-bold text-sm text-slate-900">{slot.title}</span>
                </div>

                {slot.hasCurfewConflict && (
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white font-extrabold text-[11px] uppercase tracking-wide animate-pulse">
                    Curfew Conflict (&gt;22:00)
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
                <div>
                  Owner: <span className="font-semibold text-slate-700">{slot.owner}</span> • Duration:{' '}
                  <span className="font-mono font-semibold text-slate-700">{slot.durationMinutes} mins</span> (Buffer: {slot.bufferMinutes}m)
                </div>
                {slot.delayAppliedMinutes > 0 && (
                  <span className="font-mono font-bold text-amber-600">
                    +{slot.delayAppliedMinutes}m delayed
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
