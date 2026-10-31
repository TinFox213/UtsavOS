# Phase 13: Step 3 & Step 4 UI — 60 FPS Budget Studio & CPM Timeline with Crisis Simulator

**Phase Number:** 13 of 15  
**Document ID:** `Phase_13_Budget_Studio_CPM_Timeline_Crisis_Simulator`  
**Target Code Modules:** `src/components/BudgetStudioView.tsx`, `src/components/TimelineView.tsx`  
**Parent Specs:** [Doc 02: Math Engine Spec](file:///e:/Promptwars%20-%20Challenge%205/Docs/02_Deterministic_Budget_Timeline_and_Vendor_Math_Engine_Spec.md), [Doc 04: UI/UX Design System](file:///e:/Promptwars%20-%20Challenge%205/Docs/04_UI_UX_Design_System_Interactive_Views_and_WCAG_Accessibility_Spec.md), [Doc 09: Video Script](file:///e:/Promptwars%20-%20Challenge%205/Docs/09_Under_4_Minute_Demo_Video_Script_Live_Test_Data_and_Submission_Checklist.md)

---

## 1. Architectural Objectives & Rubric Mapping

Phase 13 delivers the interactive operational center of AuraPlan AI (UtsavOS): **Step 3 (Budget Studio)** with 60 FPS lock-and-rebalance sliders and the Critical Deficit alert banner, and **Step 4 (Timeline & Run-of-Show)** with interactive crisis delay simulation (`+45m Caterer Delay`, `Sudden Rain Alert`) demonstrating real-time schedule ripple effects.

| Evaluation Rubric Pillar | Phase 13 Engineering Control |
| :--- | :--- |
| **Efficiency (60 FPS Sliders)** | Category slider drag operations rebalance the remaining 11 categories proportionally in `<16ms` with zero UI lag. |
| **Domain Edge-Case Handling** | Displays prominent Red Per-Capita Deficit diagnostic banner with a 1-click **"Optimize Budget with Gemini AI"** button. |
| **Crisis Resilience (Video Sec 4)** | Interactive delay buttons trigger `applyTimelineDelay()`, ripple-shifting dependent slots and flagging curfew conflicts in real time. |

---

## 2. Prerequisites & Input State

- Completed Phase 05 (`src/shared/budgetEngine.ts`) and Phase 06 (`src/shared/timelineEngine.ts`).
- Workspace targets: `src/components/BudgetStudioView.tsx` and `src/components/TimelineView.tsx`.

---

## 3. Detailed Technical Specification & File Blueprints

### 3.1 File: `src/components/BudgetStudioView.tsx`
60 FPS lock-and-rebalance budget sliders and deficit rescue banner:

```tsx
// src/components/BudgetStudioView.tsx
import React from 'react';
import {
  Lock,
  Unlock,
  AlertOctagon,
  Sparkles,
  ShieldAlert,
  Percent,
} from 'lucide-react';
import { BudgetSummary, VendorCategoryKey } from '../types/event';
import { rebalanceBudget } from '../shared/budgetEngine';

export interface BudgetStudioViewProps {
  budget: BudgetSummary;
  currency: string;
  guestCount: number;
  onUpdateBudget: (updated: BudgetSummary) => void;
  onTriggerAIOptimizer: () => void;
}

export const BudgetStudioView: React.FC<BudgetStudioViewProps> = ({
  budget,
  currency,
  guestCount,
  onUpdateBudget,
  onTriggerAIOptimizer,
}) => {
  const handleSliderChange = (key: VendorCategoryKey, newAmount: number) => {
    const updated = rebalanceBudget(budget, key, newAmount);
    onUpdateBudget(updated);
  };

  const handleToggleLock = (key: VendorCategoryKey) => {
    const updatedCategories = budget.categories.map((c) =>
      c.key === key ? { ...c, isLocked: !c.isLocked } : c
    );
    onUpdateBudget({ ...budget, categories: updatedCategories });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Step 3: 12-Category Interactive Budget Studio
          </h2>
          <p className="text-xs text-slate-500">
            Lock any category and drag other sliders. Unlocked categories rebalance proportionally in &lt;16ms at 60 FPS.
          </p>
        </div>

        <button
          type="button"
          onClick={onTriggerAIOptimizer}
          className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Optimize Budget with Gemini AI</span>
        </button>
      </div>

      {/* Critical Deficit Alert Banner (TC-05) */}
      {budget.feasibilityStatus === 'CRITICAL_DEFICIT' && (
        <div className="bg-rose-50 border-2 border-rose-500 rounded-2xl p-4 sm:p-5 flex flex-wrap items-start justify-between gap-4 animate-pulse">
          <div className="flex items-start gap-3 max-w-2xl">
            <AlertOctagon className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-black text-rose-900 text-sm tracking-tight">
                CRITICAL PER-CAPITA DEFICIT DETECTED
              </h3>
              <p className="text-xs text-rose-800 mt-1 leading-relaxed">
                Your budget of <span className="font-bold">{currency} {budget.totalBudget.toLocaleString()}</span> for{' '}
                <span className="font-bold">{guestCount} guests</span> provides only{' '}
                <span className="font-bold">{currency} {budget.perCapitaActual}/guest</span>, which is below the minimum viable floor of{' '}
                <span className="font-bold">{currency} {budget.perCapitaMinimumViable}/guest</span>. Shortfall:{' '}
                <span className="font-bold">{currency} {budget.deficitAmount.toLocaleString()}</span>.
              </p>
              <div className="mt-2 text-xs font-semibold text-rose-700">
                Recommended: Increase budget to <span className="underline">{currency} {(guestCount * budget.perCapitaMinimumViable).toLocaleString()}</span> OR limit guests to <span className="underline">{budget.maxViableGuestsAtCurrentBudget} guests</span>.
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onTriggerAIOptimizer}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs shrink-0"
          >
            Run Gemini Value-Engineering Rescue
          </button>
        </div>
      )}

      {/* Reserves Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
          <div className="text-[11px] font-bold uppercase text-slate-500">Net Allocatable Budget</div>
          <div className="text-lg font-black text-indigo-700 tabular-nums mt-0.5">
            {currency} {budget.netAllocatableBudget.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500">82% available pool</div>
        </div>
        <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
          <div className="text-[11px] font-bold uppercase text-slate-500">Contingency Reserve (8%)</div>
          <div className="text-lg font-black text-amber-700 tabular-nums mt-0.5">
            {currency} {budget.contingencyReserve.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500">Locked against emergencies</div>
        </div>
        <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
          <div className="text-[11px] font-bold uppercase text-slate-500">Estimated GST / Tax (10%)</div>
          <div className="text-lg font-black text-slate-700 tabular-nums mt-0.5">
            {currency} {budget.estimatedTaxReserve.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500">Blended tax shield</div>
        </div>
      </div>

      {/* 12 Category Sliders */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
        <h3 className="font-bold text-sm text-slate-800">12 Expense Allocations with Lock Protection</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {budget.categories.map((cat) => {
            const percent = ((cat.allocatedAmount / budget.netAllocatableBudget) * 100).toFixed(1);
            return (
              <div
                key={cat.key}
                className={`p-3.5 rounded-xl border transition-all ${
                  cat.isLocked ? 'border-amber-400 bg-amber-50/40' : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleLock(cat.key)}
                      title={cat.isLocked ? 'Unlock category' : 'Lock category amount'}
                      className={`p-1.5 rounded-md ${
                        cat.isLocked ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-400 hover:text-slate-700'
                      }`}
                    >
                      {cat.isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                    </button>
                    <span className="font-bold text-xs text-slate-800 truncate max-w-[180px]">
                      {cat.label}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="font-extrabold text-sm text-slate-900 tabular-nums">
                      {currency} {cat.allocatedAmount.toLocaleString()}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400 ml-1.5 tabular-nums">
                      ({percent}%)
                    </span>
                  </div>
                </div>

                {/* Range Slider */}
                <input
                  type="range"
                  min={0}
                  max={budget.netAllocatableBudget}
                  step={500}
                  disabled={cat.isLocked}
                  value={cat.allocatedAmount}
                  onChange={(e) => handleSliderChange(cat.key, Number(e.target.value))}
                  className="w-full accent-indigo-600 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                />

                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                  <span>Per guest: {currency} {cat.perCapitaAmount}</span>
                  <span>{cat.rationale}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
```

### 3.2 File: `src/components/TimelineView.tsx`
Dual-tab CPM countdown milestones and minute-by-minute Run-of-Show with live crisis delay simulation:

```tsx
// src/components/TimelineView.tsx
import React, { useState } from 'react';
import {
  CalendarClock,
  Clock,
  AlertTriangle,
  Play,
  RotateCcw,
  CloudRain,
  UserCheck,
  CheckCircle2,
} from 'lucide-react';
import { TimelineMilestone, RunOfShowSlot, EventArchetype } from '../types/event';
import { applyTimelineDelay } from '../shared/timelineEngine';

export interface TimelineViewProps {
  archetype: EventArchetype;
  milestones: TimelineMilestone[];
  runOfShow: RunOfShowSlot[];
  onUpdateRunOfShow: (updated: RunOfShowSlot[]) => void;
  onUpdateMilestones: (updated: TimelineMilestone[]) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  archetype,
  milestones,
  runOfShow,
  onUpdateRunOfShow,
  onUpdateMilestones,
}) => {
  const [activeTab, setActiveTab] = useState<'ROADMAP' | 'RUN_OF_SHOW'>('RUN_OF_SHOW');
  const [crisisAlert, setCrisisAlert] = useState<string | null>(null);

  const handleApplyDelay = (nodeId: string, delayMins: number, scenarioLabel: string) => {
    const updated = applyTimelineDelay(runOfShow, nodeId, delayMins);
    onUpdateRunOfShow(updated);
    setCrisisAlert(`Live Crisis Injected: ${scenarioLabel} (+${delayMins} mins applied). Dependent slots shifted.`);
  };

  const handleToggleMilestone = (id: string) => {
    const updated = milestones.map((m) =>
      m.id === id
        ? { ...m, status: (m.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED') as TimelineMilestone['status'] }
        : m
    );
    onUpdateMilestones(updated);
  };

  const formatMinutesToTime = (totalMinutes: number): string => {
    const hrs = Math.floor(totalMinutes / 60) % 24;
    const mins = totalMinutes % 60;
    const ampm = hrs >= 12 ? 'PM' : 'AM';
    const displayHrs = hrs % 12 === 0 ? 12 : hrs % 12;
    const displayMins = mins < 10 ? `0${mins}` : mins;
    return `${displayHrs}:${displayMins} ${ampm}`;
  };

  return (
    <div className="space-y-6">
      {/* Header & Dual-Tab Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Step 4: Critical Path Timeline & Minute-by-Minute Run-of-Show
          </h2>
          <p className="text-xs text-slate-500">
            Switch between long-range countdown milestones and event-day execution with real-time delay simulation.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab('ROADMAP')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'ROADMAP' ? 'bg-white shadow-xs text-indigo-700' : 'text-slate-600'
            }`}
          >
            Countdown Roadmap (T-180d)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('RUN_OF_SHOW')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'RUN_OF_SHOW' ? 'bg-white shadow-xs text-indigo-700' : 'text-slate-600'
            }`}
          >
            Event Day Run-of-Show
          </button>
        </div>
      </div>

      {/* Live Crisis Delay Injection Bar */}
      {activeTab === 'RUN_OF_SHOW' && (
        <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <h3 className="font-extrabold text-sm tracking-tight">Live Crisis & Delay Simulator (Video Sec 4)</h3>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">Curfew Cutoff: 22:00 PM</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleApplyDelay('ros-w1', 45, 'Bridal Makeup / Floral Setup Delay')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-amber-300 flex items-center gap-1.5"
            >
              <Clock className="w-3.5 h-3.5" /> +45m HMU / Setup Delay
            </button>
            <button
              type="button"
              onClick={() => handleApplyDelay('ros-w4', 30, 'Catering Delivery Traffic Delay')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-amber-300 flex items-center gap-1.5"
            >
              <Clock className="w-3.5 h-3.5" /> +30m Caterer Delay
            </button>
            <button
              type="button"
              onClick={() => handleApplyDelay('ros-w5', 60, 'Outdoor Rain Contingency Shift')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-rose-300 flex items-center gap-1.5"
            >
              <CloudRain className="w-3.5 h-3.5" /> Sudden Rain Reroute (+60m)
            </button>
          </div>

          {crisisAlert && (
            <div className="p-2.5 rounded-lg bg-amber-500/20 text-amber-200 border border-amber-500/40 text-xs font-semibold">
              {crisisAlert}
            </div>
          )}
        </div>
      )}

      {/* Tab A: Macro Countdown Roadmap */}
      {activeTab === 'ROADMAP' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-sm text-slate-800">CPM Backward Pass Milestones</h3>
          <div className="space-y-3">
            {milestones.map((m) => {
              const isDone = m.status === 'COMPLETED';
              return (
                <div
                  key={m.id}
                  onClick={() => handleToggleMilestone(m.id)}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 cursor-pointer transition-all ${
                    isDone ? 'bg-emerald-50/50 border-emerald-300' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isDone}
                      onChange={() => handleToggleMilestone(m.id)}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-xs px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-mono">
                          {m.phaseLabel}
                        </span>
                        <span className={`font-bold text-sm ${isDone ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                          {m.title}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Owner: {m.owner} • Check: {m.deliverableCheck}
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-bold text-slate-600 shrink-0">
                    Due: {m.dueDateIso}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab B: Minute-by-Minute Run-of-Show */}
      {activeTab === 'RUN_OF_SHOW' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-sm text-slate-800">Event Day Minute-by-Minute Run-of-Show</h3>
          <div className="space-y-3">
            {runOfShow.map((slot) => {
              const endTimeMins = slot.startTimeMinutes + slot.durationMinutes;
              return (
                <div
                  key={slot.id}
                  className={`p-4 rounded-xl border transition-all ${
                    slot.hasCurfewConflict
                      ? 'bg-rose-50 border-2 border-rose-500'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-black text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
                        {formatMinutesToTime(slot.startTimeMinutes)} – {formatMinutesToTime(endTimeMins)}
                      </span>
                      <span className="font-bold text-sm text-slate-900">{slot.title}</span>
                    </div>

                    {slot.hasCurfewConflict && (
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white font-extrabold text-[11px] uppercase tracking-wide animate-pulse">
                        Curfew Conflict (&gt;22:00)
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
                    <div>
                      Owner: <span className="font-semibold text-slate-700">{slot.owner}</span> • Duration:{' '}
                      <span className="font-mono font-semibold text-slate-700">{slot.durationMinutes} mins</span> (Buffer: {slot.bufferMinutes}m)
                    </div>
                    {slot.delayAppliedMinutes > 0 && (
                      <span className="font-mono font-bold text-amber-600">
                        +{slot.delayAppliedMinutes}m delayed
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
```

---

## 4. Copy-Pasteable Antigravity Execution Prompt

```markdown
> **Antigravity Phase 13 Execution Prompt:**
> Build the 60 FPS Budget Studio and CPM Timeline with Crisis Simulator for AuraPlan AI (UtsavOS):
> 1. Create `src/components/BudgetStudioView.tsx`:
>    - 12 interactive category sliders with Lock toggles rebalancing proportionally in <16ms at 60 FPS.
>    - Red Per-Capita Deficit Alert banner triggering when $R_f < 0.90$ with exact deficit amount and 1-click "Run Gemini Value-Engineering Rescue" CTA button.
>    - Contingency (8%) and Tax (10%) reserve displays.
> 2. Create `src/components/TimelineView.tsx`:
>    - Dual-tab interface supporting Macro Countdown Roadmap (T-180d) and Minute-by-Minute Run-of-Show.
>    - Live Crisis Delay Simulator buttons (`+45m Setup Delay`, `+30m Caterer Delay`, `Sudden Rain Reroute`) calling `applyTimelineDelay()` with curfew conflict warnings.
> 3. Verify `npm run build` succeeds without errors.
```

---

## 5. Verification & Test Commands

### Automated Verification
```powershell
# Verify build succeeds with budget and timeline views
npm run build
```

### Manual Verification
1. Drag the Catering slider in Budget Studio to confirm other unlocked sliders update smoothly in real time.
2. In Timeline View, click `+45m HMU / Setup Delay` and confirm downstream slots shift forward in time.

---

## 6. Failure Modes & Recovery Protocol

- **Time Format Overflow past Midnight:** Enforce `formatMinutesToTime()` wraps modulo 24 hours so times past 24:00 PM display correctly as AM next day.
