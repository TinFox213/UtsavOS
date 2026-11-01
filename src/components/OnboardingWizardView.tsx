// src/components/OnboardingWizardView.tsx
import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { EventPlanState, EventArchetype, CurrencyCode } from '../types/event';
import { ARCHETYPE_PRESETS } from '../data/archetypeSeeds';
import { OrganizerAndEventInputSchema, QuickFieldValidators } from '../schemas/validationSchemas';
import { calculateBudgetSummary } from '../shared/budgetEngine';
import { generateCountdownMilestones, generateEventDayRunOfShow } from '../shared/timelineEngine';
import { initializeVendorRecords } from '../shared/vendorEngine';
import { ScenarioPresetsBar } from './onboarding/ScenarioPresetsBar';
import { OrganizerCredentialsSection } from './onboarding/OrganizerCredentialsSection';
import { EventParametersSection } from './onboarding/EventParametersSection';

export interface OnboardingWizardProps {
  eventPlan: EventPlanState;
  onUpdatePlan: (updated: EventPlanState) => void;
  onPlanGenerated: () => void;
  onFieldFocus: (field: string, value: string | number, status: 'VALID' | 'INVALID' | 'NEUTRAL', msg: string) => void;
}

/**
 * Step 1 Onboarding Wizard orchestrating organizer verification, celebration archetype selection,
 * and mathematical constraints input with real-time QA bar telemetry.
 */
function getFieldTelemetrics(field: string, value: unknown, currency: string) {
  if (field === 'organizerEmail') {
    const isValid = QuickFieldValidators.isValidEmail(String(value));
    return {
      status: (isValid ? 'VALID' : 'INVALID') as 'VALID' | 'INVALID',
      msg: isValid
        ? `✓ VALID RFC-5322 EMAIL: "${value}" Verified`
        : `✗ INVALID EMAIL: "${value}" — Missing domain TLD (.com, .org, .in)`,
    };
  }
  if (field === 'totalBudget') {
    const isPos = Number(value) > 0;
    return {
      status: (isPos ? 'VALID' : 'INVALID') as 'VALID' | 'INVALID',
      msg: isPos
        ? `✓ POSITIVE BUDGET: ${currency} ${Number(value).toLocaleString()}`
        : `✗ INVALID BUDGET: "${value}" — Must be greater than 0`,
    };
  }
  if (field === 'eventDate') {
    const isFut = QuickFieldValidators.isFutureDate(String(value));
    return {
      status: (isFut ? 'VALID' : 'INVALID') as 'VALID' | 'INVALID',
      msg: isFut ? `✓ FUTURE DATE: ${value}` : `✗ PAST DATE: "${value}" — Event cannot be in past`,
    };
  }
  return { status: 'NEUTRAL' as const, msg: 'Active input' };
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

  const validateFieldTelemetrics = (field: string, value: unknown) => {
    const { status, msg } = getFieldTelemetrics(field, value, formData.currency);
    const displayVal = typeof value === 'number' ? value : String(value ?? '');
    onFieldFocus(field, displayVal, status, msg);
  };

  const handleFieldChange = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    validateFieldTelemetrics(field, value);
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

    const budget = calculateBudgetSummary({
      totalBudget: formData.totalBudget,
      guestCount: formData.guestCount,
      archetype: formData.archetype,
      currency: formData.currency,
    });

    onUpdatePlan({
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
      milestones: generateCountdownMilestones({ archetype: formData.archetype, eventDateIso: formData.eventDate }),
      runOfShow: generateEventDayRunOfShow(formData.archetype),
      vendors: initializeVendorRecords(budget),
      customVibePrompt: formData.userPrompt,
    });
    onPlanGenerated();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Step 1: Organizer Sign-In & Live Event Setup
          </h2>
          <p className="text-xs text-slate-500">
            Type values live to test validation, past dates, and budget deficit edge cases.
          </p>
        </div>
        <ScenarioPresetsBar onSelectPreset={loadPreset} />
      </div>

      <form onSubmit={handleGenerate} className="space-y-6">
        <OrganizerCredentialsSection
          organizerName={formData.organizerName}
          organizerEmail={formData.organizerEmail}
          errors={errors}
          onFieldChange={handleFieldChange}
        />

        <EventParametersSection formData={formData} errors={errors} onFieldChange={handleFieldChange} />

        <button
          type="submit"
          className="w-full py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-base shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-5 h-5" aria-hidden="true" />
          <span>Generate Complete Event Blueprint & Feasibility Analysis</span>
        </button>
      </form>
    </div>
  );
};
