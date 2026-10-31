// src/components/GenAIStudioView.tsx
import React, { useState } from 'react';
import {
  Sparkles,
  Palette,
  UtensilsCrossed,
  TrendingDown,
  Handshake,
  ShieldAlert,
  Cpu,
  LucideIcon,
} from 'lucide-react';
import { EventPlanState, CopilotMode, AIGenerationRun } from '../types/event';
import { requestAIGeneration } from '../services/geminiService';

export interface GenAIStudioViewProps {
  eventPlan: EventPlanState;
  onNewRunGenerated: (run: AIGenerationRun) => void;
  onOpenXRay: () => void;
}

export const COPILOT_CARDS: Array<{
  mode: CopilotMode;
  title: string;
  icon: LucideIcon;
  purpose: string;
}> = [
  {
    mode: 'THEME_AND_IDEAS',
    title: 'Personalized Theme & Decor Architect',
    icon: Palette,
    purpose: 'Translates abstract aesthetic vibes into budget-capped color palettes and signature zones.',
  },
  {
    mode: 'MENU_AND_CATERING',
    title: 'Multi-Dietary Menu & Quantity Planner',
    icon: UtensilsCrossed,
    purpose: 'Calculates dish courses with Jain/Vegan badges and exact ingredient weights.',
  },
  {
    mode: 'BUDGET_OPTIMIZER',
    title: 'Smart Budget Value-Engineering Optimizer',
    icon: TrendingDown,
    purpose: 'Resolves deficit warnings by proposing 3 surgical trade-offs with 1-click ledger application.',
  },
  {
    mode: 'VENDOR_NEGOTIATOR',
    title: 'Vendor RFP & Negotiation Negotiator',
    icon: Handshake,
    purpose: 'Generates ready-to-copy WhatsApp messages and flags contract red flags (overtime fees).',
  },
  {
    mode: 'CRISIS_SIMULATOR',
    title: 'Live Crisis & Weather Rescue Simulator',
    icon: ShieldAlert,
    purpose: 'Generates emergency protocols when rain occurs or caterer is delayed by 45 minutes.',
  },
];

export const GenAIStudioView: React.FC<GenAIStudioViewProps> = ({
  eventPlan,
  onNewRunGenerated,
  onOpenXRay,
}) => {
  const [selectedMode, setSelectedMode] = useState<CopilotMode>('THEME_AND_IDEAS');
  const [customPrompt, setCustomPrompt] = useState<string>(eventPlan.customVibePrompt);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleRunCopilot = async () => {
    setIsLoading(true);
    const cateringCat = eventPlan.budget.categories.find((c) => c.key === 'CATERING_FNB');
    const decorCat = eventPlan.budget.categories.find((c) => c.key === 'DECOR_FLORAL');
    const venueCat = eventPlan.budget.categories.find((c) => c.key === 'VENUE_RENTAL');

    const run = await requestAIGeneration({
      copilotMode: selectedMode,
      eventType: eventPlan.archetype,
      subType: eventPlan.subType,
      eventName: eventPlan.eventName,
      guestCount: eventPlan.guestCount,
      totalBudget: eventPlan.budget.totalBudget,
      currency: eventPlan.currency,
      netAllocatableBudget: eventPlan.budget.netAllocatableBudget,
      cateringCap: cateringCat?.allocatedAmount || 0,
      decorCap: decorCat?.allocatedAmount || 0,
      venueCap: venueCat?.allocatedAmount || 0,
      location: eventPlan.city,
      userPrompt: customPrompt,
      dietaryAndCultural: eventPlan.dietary,
    });

    setIsLoading(false);
    onNewRunGenerated(run);
    onOpenXRay();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-indigo-100 text-indigo-700 text-xs font-black uppercase">
              Video Section 3 Showcase
            </span>
            <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Powered by Gemini 2.5 Flash
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1">
            Step 6: GenAI Personalization Studio & Copilots
          </h2>
          <p className="text-xs text-slate-500">
            Select a specialized Copilot to run real-time structured inference with Live Prompt X-Ray inspection.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenXRay}
          className="px-3.5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <Cpu className="w-4 h-4 text-emerald-400" />
          <span>Open Prompt X-Ray Drawer</span>
        </button>
      </div>

      {/* 5 Copilot Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {COPILOT_CARDS.map((card) => {
          const Icon = card.icon;
          const isSelected = selectedMode === card.mode;
          return (
            <div
              key={card.mode}
              onClick={() => setSelectedMode(card.mode)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-5 h-5 ${isSelected ? 'text-indigo-600' : 'text-slate-500'}`} />
                <h3 className="font-extrabold text-xs text-slate-900 leading-tight">{card.title}</h3>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">{card.purpose}</p>
            </div>
          );
        })}
      </div>

      {/* Prompt Input Box */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
        <label htmlFor="copilotPrompt" className="block text-xs font-bold text-slate-700">
          Injected Custom Vibe / Scenario Prompt for Gemini 2.5 Flash
        </label>
        <textarea
          id="copilotPrompt"
          rows={3}
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          className="w-full text-base font-medium px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/20"
        />

        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Mathematical constraints & category caps are injected automatically.
          </span>

          <button
            type="button"
            disabled={isLoading}
            onClick={handleRunCopilot}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold text-xs flex items-center gap-2 shadow-xs cursor-pointer"
          >
            {isLoading ? (
              <span>Running Gemini 2.5 Flash...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Execute Copilot & Inspect X-Ray</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
