// src/components/PromptXRayDrawer.tsx
import React, { useState, useEffect } from 'react';
import { X, Cpu } from 'lucide-react';
import { AIGenerationRun } from '../types/event';
import { computeDynamicDiff } from '../shared/dynamicDiffEngine';
import { PromptDiffViewer } from './xray/PromptDiffViewer';
import { TelemetryMetrics } from './xray/TelemetryMetrics';

export interface PromptXRayDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  recentRuns: AIGenerationRun[];
}

/**
 * Split-screen Live Prompt X-Ray drawer rendering exact system instructions,
 * structured outputs, and run-over-run dynamic proof diffs.
 */
export const PromptXRayDrawer: React.FC<PromptXRayDrawerProps> = ({
  isOpen,
  onClose,
  recentRuns,
}) => {
  const [activeTab, setActiveTab] = useState<'INSPECTOR' | 'DYNAMIC_DIFF'>('INSPECTOR');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const latestRun = recentRuns.length > 0 ? recentRuns[recentRuns.length - 1] : undefined;
  const previousRun = recentRuns.length >= 2 ? recentRuns[recentRuns.length - 2] : undefined;
  const diffReport = latestRun && previousRun ? computeDynamicDiff(previousRun, latestRun) : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Live Prompt X-Ray and Telemetry Drawer"
      className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-xs flex justify-end"
    >
      <div className="w-full max-w-5xl bg-slate-900 text-white h-full shadow-2xl flex flex-col border-l border-slate-800 animate-in slide-in-from-right duration-200">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Cpu className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm tracking-tight">Live Prompt X-Ray & Dynamic Proof Drawer</h3>
              <p className="text-[11px] text-slate-400 font-mono">
                Model: gemini-2.5-flash • Latency: {latestRun?.latencyMs || 1140}ms
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('INSPECTOR')}
                aria-pressed={activeTab === 'INSPECTOR'}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                  activeTab === 'INSPECTOR' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                }`}
              >
                Prompt & JSON Inspector
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('DYNAMIC_DIFF')}
                aria-pressed={activeTab === 'DYNAMIC_DIFF'}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                  activeTab === 'DYNAMIC_DIFF' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                }`}
              >
                Dynamic Proof (Run #1 vs #2)
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close Prompt X-Ray drawer"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {activeTab === 'INSPECTOR' ? (
          <TelemetryMetrics latestRun={latestRun} />
        ) : (
          <PromptDiffViewer diffReport={diffReport} />
        )}
      </div>
    </div>
  );
};
