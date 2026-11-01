// tests/uiAccessibilityAndComponents.test.tsx
import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { ErrorBoundary } from '../src/components/ErrorBoundary';
import { LiveQATestBar } from '../src/components/LiveQATestBar';
import { NavbarStepper } from '../src/components/NavbarStepper';
import { DashboardView } from '../src/components/DashboardView';
import { BudgetStudioView } from '../src/components/BudgetStudioView';
import { TimelineView } from '../src/components/TimelineView';
import { VendorChecklistView } from '../src/components/VendorChecklistView';
import { GenAIStudioView } from '../src/components/GenAIStudioView';
import { PromptXRayDrawer } from '../src/components/PromptXRayDrawer';
import { GoogleWorkspaceHubModal } from '../src/components/GoogleWorkspaceHubModal';
import { EventPlanState } from '../src/types/event';
import { ARCHETYPE_PRESETS } from '../src/data/archetypeSeeds';
import { calculateBudgetSummary } from '../src/shared/budgetEngine';
import { generateCountdownMilestones, generateEventDayRunOfShow } from '../src/shared/timelineEngine';
import { initializeVendorRecords } from '../src/shared/vendorEngine';

function createMockEventPlan(): EventPlanState {
  const preset = ARCHETYPE_PRESETS[0]!;
  const budget = calculateBudgetSummary({
    totalBudget: preset.defaultBudget['INR'],
    guestCount: preset.defaultGuestCount,
    archetype: preset.archetype,
    currency: 'INR',
  });

  return {
    id: 'test_plan',
    createdAtIso: '2026-11-01T00:00:00.000Z',
    updatedAtIso: '2026-11-01T00:00:00.000Z',
    organizer: {
      fullName: 'Arikaran P',
      email: 'john@example.com',
      phone: '+91 98765 43210',
      organizationOrFamily: 'Celebrations Committee',
    },
    archetype: preset.archetype,
    subType: preset.subType,
    eventName: preset.title,
    eventDateIso: '2026-12-18',
    city: preset.defaultLocation,
    currency: 'INR',
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
    milestones: generateCountdownMilestones({ archetype: preset.archetype, eventDateIso: '2026-12-18' }),
    runOfShow: generateEventDayRunOfShow(preset.archetype),
    vendors: initializeVendorRecords(budget),
    aiRuns: [],
    customVibePrompt: preset.defaultVibePrompt,
  };
}

describe('UI & Accessibility Components Suite', () => {
  const plan = createMockEventPlan();

  it('1. ErrorBoundary: renders children safely', () => {
    const html = renderToStaticMarkup(
      <ErrorBoundary>
        <div id="test-child">Safe Child Content</div>
      </ErrorBoundary>
    );
    expect(html).toContain('Safe Child Content');
  });

  it('2. LiveQATestBar: renders live validation mirror region', () => {
    const html = renderToStaticMarkup(
      <LiveQATestBar
        activeField="Organizer Email"
        activeValue="john@example.com"
        validationStatus="VALID"
        statusMessage="Email is valid"
      />
    );
    expect(html).toContain('role="region"');
    expect(html).toContain('Live Video QA &amp; Validation Mirror Bar');
    expect(html).toContain('Organizer Email');
    expect(html).toContain('Email is valid');
    expect(html).toContain('bg-emerald-600');
  });

  it('3. NavbarStepper: renders workflow steps with explicit type="button"', () => {
    const html = renderToStaticMarkup(
      <NavbarStepper
        currentStep={1}
        onSelectStep={() => {}}
        currency="INR"
        onSelectCurrency={() => {}}
        isHighContrast={false}
        onToggleHighContrast={() => {}}
        onOpenXRay={() => {}}
      />
    );
    expect(html).toContain('aria-label="Event Planning Workflow"');
    expect(html).toContain('type="button"');
    expect(html).toContain('aria-label="Select INR currency"');
    expect(html).toContain('aria-label="Toggle High Contrast Mode"');
  });

  it('4. DashboardView: renders operational studios navigation buttons with type="button"', () => {
    const html = renderToStaticMarkup(
      <DashboardView eventPlan={plan} onNavigateTab={() => {}} />
    );
    expect(html).toContain('Feasibility Status');
    expect(html).toContain('Operational Studios');
    expect(html).toContain('type="button"');
    expect(html).toContain('Budget Studio');
    expect(html).toContain('GenAI Studio');
  });

  it('5. BudgetStudioView: renders lock buttons with aria-pressed and slider with id & labels', () => {
    const html = renderToStaticMarkup(
      <BudgetStudioView
        budget={plan.budget}
        currency="INR"
        guestCount={plan.guestCount}
        onUpdateBudget={() => {}}
        onTriggerAIOptimizer={() => {}}
      />
    );
    expect(html).toContain('type="button"');
    expect(html).toContain('aria-label="Toggle lock for');
    expect(html).toContain('id="slider-');
    expect(html).toContain('for="slider-');
    expect(html).toContain('aria-valuemin="0"');
    expect(html).toContain('aria-valuemax=');
  });

  it('6. TimelineView: renders accessible tablist, tabs, and panels', () => {
    const html = renderToStaticMarkup(
      <TimelineView
        archetype={plan.archetype}
        milestones={plan.milestones}
        runOfShow={plan.runOfShow}
        onUpdateRunOfShow={() => {}}
        onUpdateMilestones={() => {}}
      />
    );
    expect(html).toContain('role="tablist"');
    expect(html).toContain('role="tab"');
    expect(html).toContain('aria-selected="true"');
    expect(html).toContain('role="tabpanel"');
    expect(html).toContain('type="button"');
  });

  it('7. VendorChecklistView: renders accordion headers with type="button" and aria-expanded', () => {
    const html = renderToStaticMarkup(
      <VendorChecklistView
        vendors={plan.vendors}
        currency="INR"
        onUpdateVendors={() => {}}
        onGenerateRfp={() => {}}
      />
    );
    expect(html).toContain('type="button"');
    expect(html).toContain('aria-expanded="true"');
    expect(html).toContain('Readiness Score');
    expect(html).toContain('role="checkbox"');
  });

  it('8. GenAIStudioView: renders Copilot mode selection buttons with aria-pressed', () => {
    const html = renderToStaticMarkup(
      <GenAIStudioView
        eventPlan={plan}
        onNewRunGenerated={() => {}}
        onOpenXRay={() => {}}
      />
    );
    expect(html).toContain('role="group"');
    expect(html).toContain('aria-label="Copilot mission modes"');
    expect(html).toContain('type="button"');
    expect(html).toContain('aria-pressed="true"');
    expect(html).toContain('for="copilotPrompt"');
    expect(html).toContain('id="copilotPrompt"');
  });

  it('9. PromptXRayDrawer: renders dialog modal with aria-modal="true" and tab buttons', () => {
    const html = renderToStaticMarkup(
      <PromptXRayDrawer isOpen={true} onClose={() => {}} recentRuns={[]} />
    );
    expect(html).toContain('role="dialog"');
    expect(html).toContain('aria-modal="true"');
    expect(html).toContain('aria-label="Live Prompt X-Ray and Telemetry Drawer"');
    expect(html).toContain('type="button"');
    expect(html).toContain('Prompt &amp; JSON Inspector');
  });

  it('10. GoogleWorkspaceHubModal: renders dialog modal with aria-modal="true" and action cards', () => {
    const html = renderToStaticMarkup(
      <GoogleWorkspaceHubModal isOpen={true} onClose={() => {}} eventPlan={plan} />
    );
    expect(html).toContain('role="dialog"');
    expect(html).toContain('aria-modal="true"');
    expect(html).toContain('aria-label="Google Workspace Command Hub Modal"');
    expect(html).toContain('type="button"');
    expect(html).toContain('Add Event to Google Calendar');
    expect(html).toContain('Draft Vendor RFP in Gmail');
    expect(html).toContain('Search Venues in Google Maps');
  });
});
