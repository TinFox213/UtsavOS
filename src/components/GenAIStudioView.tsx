// src/components/GenAIStudioView.tsx
import React, { useState } from 'react';
import { Sparkles, Cpu } from 'lucide-react';
import { EventPlanState, CopilotMode, AIGenerationRun } from '../types/event';
import { requestAIGeneration } from '../services/geminiService';
import { CopilotModeSelector } from './genai/CopilotModeSelector';
import { CopilotPromptPanel } from './genai/CopilotPromptPanel';

export interface GenAIStudioViewProps {
  eventPlan: EventPlanState;
  onNewRunGenerated: (run: AIGenerationRun) => void;
  onOpenXRay: () => void;
}

/**
 * Step 6 GenAI Personalization Studio orchestrating 5 specialized Copilots
 * with Live Prompt X-Ray drawer synchronization.
 */
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
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-indigo-100 text-indigo-700 text-xs font-black uppercase">
              Video Section 3 Showcase
            </span>
            <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" /> Powered by Gemini 2.5 Flash
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
          <Cpu className="w-4 h-4 text-emerald-400" aria-hidden="true" />
          <span>Open Prompt X-Ray Drawer</span>
        </button>
      </div>

      <CopilotModeSelector selectedMode={selectedMode} onSelectMode={setSelectedMode} />

      <CopilotPromptPanel
        customPrompt={customPrompt}
        isLoading={isLoading}
        onPromptChange={setCustomPrompt}
        onSubmit={handleRunCopilot}
      />
    </div>
  );
};
