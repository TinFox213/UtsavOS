// src/components/OnboardingWizardView.tsx
import React, { useState } from 'react';
import {
  Sparkles,
  Users,
  Calendar,
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
    archetype: eventPlan.archetype as EventArchetype,
    subType: eventPlan.subType,
    eventName: eventPlan.eventName,
    eventDate: eventPlan.eventDateIso,
    city: eventPlan.city,
    currency: eventPlan.currency as CurrencyCode,
    guestCount: eventPlan.guestCount,
    totalBudget: eventPlan.budget.totalBudget,
    userPrompt: eventPlan.customVibePrompt,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFieldChange = (field: string, value: unknown) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);

    // Live validation feedback for Live Judge QA Bar
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
    } else if (field === 'organizerName') {
      const name = String(value).trim();
      status = name.length >= 2 ? 'VALID' : 'INVALID';
      msg = name.length >= 2 ? `✓ ORGANIZER: ${name}` : '✗ NAME: Minimum 2 characters required';
    }

    onFieldFocus(field, typeof value === 'number' ? value : String(value ?? ''), status, msg);
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
    onFieldFocus('Preset Loaded', p.title, 'VALID', `Loaded preset for ${p.title}`);
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
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
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
                  className={`p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer ${
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
          className="w-full py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-base shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-5 h-5" />
          <span>Generate Complete Event Blueprint & Feasibility Analysis</span>
        </button>
      </form>
    </div>
  );
};
