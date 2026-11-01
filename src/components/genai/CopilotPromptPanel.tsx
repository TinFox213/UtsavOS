// src/components/genai/CopilotPromptPanel.tsx
import React from 'react';
import { Sparkles } from 'lucide-react';

interface CopilotPromptPanelProps {
  customPrompt: string;
  isLoading: boolean;
  onPromptChange: (val: string) => void;
  onSubmit: () => void;
}

/**
 * Textarea prompt entry and execution trigger for Gemini 2.5 Flash inference.
 */
export const CopilotPromptPanel: React.FC<CopilotPromptPanelProps> = ({
  customPrompt,
  isLoading,
  onPromptChange,
  onSubmit,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
      <label htmlFor="copilotPrompt" className="block text-xs font-bold text-slate-700">
        Injected Custom Vibe / Scenario Prompt for Gemini 2.5 Flash
      </label>
      <textarea
        id="copilotPrompt"
        rows={3}
        value={customPrompt}
        onChange={(e) => onPromptChange(e.target.value)}
        className="w-full text-base font-medium px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/20"
      />

      <div className="flex items-center justify-between">
        <span className="text-[11px] text-slate-400">
          Mathematical constraints & category caps are injected automatically.
        </span>

        <button
          type="button"
          disabled={isLoading}
          onClick={onSubmit}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold text-xs flex items-center gap-2 shadow-xs cursor-pointer"
        >
          {isLoading ? (
            <span>Running Gemini 2.5 Flash...</span>
          ) : (
            <>
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              <span>Execute Copilot & Inspect X-Ray</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
