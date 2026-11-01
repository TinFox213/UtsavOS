// src/components/dashboard/StudioNavCards.tsx
import React from 'react';
import { ArrowRight } from 'lucide-react';

interface StudioNavCardsProps {
  onNavigateTab: (step: number) => void;
}

/**
 * Quick operational studio navigation bar with semantic button elements.
 */
export const StudioNavCards: React.FC<StudioNavCardsProps> = ({ onNavigateTab }) => {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h4 className="font-bold text-sm text-slate-800">Operational Studios</h4>
        <p className="text-xs text-slate-500">Jump directly into fine-tuning allocations, timeline crisis simulations, or AI copilots.</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onNavigateTab(3)}
          className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-bold flex items-center gap-1 cursor-pointer"
        >
          <span>Budget Studio</span> <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => onNavigateTab(4)}
          className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-bold flex items-center gap-1 cursor-pointer"
        >
          <span>Timeline & Crises</span> <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => onNavigateTab(6)}
          className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
        >
          <span>GenAI Studio</span> <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};
