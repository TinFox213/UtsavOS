# Phase 11: Navigation Stepper, WCAG 2.1 AA Shell, Accessibility & In-App Live Video QA Bar

**Phase Number:** 11 of 15  
**Document ID:** `Phase_11_Navigation_Stepper_WCAG_Accessibility_Live_QA_Bar`  
**Target Code Modules:** `src/index.css`, `src/components/NavbarStepper.tsx`, `src/components/LiveQATestBar.tsx`, `src/App.tsx`, `src/main.tsx`  
**Parent Specs:** [Doc 04: UI/UX Design System](file:///e:/Promptwars%20-%20Challenge%205/Docs/04_UI_UX_Design_System_Interactive_Views_and_WCAG_Accessibility_Spec.md), [Doc 07: Testing Specification](file:///e:/Promptwars%20-%20Challenge%205/Docs/07_Comprehensive_Testing_Specification_and_Live_Video_QA_Harness.md), [Doc 09: Video Script](file:///e:/Promptwars%20-%20Challenge%205/Docs/09_Under_4_Minute_Demo_Video_Script_Live_Test_Data_and_Submission_Checklist.md)

---

## 1. Architectural Objectives & Rubric Mapping

Phase 11 constructs the application shell, guided navigation stepper, accessibility infrastructure, and the **In-App Live Testing & Validation Inspector Bar**. This component is specifically engineered for **Video Submission Guide Section 2 ("Demonstrate Your Testing Process")**, providing an enlarged, high-visibility input mirror with real-time green/red validation badges so video judges can read typed characters like `john@invalid` and `-15000` effortlessly.

| Evaluation Rubric Pillar | Phase 11 Engineering Control |
| :--- | :--- |
| **Accessibility (WCAG 2.1 AA)** | Verified `>=4.5:1` contrast tokens, full keyboard shortcuts (`Alt+1` to `Alt+6`, `Alt+X`), semantic landmarks, and `aria-live="polite"` screen-reader announcers. |
| **Live Video Testing (Video Sec 2)** | Top persistent `LiveQATestBar.tsx` displays focused field values in 18px monospace with instant `VALID` (Emerald) vs `INVALID` (Crimson) badges. |
| **Efficiency & Layout Stability** | Monospace typography with `tabular-nums` enforced on financial and countdown counters to guarantee `CLS = 0.00`. |

---

## 2. Prerequisites & Input State

- Completed Phase 02 (Tailwind v4 configured) and Phase 04 (QuickFieldValidators).
- Workspace targets: `src/index.css`, `src/components/`, `src/App.tsx`, `src/main.tsx`.

---

## 3. Detailed Technical Specification & File Blueprints

### 3.1 File: `src/index.css`
Tailwind CSS v4 stylesheet with WCAG 2.1 AA tokens and tabular numbers:

```css
@import "tailwindcss";

@layer base {
  :root {
    --brand-primary: #4f46e5;
    --celebration-accent: #e11d48;
    --status-emerald: #047857;
    --status-amber: #92400e;
    --status-crimson: #b91c1c;
  }

  body {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
  }

  .tabular-nums {
    font-variant-numeric: tabular-nums;
    font-family: 'JetBrains Mono', monospace;
  }
}

/* High Contrast Mode Overrides */
body.high-contrast {
  --brand-primary: #1e1b4b;
  background-color: #ffffff !important;
  color: #000000 !important;
}

body.high-contrast button {
  border: 2px solid #000000 !important;
}
```

### 3.2 File: `src/components/LiveQATestBar.tsx`
Persistent top inspection banner for Video Section 2 live testing:

```tsx
// src/components/LiveQATestBar.tsx
import React from 'react';
import { ShieldCheck, AlertCircle, CheckCircle2, FlaskConical } from 'lucide-react';

export interface LiveQATestBarProps {
  activeField: string;
  activeValue: string | number;
  validationStatus: 'VALID' | 'INVALID' | 'NEUTRAL';
  statusMessage: string;
}

export const LiveQATestBar: React.FC<LiveQATestBarProps> = ({
  activeField,
  activeValue,
  validationStatus,
  statusMessage,
}) => {
  return (
    <div
      role="region"
      aria-label="Live Video QA & Validation Mirror Bar"
      className="sticky top-0 z-50 w-full bg-slate-900 text-white border-b-2 border-indigo-500 shadow-md px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-sm"
    >
      {/* Title & Badge */}
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-600 font-semibold text-xs tracking-wider uppercase">
          <FlaskConical className="w-3.5 h-3.5" /> Live Judge QA Bar
        </span>
        <span className="text-slate-400 hidden sm:inline text-xs">
          (Video Section 2 Testing Inspector)
        </span>
      </div>

      {/* Active Field & Value Mirror */}
      <div className="flex items-center gap-2 bg-slate-800/90 px-3 py-1 rounded-lg border border-slate-700">
        <span className="text-slate-400 text-xs uppercase font-medium">{activeField || 'Input'}:</span>
        <span className="font-mono text-base font-bold text-amber-300">
          {String(activeValue || '—')}
        </span>
      </div>

      {/* Reactive Status Badge */}
      <div className="flex items-center gap-2">
        {validationStatus === 'VALID' && (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-600 text-white font-bold text-xs uppercase tracking-wide">
            <CheckCircle2 className="w-4 h-4" />
            {statusMessage || 'Valid Input Verified'}
          </span>
        )}
        {validationStatus === 'INVALID' && (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-rose-600 text-white font-bold text-xs uppercase tracking-wide animate-pulse">
            <AlertCircle className="w-4 h-4" />
            {statusMessage || 'Edge Case / Validation Failure'}
          </span>
        )}
        {validationStatus === 'NEUTRAL' && (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-700 text-slate-300 font-medium text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Ready for Live Entry
          </span>
        )}
      </div>
    </div>
  );
};
```

### 3.3 File: `src/components/NavbarStepper.tsx`
6-step workflow stepper, currency selector, and accessibility toggles:

```tsx
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
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
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
                className={`px-1.5 py-0.5 rounded ${
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
            title="Toggle WCAG High Contrast"
            aria-label="Toggle High Contrast Mode"
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100"
          >
            <SunMoon className="w-4 h-4" />
          </button>

          {/* Prompt X-Ray CTA */}
          <button
            onClick={onOpenXRay}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 shadow-xs"
          >
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span>Prompt X-Ray</span>
          </button>
        </div>
      </div>
    </header>
  );
};
```

### 3.4 File: `src/App.tsx`
Main application shell coordinating steps, QA bar state, and keyboard shortcuts:

```tsx
// src/App.tsx
import React, { useState, useEffect } from 'react';
import { NavbarStepper } from './components/NavbarStepper';
import { LiveQATestBar } from './components/LiveQATestBar';
import { CurrencyCode, EventPlanState } from './types/event';
import { ARCHETYPE_PRESETS } from './data/archetypeSeeds';
import { calculateBudgetSummary } from './shared/budgetEngine';
import { generateCountdownMilestones, generateEventDayRunOfShow } from './shared/timelineEngine';
import { initializeVendorRecords } from './shared/vendorEngine';

export const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [currency, setCurrency] = useState<CurrencyCode>('INR');
  const [isHighContrast, setIsHighContrast] = useState<boolean>(false);
  const [isXRayOpen, setIsXRayOpen] = useState<boolean>(false);

  // Live QA Bar State for Video Section 2
  const [qaState, setQaState] = useState({
    activeField: 'Organizer Email',
    activeValue: 'john@example.com',
    validationStatus: 'VALID' as 'VALID' | 'INVALID' | 'NEUTRAL',
    statusMessage: 'Ready for live typing demonstration',
  });

  // Global Event State initialized with Preset #1
  const preset = ARCHETYPE_PRESETS[0]!;
  const [eventPlan, setEventPlan] = useState<EventPlanState>(() => {
    const budget = calculateBudgetSummary({
      totalBudget: preset.defaultBudget[currency],
      guestCount: preset.defaultGuestCount,
      archetype: preset.archetype,
      currency,
    });
    return {
      id: 'plan_initial',
      createdAtIso: new Date().toISOString(),
      updatedAtIso: new Date().toISOString(),
      organizer: {
        fullName: 'Arikaran P',
        email: 'john@example.com',
        phone: '+91 98765 43210',
        organizationOrFamily: 'Heritage Celebrations Committee',
      },
      archetype: preset.archetype,
      subType: preset.subType,
      eventName: preset.title,
      eventDateIso: '2026-12-18',
      city: preset.defaultLocation,
      currency,
      guestCount: preset.defaultGuestCount,
      dietary: {
        vegetarianPct: 70,
        veganPct: 10,
        jainPct: 15,
        halalPct: 0,
        glutenFreeCount: 12,
        nutAllergyCount: 6,
      },
      budget,
      milestones: generateCountdownMilestones({
        archetype: preset.archetype,
        eventDateIso: '2026-12-18',
      }),
      runOfShow: generateEventDayRunOfShow(preset.archetype),
      vendors: initializeVendorRecords(budget),
      aiRuns: [],
      customVibePrompt: preset.defaultVibePrompt,
    };
  });

  // Keyboard Shortcuts: Alt+1 to Alt+6 for steps, Alt+X for X-Ray
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && !isNaN(Number(e.key))) {
        const step = Number(e.key);
        if (step >= 1 && step <= 6) setCurrentStep(step);
      }
      if (e.altKey && (e.key === 'x' || e.key === 'X')) {
        setIsXRayOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={`min-h-screen flex flex-col bg-slate-50 ${isHighContrast ? 'high-contrast' : ''}`}>
      {/* Skip to Main Content Link for WCAG */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:bg-indigo-600 focus:text-white focus:px-3 focus:py-2 focus:rounded-md focus:z-50"
      >
        Skip to main content
      </a>

      {/* Persistent Live QA Bar */}
      <LiveQATestBar
        activeField={qaState.activeField}
        activeValue={qaState.activeValue}
        validationStatus={qaState.validationStatus}
        statusMessage={qaState.statusMessage}
      />

      {/* Main Workflow Header */}
      <NavbarStepper
        currentStep={currentStep}
        onSelectStep={setCurrentStep}
        currency={currency}
        onSelectCurrency={(c) => {
          setCurrency(c);
          setEventPlan((prev) => ({
            ...prev,
            currency: c,
            budget: calculateBudgetSummary({
              totalBudget: prev.budget.totalBudget,
              guestCount: prev.guestCount,
              archetype: prev.archetype,
              currency: c,
            }),
          }));
        }}
        isHighContrast={isHighContrast}
        onToggleHighContrast={() => setIsHighContrast((prev) => !prev)}
        onOpenXRay={() => setIsXRayOpen(true)}
      />

      {/* Dynamic Screen Container */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 min-h-[500px]">
          <h2 className="text-xl font-bold text-slate-800">
            Step {currentStep} Active: {WORKFLOW_STEPS.find((s) => s.id === currentStep)?.label}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Current Plan: <span className="font-semibold text-indigo-600">{eventPlan.eventName}</span> ({eventPlan.guestCount} guests | {eventPlan.currency} {eventPlan.budget.totalBudget.toLocaleString()})
          </p>
        </div>
      </main>

      {/* Live Region for Screen Readers */}
      <div aria-live="polite" className="sr-only">
        Active step changed to step {currentStep}.
      </div>
    </div>
  );
};
```

### 3.5 File: `src/main.tsx`
Standard React 19 entry point:

```tsx
// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

---

## 4. Copy-Pasteable Antigravity Execution Prompt

```markdown
> **Antigravity Phase 11 Execution Prompt:**
> Build the WCAG 2.1 AA application shell, navigation stepper, and Live Video QA Bar for AuraPlan AI (UtsavOS):
> 1. Create `src/index.css` importing Tailwind CSS v4 and declaring WCAG color tokens and `tabular-nums` formatting.
> 2. Create `src/components/LiveQATestBar.tsx` rendering the persistent 18px monospace input mirror and `VALID` vs `INVALID` status badges for live video testing.
> 3. Create `src/components/NavbarStepper.tsx` with 6-step guided navigation (`1. Setup & Live Test`, `2. Dashboard`, `3. Budget Studio`, `4. Timeline`, `5. Vendors`, `6. GenAI Studio`), currency selector (INR, USD, EUR, GBP), and high-contrast toggle.
> 4. Create `src/App.tsx` wiring state, keyboard shortcuts (`Alt+1` to `Alt+6`, `Alt+X`), and WCAG semantic landmarks.
> 5. Create `src/main.tsx` mounting `App`.
> 6. Verify `npm run build` passes with zero errors.
```

---

## 5. Verification & Test Commands

### Automated Verification
```powershell
# Type check and build UI shell
npx tsc --noEmit
npm run build
```

### Manual Verification
1. Open the application and confirm the top `LiveQATestBar` is persistently visible.
2. Press `Alt+1` through `Alt+6` to verify keyboard step switching.

---

## 6. Failure Modes & Recovery Protocol

- **Missing DOM Root Element:** Ensure `index.html` has `<div id="root"></div>`.
