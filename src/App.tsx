// src/App.tsx
import React, { useState, useEffect } from 'react';
import { NavbarStepper } from './components/NavbarStepper';
import { LiveQATestBar } from './components/LiveQATestBar';
import { OnboardingWizardView } from './components/OnboardingWizardView';
import { DashboardView } from './components/DashboardView';
import { BudgetStudioView } from './components/BudgetStudioView';
import { TimelineView } from './components/TimelineView';
import { VendorChecklistView } from './components/VendorChecklistView';
import { GenAIStudioView } from './components/GenAIStudioView';
import { PromptXRayDrawer } from './components/PromptXRayDrawer';
import { GoogleWorkspaceHubModal } from './components/GoogleWorkspaceHubModal';
import { CurrencyCode, EventPlanState, AIGenerationRun, VendorRecord } from './types/event';
import { ARCHETYPE_PRESETS } from './data/archetypeSeeds';
import { calculateBudgetSummary } from './shared/budgetEngine';
import { generateCountdownMilestones, generateEventDayRunOfShow } from './shared/timelineEngine';
import { initializeVendorRecords } from './shared/vendorEngine';
import { exportPlanAsMarkdown, downloadTextFile } from './services/storageService';
import { Download, FileSpreadsheet } from 'lucide-react';

export const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [currency, setCurrency] = useState<CurrencyCode>('INR');
  const [isHighContrast, setIsHighContrast] = useState<boolean>(false);
  const [isXRayOpen, setIsXRayOpen] = useState<boolean>(false);
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState<boolean>(false);

  // Live QA Bar State for Video Section 2
  const [qaState, setQaState] = useState<{
    activeField: string;
    activeValue: string | number;
    validationStatus: 'VALID' | 'INVALID' | 'NEUTRAL';
    statusMessage: string;
  }>({
    activeField: 'Organizer Email',
    activeValue: 'john@example.com',
    validationStatus: 'VALID',
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

  const handleExportDossier = () => {
    const md = exportPlanAsMarkdown(eventPlan);
    downloadTextFile(`AuraPlan_${eventPlan.eventName.replace(/\s+/g, '_')}_Dossier.md`, md);
  };

  const handleNewAIRun = (run: AIGenerationRun) => {
    setEventPlan((prev) => ({
      ...prev,
      aiRuns: [...prev.aiRuns, run],
    }));
  };

  const handleGenerateRfp = (vendor: VendorRecord) => {
    setCurrentStep(6);
    setIsXRayOpen(true);
    setQaState({
      activeField: 'Vendor RFP',
      activeValue: vendor.categoryLabel,
      validationStatus: 'VALID',
      statusMessage: `RFP Copilot launched for ${vendor.categoryLabel}`,
    });
  };

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

      {/* Sub-Header Secondary Action Ribbon */}
      <div className="bg-slate-100 border-b border-slate-200 px-4 py-1.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">{eventPlan.eventName}</span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-600 font-medium">{eventPlan.city}</span>
            <span className="text-slate-400">|</span>
            <span className="font-mono font-bold text-indigo-700">
              {currency} {eventPlan.budget.totalBudget.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsWorkspaceModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-300 text-slate-700 hover:text-indigo-600 hover:border-indigo-300 font-bold transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Google Workspace Hub</span>
            </button>

            <button
              onClick={handleExportDossier}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-300 text-slate-700 hover:text-indigo-600 hover:border-indigo-300 font-bold transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>Export Dossier (.md)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Screen Container */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 min-h-[500px]">
          {currentStep === 1 && (
            <OnboardingWizardView
              eventPlan={eventPlan}
              onUpdatePlan={setEventPlan}
              onPlanGenerated={() => setCurrentStep(2)}
              onFieldFocus={(field, value, status, msg) => {
                setQaState({
                  activeField: field,
                  activeValue: value,
                  validationStatus: status,
                  statusMessage: msg,
                });
              }}
            />
          )}

          {currentStep === 2 && (
            <DashboardView
              eventPlan={eventPlan}
              onNavigateTab={setCurrentStep}
            />
          )}

          {currentStep === 3 && (
            <BudgetStudioView
              budget={eventPlan.budget}
              currency={currency}
              guestCount={eventPlan.guestCount}
              onUpdateBudget={(updatedBudget) => {
                setEventPlan((prev) => ({ ...prev, budget: updatedBudget }));
              }}
              onTriggerAIOptimizer={() => {
                setCurrentStep(6);
                setIsXRayOpen(true);
              }}
            />
          )}

          {currentStep === 4 && (
            <TimelineView
              archetype={eventPlan.archetype}
              milestones={eventPlan.milestones}
              runOfShow={eventPlan.runOfShow}
              onUpdateRunOfShow={(updatedRun) => {
                setEventPlan((prev) => ({ ...prev, runOfShow: updatedRun }));
              }}
              onUpdateMilestones={(updatedMilestones) => {
                setEventPlan((prev) => ({ ...prev, milestones: updatedMilestones }));
              }}
            />
          )}

          {currentStep === 5 && (
            <VendorChecklistView
              vendors={eventPlan.vendors}
              currency={currency}
              onUpdateVendors={(updatedVendors) => {
                setEventPlan((prev) => ({ ...prev, vendors: updatedVendors }));
              }}
              onGenerateRfp={handleGenerateRfp}
            />
          )}

          {currentStep === 6 && (
            <GenAIStudioView
              eventPlan={eventPlan}
              onNewRunGenerated={handleNewAIRun}
              onOpenXRay={() => setIsXRayOpen(true)}
            />
          )}
        </div>
      </main>

      {/* Live Region for Screen Readers */}
      <div aria-live="polite" className="sr-only">
        Active step changed to step {currentStep}.
      </div>

      {/* Split-Screen Prompt X-Ray Drawer */}
      <PromptXRayDrawer
        isOpen={isXRayOpen}
        onClose={() => setIsXRayOpen(false)}
        recentRuns={eventPlan.aiRuns}
      />

      {/* 3-Tier Google Workspace Command Hub Modal */}
      <GoogleWorkspaceHubModal
        isOpen={isWorkspaceModalOpen}
        onClose={() => setIsWorkspaceModalOpen(false)}
        eventPlan={eventPlan}
      />
    </div>
  );
};
