// src/components/genai/CopilotModeSelector.tsx
import React from 'react';
import {
  Palette,
  UtensilsCrossed,
  TrendingDown,
  Handshake,
  ShieldAlert,
  LucideIcon,
} from 'lucide-react';
import { CopilotMode } from '../../types/event';

export interface CopilotCardConfig {
  mode: CopilotMode;
  title: string;
  icon: LucideIcon;
  purpose: string;
}

export const COPILOT_CARDS: CopilotCardConfig[] = [
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

interface CopilotModeSelectorProps {
  selectedMode: CopilotMode;
  onSelectMode: (mode: CopilotMode) => void;
}

/**
 * 5 Copilot selector cards using semantic, keyboard-accessible button elements with aria-pressed.
 */
export const CopilotModeSelector: React.FC<CopilotModeSelectorProps> = ({
  selectedMode,
  onSelectMode,
}) => {
  return (
    <div role="group" aria-label="Copilot mission modes" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {COPILOT_CARDS.map((card) => {
        const Icon = card.icon;
        const isSelected = selectedMode === card.mode;
        return (
          <button
            type="button"
            key={card.mode}
            aria-pressed={isSelected}
            onClick={() => onSelectMode(card.mode)}
            className={`p-4 rounded-xl border-2 text-left cursor-pointer transition-all ${
              isSelected
                ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`w-5 h-5 ${isSelected ? 'text-indigo-600' : 'text-slate-500'}`} aria-hidden="true" />
              <h3 className="font-extrabold text-xs text-slate-900 leading-tight">{card.title}</h3>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">{card.purpose}</p>
          </button>
        );
      })}
    </div>
  );
};
