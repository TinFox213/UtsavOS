// src/components/timeline/CountdownTab.tsx
import React from 'react';
import { TimelineMilestone } from '../../types/event';

interface CountdownTabProps {
  milestones: TimelineMilestone[];
  onToggleMilestone: (id: string) => void;
}

/**
 * Long-range CPM countdown roadmap listing backward-scheduled milestones.
 */
export const CountdownTab: React.FC<CountdownTabProps> = ({
  milestones,
  onToggleMilestone,
}) => {
  return (
    <div id="panel-roadmap" role="tabpanel" aria-labelledby="tab-roadmap" className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
      <h3 className="font-bold text-sm text-slate-800">CPM Backward Pass Milestones</h3>
      <div className="space-y-3">
        {milestones.map((m) => {
          const isDone = m.status === 'COMPLETED';
          return (
            <div
              key={m.id}
              className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 transition-all ${
                isDone ? 'bg-emerald-50/50 border-emerald-300' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  id={`milestone-${m.id}`}
                  type="checkbox"
                  checked={isDone}
                  aria-label={`Mark milestone ${m.title} as ${isDone ? 'incomplete' : 'complete'}`}
                  onChange={() => onToggleMilestone(m.id)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <label htmlFor={`milestone-${m.id}`} className="cursor-pointer">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-mono">
                      {m.phaseLabel}
                    </span>
                    <span className={`font-bold text-sm ${isDone ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                      {m.title}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Owner: {m.owner} • Check: {m.deliverableCheck}
                  </div>
                </label>
              </div>

              <span className="text-xs font-mono font-bold text-slate-600 shrink-0">
                Due: {m.dueDateIso}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
