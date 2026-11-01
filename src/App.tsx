// src/App.tsx
import React, { Suspense } from 'react';
import { NavbarStepper } from './components/NavbarStepper';
import { LiveQATestBar } from './components/LiveQATestBar';
import { PromptXRayDrawer } from './components/PromptXRayDrawer';
import { GoogleWorkspaceHubModal } from './components/GoogleWorkspaceHubModal';
import { useEventPlannerState } from './hooks/useEventPlannerState';
import { Download, FileSpreadsheet } from 'lucide-react';

const OnboardingWizardView = React.lazy(() =>
  import('./components/OnboardingWizardView').then((m) => ({ default: m.OnboardingWizardView }))
);
const DashboardView = React.lazy(() =>
  import('./components/DashboardView').then((m) => ({ default: m.DashboardView }))
);
const BudgetStudioView = React.lazy(() =>
  import('./components/BudgetStudioView').then((m) => ({ default: m.BudgetStudioView }))
);
const TimelineView = React.lazy(() =>
  import('./components/TimelineView').then((m) => ({ default: m.TimelineView }))
);
const VendorChecklistView = React.lazy(() =>
  import('./components/VendorChecklistView').then((m) => ({ default: m.VendorChecklistView }))
);
const GenAIStudioView = React.lazy(() =>
  import('./components/GenAIStudioView').then((m) => ({ default: m.GenAIStudioView }))
);

export const App: React.FC = () => {
  const {
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
  } = useEventPlannerState();

  return (
    <div className={`min-h-screen flex flex-col bg-slate-50 ${isHighContrast ? 'high-contrast' : ''}`}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:bg-indigo-600 focus:text-white focus:px-3 focus:py-2 focus:rounded-md focus:z-50"
      >
        Skip to main content
      </a>

      <LiveQATestBar
        activeField={qaState.activeField}
        activeValue={qaState.activeValue}
        validationStatus={qaState.validationStatus}
        statusMessage={qaState.statusMessage}
      />

      <NavbarStepper
        currentStep={currentStep}
        onSelectStep={setCurrentStep}
        currency={currency}
        onSelectCurrency={handleSelectCurrency}
        isHighContrast={isHighContrast}
        onToggleHighContrast={() => setIsHighContrast((prev) => !prev)}
        onOpenXRay={() => setIsXRayOpen(true)}
      />

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
              type="button"
              onClick={() => setIsWorkspaceModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-300 text-slate-700 hover:text-indigo-600 hover:border-indigo-300 font-bold transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
              <span>Google Workspace Hub</span>
            </button>

            <button
              type="button"
              onClick={handleExportDossier}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-300 text-slate-700 hover:text-indigo-600 hover:border-indigo-300 font-bold transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" aria-hidden="true" />
              <span>Export Dossier (.md)</span>
            </button>
          </div>
        </div>
      </div>

      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 min-h-[500px]">
          <Suspense fallback={<div className="p-8 text-center text-slate-500 font-mono text-xs">Loading Studio...</div>}>
            {currentStep === 1 && (
              <OnboardingWizardView
                eventPlan={eventPlan}
                onUpdatePlan={setEventPlan}
                onPlanGenerated={() => setCurrentStep(2)}
                onFieldFocus={handleFieldFocus}
              />
            )}
            {currentStep === 2 && <DashboardView eventPlan={eventPlan} onNavigateTab={setCurrentStep} />}
            {currentStep === 3 && (
              <BudgetStudioView
                budget={eventPlan.budget}
                currency={currency}
                guestCount={eventPlan.guestCount}
                onUpdateBudget={(b) => setEventPlan((prev) => ({ ...prev, budget: b }))}
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
                onUpdateRunOfShow={(r) => setEventPlan((prev) => ({ ...prev, runOfShow: r }))}
                onUpdateMilestones={(m) => setEventPlan((prev) => ({ ...prev, milestones: m }))}
              />
            )}
            {currentStep === 5 && (
              <VendorChecklistView
                vendors={eventPlan.vendors}
                currency={currency}
                onUpdateVendors={(v) => setEventPlan((prev) => ({ ...prev, vendors: v }))}
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
          </Suspense>
        </div>
      </main>

      <div aria-live="polite" className="sr-only">
        Active step changed to step {currentStep}.
      </div>

      <PromptXRayDrawer isOpen={isXRayOpen} onClose={() => setIsXRayOpen(false)} recentRuns={eventPlan.aiRuns} />
      <GoogleWorkspaceHubModal
        isOpen={isWorkspaceModalOpen}
        onClose={() => setIsWorkspaceModalOpen(false)}
        eventPlan={eventPlan}
      />
    </div>
  );
};
