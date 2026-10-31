// src/components/NavbarStepper.tsx
import React from 'react';
import {
  Sparkles,
  LayoutDashboard,
  Calculator,
  CalendarClock,
  ClipboardCheck,
  Cpu,
  Globe,
  SunMoon,
} from 'lucide-react';
import { CurrencyCode } from '../types/event';

export interface NavbarStepperProps {
  currentStep: number;
  onSelectStep: (step: number) => void;
  currency: CurrencyCode;
  onSelectCurrency: (c: CurrencyCode) => void;
  isHighContrast: boolean;
  onToggleHighContrast: () => void;
  onOpenXRay: () => void;
}

export const WORKFLOW_STEPS = [
  { id: 1, label: '1. Setup & Live Test', icon: Sparkles },
  { id: 2, label: '2. Dashboard', icon: LayoutDashboard },
  { id: 3, label: '3. Budget Studio', icon: Calculator },
  { id: 4, label: '4. Timeline', icon: CalendarClock },
  { id: 5, label: '5. Vendors', icon: ClipboardCheck },
  { id: 6, label: '6. GenAI Studio', icon: Cpu },
];

export const NavbarStepper: React.FC<NavbarStepperProps> = ({
  currentStep,
  onSelectStep,
  currency,
  onSelectCurrency,
  isHighContrast,
  onToggleHighContrast,
  onOpenXRay,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-10 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
            A
          </div>
          <div>
            <h1 className="font-extrabold text-base text-slate-900 tracking-tight leading-none flex items-center gap-1.5">
              AuraPlan AI <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-rose-100 text-rose-700">UtsavOS</span>
            </h1>
            <p className="text-[11px] text-slate-500 font-medium leading-none mt-0.5">
              Multimodal Celebration OS
            </p>
          </div>
        </div>

        {/* 6-Step Stepper Navigation */}
        <nav aria-label="Event Planning Workflow" className="hidden lg:flex items-center gap-1">
          {WORKFLOW_STEPS.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            return (
              <button
                key={step.id}
                onClick={() => onSelectStep(step.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
                aria-current={isActive ? 'step' : undefined}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{step.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Controls: Currency, High Contrast, Prompt X-Ray */}
        <div className="flex items-center gap-2">
          {/* Currency Select */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-bold">
            <Globe className="w-3.5 h-3.5 text-slate-500 ml-1" />
            {(['INR', 'USD', 'EUR', 'GBP'] as const).map((code) => (
              <button
                key={code}
                onClick={() => onSelectCurrency(code)}
                className={`px-1.5 py-0.5 rounded cursor-pointer ${
                  currency === code ? 'bg-white shadow-xs text-indigo-700' : 'text-slate-500'
                }`}
              >
                {code}
              </button>
            ))}
          </div>

          {/* High Contrast Toggle */}
          <button
            onClick={onToggleHighContrast}
            title={isHighContrast ? "High Contrast Enabled" : "Toggle WCAG High Contrast"}
            aria-label="Toggle High Contrast Mode"
            aria-pressed={isHighContrast}
            className={`p-1.5 rounded-lg border border-slate-200 cursor-pointer ${
              isHighContrast ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <SunMoon className="w-4 h-4" />
          </button>

          {/* Prompt X-Ray CTA */}
          <button
            onClick={onOpenXRay}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 shadow-xs cursor-pointer"
          >
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span>Prompt X-Ray</span>
          </button>
        </div>
      </div>
    </header>
  );
};
