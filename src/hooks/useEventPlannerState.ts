// src/hooks/useEventPlannerState.ts
import { useState, useEffect, useCallback } from 'react';
import { CurrencyCode, EventPlanState, AIGenerationRun, VendorRecord } from '../types/event';
import { ARCHETYPE_PRESETS } from '../data/archetypeSeeds';
import { calculateBudgetSummary } from '../shared/budgetEngine';
import { generateCountdownMilestones, generateEventDayRunOfShow } from '../shared/timelineEngine';
import { initializeVendorRecords } from '../shared/vendorEngine';
import { exportPlanAsMarkdown, downloadTextFile } from '../services/storageService';

export interface QAState {
  activeField: string;
  activeValue: string | number;
  validationStatus: 'VALID' | 'INVALID' | 'NEUTRAL';
  statusMessage: string;
}

function createInitialEventPlan(currency: CurrencyCode): EventPlanState {
  const preset = ARCHETYPE_PRESETS[0]!;
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
}

export function useEventPlannerState() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [currency, setCurrency] = useState<CurrencyCode>('INR');
  const [isHighContrast, setIsHighContrast] = useState<boolean>(false);
  const [isXRayOpen, setIsXRayOpen] = useState<boolean>(false);
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState<boolean>(false);

  const [qaState, setQaState] = useState<QAState>({
    activeField: 'Organizer Email',
    activeValue: 'john@example.com',
    validationStatus: 'VALID',
    statusMessage: 'Ready for live typing demonstration',
  });

  const [eventPlan, setEventPlan] = useState<EventPlanState>(() => createInitialEventPlan('INR'));

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

  const handleSelectCurrency = useCallback((newCurrency: CurrencyCode) => {
    setCurrency(newCurrency);
    setEventPlan((prev) => ({
      ...prev,
      currency: newCurrency,
      budget: calculateBudgetSummary({
        totalBudget: prev.budget.totalBudget,
        guestCount: prev.guestCount,
        archetype: prev.archetype,
        currency: newCurrency,
      }),
    }));
  }, []);

  const handleExportDossier = useCallback(() => {
    const md = exportPlanAsMarkdown(eventPlan);
    downloadTextFile(`AuraPlan_${eventPlan.eventName.replace(/\s+/g, '_')}_Dossier.md`, md);
  }, [eventPlan]);

  const handleNewAIRun = useCallback((run: AIGenerationRun) => {
    setEventPlan((prev) => ({
      ...prev,
      aiRuns: [...prev.aiRuns, run],
    }));
  }, []);

  const handleGenerateRfp = useCallback((vendor: VendorRecord) => {
    setCurrentStep(6);
    setIsXRayOpen(true);
    setQaState({
      activeField: 'Vendor RFP',
      activeValue: vendor.categoryLabel,
      validationStatus: 'VALID',
      statusMessage: `RFP Copilot launched for ${vendor.categoryLabel}`,
    });
  }, []);

  const handleFieldFocus = useCallback(
    (field: string, value: string | number, status: 'VALID' | 'INVALID' | 'NEUTRAL', msg: string) => {
      setQaState({
        activeField: field,
        activeValue: value,
        validationStatus: status,
        statusMessage: msg,
      });
    },
    []
  );

  return {
    currentStep,
    setCurrentStep,
    currency,
    handleSelectCurrency,
    isHighContrast,
    setIsHighContrast,
    isXRayOpen,
    setIsXRayOpen,
    isWorkspaceModalOpen,
    setIsWorkspaceModalOpen,
    qaState,
    eventPlan,
    setEventPlan,
    handleExportDossier,
    handleNewAIRun,
    handleGenerateRfp,
    handleFieldFocus,
  };
}
