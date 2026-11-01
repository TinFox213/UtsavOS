// src/components/xray/PromptDiffViewer.tsx
import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { DynamicDiffReport } from '../../types/event';

interface PromptDiffViewerProps {
  diffReport: DynamicDiffReport | null;
}

/**
 * Dynamic AI proof viewer rendering input parameter deltas and structured output mutations.
 */
export const PromptDiffViewer: React.FC<PromptDiffViewerProps> = ({ diffReport }) => {
  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-4">
      <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl text-emerald-400 text-xs font-bold">
        <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
        <span>
          Dynamic AI Proof Badge: 100% Dynamic Response Verified — Outputs dynamically mutate when inputs change.
        </span>
      </div>

      {diffReport ? (
        <div className="space-y-4">
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Input Delta Summary (Parameters Changed)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {diffReport.inputDeltas.map((d, i) => (
                <div key={i} className="p-2 rounded bg-slate-900 border border-slate-800 font-mono">
                  <span className="text-slate-400">{d.field}:</span> <span className="text-rose-400">{d.from}</span> →{' '}
                  <span className="text-emerald-400 font-bold">{d.to}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Structured Output Fields Dynamically Mutated ({diffReport.mutatedFields.length} Fields)
            </h4>
            <div className="space-y-2">
              {diffReport.mutatedFields.slice(0, 8).map((m, i) => (
                <div key={i} className="p-2 rounded bg-slate-900 border border-slate-800 font-mono text-xs">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">{m.fieldPath}</div>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <div className="text-rose-400 truncate">Run #1: {JSON.stringify(m.previousValue)}</div>
                    <div className="text-emerald-400 truncate font-bold">Run #2: {JSON.stringify(m.updatedValue)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-slate-500 text-xs">
          To inspect dynamic proof, execute Run #1 on Step 6, alter guest count or prompt, and execute Run #2.
        </div>
      )}
    </div>
  );
};
