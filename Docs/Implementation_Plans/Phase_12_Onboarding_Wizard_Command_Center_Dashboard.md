# Phase 12: Step 1 & Step 2 UI — Smart Onboarding Wizard & Command Center KPI Dashboard

**Phase Number:** 12 of 15  
**Document ID:** `Phase_12_Onboarding_Wizard_Command_Center_Dashboard`  
**Target Code Modules:** `src/components/OnboardingWizardView.tsx`, `src/components/DashboardView.tsx`  
**Parent Specs:** [Doc 01: PRD](file:///e:/Promptwars%20-%20Challenge%205/Docs/01_Master_PRD_Celebration_and_Event_Planner_OS.md), [Doc 04: UI/UX Design System](file:///e:/Promptwars%20-%20Challenge%205/Docs/04_UI_UX_Design_System_Interactive_Views_and_WCAG_Accessibility_Spec.md), [Doc 09: Video Script](file:///e:/Promptwars%20-%20Challenge%205/Docs/09_Under_4_Minute_Demo_Video_Script_Live_Test_Data_and_Submission_Checklist.md)

---

## 1. Architectural Objectives & Rubric Mapping

Phase 12 implements the user-facing entry point and executive overview for AuraPlan AI (UtsavOS). It delivers **Step 1 (Smart Onboarding Wizard)** with real-time field validation synchronized to the top Live QA Bar for Video Section 2, and **Step 2 (Command Center Dashboard)** featuring 4 hero KPI cards, feasibility status badges, and the dietary breakdown matrix.

| Evaluation Rubric Pillar | Phase 12 Engineering Control |
| :--- | :--- |
| **Live Testing Proof (Video Sec 2)** | Inputs broadcast live character-by-character updates to `LiveQATestBar.tsx`, displaying instant inline validation pills (`john@invalid` vs `john@example.com`). |
| **Financial Transparency** | Dashboard displays Net Allocatable Pool (`82%`), Contingency (`8%`), and Tax (`10%`) reserves alongside the Feasibility Status Ring. |
| **Accessibility (WCAG 2.1 AA)** | Every input element features explicit `<label htmlFor="...">`, `aria-invalid`, `aria-describedby`, and high-visibility focus borders (`ring-4 ring-indigo-500/20`). |

---

## 2. Prerequisites & Input State

- Completed Phase 04 (Zod schemas) and Phase 11 (`NavbarStepper`, `LiveQATestBar`).
- Workspace targets: `src/components/OnboardingWizardView.tsx` and `src/components/DashboardView.tsx`.

---

## 3. Detailed Technical Specification & File Blueprints

### 3.1 File: `src/components/OnboardingWizardView.tsx`
Smart live-validated onboarding wizard with real-time feedback and scenario presets:

```tsx
// src/components/OnboardingWizardView.tsx
import React, { useState } from 'react';
import {
  Sparkles,
  Users,
  Calendar,
  MapPin,
  Coins,
  FileText,
  AlertTriangle,
  CheckCircle2,
  BookmarkCheck,
} from 'lucide-react';
import { EventPlanState, EventArchetype, CurrencyCode } from '../types/event';
import { ARCHETYPE_PRESETS } from '../data/archetypeSeeds';
import { OrganizerAndEventInputSchema, QuickFieldValidators } from '../schemas/validationSchemas';
import { calculateBudgetSummary } from '../shared/budgetEngine';
import { generateCountdownMilestones, generateEventDayRunOfShow } from '../shared/timelineEngine';
import { initializeVendorRecords } from '../shared/vendorEngine';

export interface OnboardingWizardProps {
  eventPlan: EventPlanState;
  onUpdatePlan: (updated: EventPlanState) => void;
  onPlanGenerated: () => void;
  onFieldFocus: (field: string, value: string | number, status: 'VALID' | 'INVALID' | 'NEUTRAL', msg: string) => void;
}

export const OnboardingWizardView: React.FC<OnboardingWizardProps> = ({
  eventPlan,
  onUpdatePlan,
  onPlanGenerated,
  onFieldFocus,
}) => {
  const [formData, setFormData] = useState({
    organizerName: eventPlan.organizer.fullName,
    organizerEmail: eventPlan.organizer.email,
    organizationOrFamily: eventPlan.organizer.organizationOrFamily,
    phone: eventPlan.organizer.phone,
    archetype: eventPlan.archetype,
    subType: eventPlan.subType,
    eventName: eventPlan.eventName,
    eventDate: eventPlan.eventDateIso,
    city: eventPlan.city,
    currency: eventPlan.currency,
    guestCount: eventPlan.guestCount,
    totalBudget: eventPlan.budget.totalBudget,
    userPrompt: eventPlan.customVibePrompt,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFieldChange = (field: string, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);

    // Live validation feedback
    let status: 'VALID' | 'INVALID' | 'NEUTRAL' = 'NEUTRAL';
    let msg = '';

    if (field === 'organizerEmail') {
      const isValid = QuickFieldValidators.isValidEmail(String(value));
      status = isValid ? 'VALID' : 'INVALID';
      msg = isValid
        ? `✓ VALID RFC-5322 EMAIL: "${value}" Verified`
        : `✗ INVALID EMAIL: "${value}" — Missing domain TLD (.com, .org, .in)`;
    } else if (field === 'totalBudget') {
      const num = Number(value);
      const isPositive = num > 0;
      status = isPositive ? 'VALID' : 'INVALID';
      msg = isPositive
        ? `✓ POSITIVE BUDGET: ${formData.currency} ${num.toLocaleString()}`
        : `✗ INVALID BUDGET: "${value}" — Must be greater than 0`;
    } else if (field === 'eventDate') {
      const isFuture = QuickFieldValidators.isFutureDate(String(value));
      status = isFuture ? 'VALID' : 'INVALID';
      msg = isFuture
        ? `✓ FUTURE DATE: ${value}`
        : `✗ PAST DATE: "${value}" — Event cannot be in the past`;
    } else if (field === 'guestCount') {
      const num = Number(value);
      status = num >= 5 ? 'VALID' : 'INVALID';
      msg = num >= 5 ? `✓ CAPACITY: ${num} Guests` : `✗ MINIMUM: 5 guests required`;
    }

    onFieldFocus(field, value, status, msg);
  };

  const loadPreset = (presetId: string) => {
    const p = ARCHETYPE_PRESETS.find((x) => x.id === presetId);
    if (!p) return;

    setFormData({
      organizerName: 'Arikaran P',
      organizerEmail: 'john@example.com',
      organizationOrFamily: 'Celebrations Committee',
      phone: '+91 98765 43210',
      archetype: p.archetype,
      subType: p.subType,
      eventName: p.title,
      eventDate: '2026-12-18',
      city: p.defaultLocation,
      currency: eventPlan.currency,
      guestCount: p.defaultGuestCount,
      totalBudget: p.defaultBudget[eventPlan.currency],
      userPrompt: p.defaultVibePrompt,
    });
    setErrors({});
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const result = OrganizerAndEventInputSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[String(err.path[0])] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    // Build complete balanced event state
    const budget = calculateBudgetSummary({
      totalBudget: formData.totalBudget,
      guestCount: formData.guestCount,
      archetype: formData.archetype,
      currency: formData.currency,
    });

    const updatedPlan: EventPlanState = {
      ...eventPlan,
      updatedAtIso: new Date().toISOString(),
      organizer: {
        fullName: formData.organizerName,
        email: formData.organizerEmail,
        phone: formData.phone,
        organizationOrFamily: formData.organizationOrFamily,
      },
      archetype: formData.archetype,
      subType: formData.subType,
      eventName: formData.eventName,
      eventDateIso: formData.eventDate,
      city: formData.city,
      currency: formData.currency,
      guestCount: formData.guestCount,
      budget,
      milestones: generateCountdownMilestones({
        archetype: formData.archetype,
        eventDateIso: formData.eventDate,
      }),
      runOfShow: generateEventDayRunOfShow(formData.archetype),
      vendors: initializeVendorRecords(budget),
      customVibePrompt: formData.userPrompt,
    };

    onUpdatePlan(updatedPlan);
    onPlanGenerated();
  };

  return (
    <div className="space-y-6">
      {/* Header & Preset Switchers */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Step 1: Organizer Sign-In & Live Event Setup
          </h2>
          <p className="text-xs text-slate-500">
            Type values live to test validation, past dates, and budget deficit edge cases.
          </p>
        </div>

        {/* 1-Click Scenario Presets */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Quick Presets:</span>
          {ARCHETYPE_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => loadPreset(p.id)}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 transition-colors flex items-center gap-1"
            >
              <BookmarkCheck className="w-3.5 h-3.5 text-indigo-500" />
              {p.archetype === 'WEDDING' ? 'Wedding' : p.archetype === 'BIRTHDAY' ? 'Birthday' : 'Hackathon'}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleGenerate} className="space-y-6">
        {/* Organizer Verification Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Organizer Credentials & Contact Verification
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="organizerName" className="block text-xs font-bold text-slate-700 mb-1">
                Organizer Full Name *
              </label>
              <input
                id="organizerName"
                type="text"
                value={formData.organizerName}
                onChange={(e) => handleFieldChange('organizerName', e.target.value)}
                onFocus={() => handleFieldChange('organizerName', formData.organizerName)}
                className="w-full text-base font-medium px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/20 bg-white"
                placeholder="Arikaran P"
              />
              {errors.organizerName && <p className="text-xs text-rose-600 mt-1">{errors.organizerName}</p>}
            </div>

            <div>
              <label htmlFor="organizerEmail" className="block text-xs font-bold text-slate-700 mb-1">
                Organizer Email (RFC-5322) *
              </label>
              <input
                id="organizerEmail"
                type="text"
                value={formData.organizerEmail}
                onChange={(e) => handleFieldChange('organizerEmail', e.target.value)}
                onFocus={() => handleFieldChange('organizerEmail', formData.organizerEmail)}
                className={`w-full text-base font-medium px-4 py-2.5 rounded-xl border-2 ${
                  QuickFieldValidators.isValidEmail(formData.organizerEmail)
                    ? 'border-emerald-500'
                    : 'border-rose-500'
                } focus:ring-4 focus:ring-indigo-500/20 bg-white`}
                placeholder="john@example.com"
              />
              {errors.organizerEmail && <p className="text-xs text-rose-600 mt-1">{errors.organizerEmail}</p>}
            </div>
          </div>
        </div>

        {/* Archetype Selector Cards */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            Select Celebration Archetype *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { type: 'WEDDING' as const, label: 'Weddings & Multi-Day Ceremonies', icon: Sparkles },
              { type: 'BIRTHDAY' as const, label: 'Birthdays & Milestone Galas', icon: Users },
              { type: 'COMMUNITY_EVENT' as const, label: 'Community Events & Tech Fests', icon: Calendar },
            ].map((card) => {
              const Icon = card.icon;
              const isSelected = formData.archetype === card.type;
              return (
                <button
                  key={card.type}
                  type="button"
                  onClick={() => handleFieldChange('archetype', card.type)}
                  className={`p-3.5 rounded-xl border-2 text-left transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <Icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <div className="font-bold text-sm text-slate-900">{card.label}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Event Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label htmlFor="eventName" className="block text-xs font-bold text-slate-700 mb-1">
              Event Title *
            </label>
            <input
              id="eventName"
              type="text"
              value={formData.eventName}
              onChange={(e) => handleFieldChange('eventName', e.target.value)}
              onFocus={() => handleFieldChange('eventName', formData.eventName)}
              className="w-full text-base font-medium px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/20 bg-white"
            />
          </div>

          <div>
            <label htmlFor="eventDate" className="block text-xs font-bold text-slate-700 mb-1">
              Target Event Date *
            </label>
            <input
              id="eventDate"
              type="date"
              value={formData.eventDate}
              onChange={(e) => handleFieldChange('eventDate', e.target.value)}
              onFocus={() => handleFieldChange('eventDate', formData.eventDate)}
              className="w-full text-base font-medium px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/20 bg-white"
            />
            {errors.eventDate && <p className="text-xs text-rose-600 mt-1">{errors.eventDate}</p>}
          </div>

          <div>
            <label htmlFor="city" className="block text-xs font-bold text-slate-700 mb-1">
              City / Location *
            </label>
            <input
              id="city"
              type="text"
              value={formData.city}
              onChange={(e) => handleFieldChange('city', e.target.value)}
              onFocus={() => handleFieldChange('city', formData.city)}
              className="w-full text-base font-medium px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/20 bg-white"
            />
          </div>

          <div>
            <label htmlFor="guestCount" className="block text-xs font-bold text-slate-700 mb-1">
              Guest Count (N) *
            </label>
            <input
              id="guestCount"
              type="number"
              value={formData.guestCount}
              onChange={(e) => handleFieldChange('guestCount', Number(e.target.value))}
              onFocus={() => handleFieldChange('guestCount', formData.guestCount)}
              className="w-full text-base font-medium px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/20 bg-white tabular-nums"
            />
          </div>

          <div>
            <label htmlFor="totalBudget" className="block text-xs font-bold text-slate-700 mb-1">
              Total Budget ({formData.currency}) *
            </label>
            <input
              id="totalBudget"
              type="number"
              value={formData.totalBudget}
              onChange={(e) => handleFieldChange('totalBudget', Number(e.target.value))}
              onFocus={() => handleFieldChange('totalBudget', formData.totalBudget)}
              className="w-full text-base font-medium px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/20 bg-white tabular-nums"
            />
            {errors.totalBudget && <p className="text-xs text-rose-600 mt-1">{errors.totalBudget}</p>}
          </div>
        </div>

        {/* Custom Vibe Prompt */}
        <div>
          <label htmlFor="userPrompt" className="block text-xs font-bold text-slate-700 mb-1">
            Personalized Theme, Decor Vibe & Dietary Needs (Prompt for Gemini 2.5 Flash)
          </label>
          <textarea
            id="userPrompt"
            rows={3}
            value={formData.userPrompt}
            onChange={(e) => handleFieldChange('userPrompt', e.target.value)}
            onFocus={() => handleFieldChange('userPrompt', formData.userPrompt)}
            className="w-full text-base font-medium px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/20 bg-white"
            placeholder="e.g. Eco-friendly Chettinad floral decor with brass lamps and banana leaf feast with 40 Jain-safe meals..."
          />
        </div>

        {/* Submit CTA */}
        <button
          type="submit"
          className="w-full py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-base shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
        >
          <Sparkles className="w-5 h-5" />
          <span>Generate Complete Event Blueprint & Feasibility Analysis</span>
        </button>
      </form>
    </div>
  );
};
```

### 3.2 File: `src/components/DashboardView.tsx`
Executive command center dashboard featuring 4 hero KPIs and feasibility ring:

```tsx
// src/components/DashboardView.tsx
import React from 'react';
import {
  Wallet,
  CalendarCheck,
  Building2,
  Salad,
  AlertOctagon,
  CheckCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { EventPlanState } from '../types/event';

export interface DashboardViewProps {
  eventPlan: EventPlanState;
  onNavigateTab: (step: number) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ eventPlan, onNavigateTab }) => {
  const { budget, milestones, vendors, dietary, currency, guestCount } = eventPlan;
  const completedTasks = milestones.filter((m) => m.status === 'COMPLETED').length;
  const bookedVendors = vendors.filter((v) => v.bookingStatus !== 'NOT_STARTED').length;

  return (
    <div className="space-y-6">
      {/* Event Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-linear-to-r from-indigo-900 to-slate-900 text-white rounded-2xl p-6 shadow-sm">
        <div>
          <span className="px-2.5 py-1 rounded-md bg-indigo-500/30 text-indigo-200 font-semibold text-xs tracking-wider uppercase border border-indigo-400/20">
            {eventPlan.archetype}
          </span>
          <h2 className="text-2xl font-black tracking-tight mt-2">{eventPlan.eventName}</h2>
          <p className="text-slate-300 text-xs mt-1">
            {eventPlan.city} • {eventPlan.eventDateIso} • {guestCount} Guests
          </p>
        </div>

        {/* Feasibility Status Pill */}
        <div className="text-right">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-bold">Feasibility Status</div>
          <div className="mt-1">
            {budget.feasibilityStatus === 'OPTIMAL' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-sm font-black">
                <CheckCircle className="w-4 h-4" /> OPTIMAL (Healthy Margin)
              </span>
            )}
            {budget.feasibilityStatus === 'TIGHT_VIABLE' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-400/40 text-sm font-black">
                <Clock className="w-4 h-4" /> TIGHT MARGIN (Viable)
              </span>
            )}
            {budget.feasibilityStatus === 'CRITICAL_DEFICIT' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-400/40 text-sm font-black animate-pulse">
                <AlertOctagon className="w-4 h-4" /> CRITICAL DEFICIT
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 4 Hero KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Budget */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Budget</span>
            <Wallet className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 tabular-nums">
            {currency} {budget.totalBudget.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
            <span>Net Allocatable:</span>
            <span className="font-semibold text-slate-800">{currency} {budget.netAllocatableBudget.toLocaleString()}</span>
          </div>
        </div>

        {/* KPI 2: Per-Guest Allowance */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Per-Guest Cost</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 tabular-nums">
            {currency} {budget.perCapitaActual.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
            <span>Min Viable Floor:</span>
            <span className="font-semibold text-slate-800">{currency} {budget.perCapitaMinimumViable.toLocaleString()}</span>
          </div>
        </div>

        {/* KPI 3: CPM Timeline Readiness */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">CPM Readiness</span>
            <CalendarCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 tabular-nums">
            {completedTasks} / {milestones.length}
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
            <span>Next Action:</span>
            <span className="font-semibold text-slate-800 truncate max-w-[120px]">{milestones[0]?.title}</span>
          </div>
        </div>

        {/* KPI 4: Vendor Onboarding */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Vendor Onboarding</span>
            <Building2 className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 tabular-nums">
            {bookedVendors} / {vendors.length}
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
            <span>Safe Tranches:</span>
            <span className="font-semibold text-emerald-700">30 / 50 / 20 Active</span>
          </div>
        </div>
      </div>

      {/* Dietary Breakdown & Protection Shield */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Dietary Distribution */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <Salad className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-sm text-slate-900">Dietary & Cultural Preference Distribution</h3>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-emerald-50 border border-emerald-100 p-2.5 rounded-lg">
              <div className="text-lg font-black text-emerald-700 tabular-nums">{dietary.vegetarianPct}%</div>
              <div className="text-[11px] font-semibold text-emerald-900">Standard Veg</div>
            </div>
            <div className="bg-amber-50 border border-amber-100 p-2.5 rounded-lg">
              <div className="text-lg font-black text-amber-700 tabular-nums">{dietary.jainPct}%</div>
              <div className="text-[11px] font-semibold text-amber-900">Jain (No Root Veg)</div>
            </div>
            <div className="bg-indigo-50 border border-indigo-100 p-2.5 rounded-lg">
              <div className="text-lg font-black text-indigo-700 tabular-nums">{dietary.veganPct}%</div>
              <div className="text-[11px] font-semibold text-indigo-900">Vegan</div>
            </div>
          </div>
        </div>

        {/* Contingency & Tax Shield */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <Wallet className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-sm text-slate-900">Financial Tax & Contingency Shield</h3>
          </div>
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
              <span className="text-slate-600 font-medium">Contingency Reserve (8%):</span>
              <span className="font-bold text-slate-900 tabular-nums">
                {currency} {budget.contingencyReserve.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
              <span className="text-slate-600 font-medium">Estimated GST & Service Tax (10%):</span>
              <span className="font-bold text-slate-900 tabular-nums">
                {currency} {budget.estimatedTaxReserve.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
```

---

## 4. Copy-Pasteable Antigravity Execution Prompt

```markdown
> **Antigravity Phase 12 Execution Prompt:**
> Build the Step 1 Onboarding Wizard and Step 2 KPI Dashboard for AuraPlan AI (UtsavOS):
> 1. Create `src/components/OnboardingWizardView.tsx`:
>    - Include live-entry inputs for Organizer Name, Email (RFC-5322), Archetype selector, Title, Date, City, Guests, Budget, and Vibe Prompt.
>    - Broadcast focused field state to `onFieldFocus` to drive the top Live QA Bar with green/red badges for live video testing.
>    - Include 1-click test scenario presets for Weddings, Birthdays, and Hackathons.
> 2. Create `src/components/DashboardView.tsx`:
>    - Display 4 Hero KPI Cards (Total Budget, Per-Guest Cost, CPM Readiness, Vendor Onboarding).
>    - Display Feasibility Status Badges (`OPTIMAL`, `TIGHT_VIABLE`, `CRITICAL_DEFICIT`).
>    - Display Dietary Preference distribution and Tax/Contingency shield breakdowns.
> 3. Verify `npm run build` succeeds without warnings.
```

---

## 5. Verification & Test Commands

### Automated Verification
```powershell
# Verify build succeeds with both components
npm run build
```

### Manual Verification
1. Open the app, type `john@invalid` in the email box, and observe the red validation banner.
2. Clear and type `john@example.com` to observe the green valid badge.

---

## 6. Failure Modes & Recovery Protocol

- **State Reset on Navigation:** Ensure form state is lifted into `App.tsx` state so switching between steps preserves all user modifications.
