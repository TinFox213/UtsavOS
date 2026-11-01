// src/components/xray/TelemetryMetrics.tsx
import React from 'react';
import { Terminal, Sparkles } from 'lucide-react';
import { AIGenerationRun } from '../../types/event';

interface TelemetryMetricsProps {
  latestRun: AIGenerationRun | undefined;
}

/**
 * Split-screen inspector showing prompt dispatched (left pane) and structured JSON received (right pane).
 */
export const TelemetryMetrics: React.FC<TelemetryMetricsProps> = ({ latestRun }) => {
  return (
    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800 overflow-hidden">
      <div className="p-4 flex flex-col h-full overflow-hidden">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
          <Terminal className="w-3.5 h-3.5" aria-hidden="true" /> Prompt Going In (Left Pane)
        </div>
        <div className="flex-1 bg-slate-950 rounded-xl p-3.5 overflow-y-auto font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap border border-slate-800">
          {latestRun?.promptSent || 'No prompt dispatched yet. Run a copilot on Step 6.'}
        </div>
      </div>

      <div className="p-4 flex flex-col h-full overflow-hidden">
        <div className="flex items-center justify-between text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" /> Structured JSON Coming Out (Right Pane)
          </div>
          <span className="font-mono text-[10px] text-slate-500">application/json</span>
        </div>
        <div className="flex-1 bg-slate-950 rounded-xl p-3.5 overflow-y-auto font-mono text-xs text-emerald-400 leading-relaxed border border-slate-800">
          <pre>{JSON.stringify(latestRun?.structuredOutput || {}, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
};
