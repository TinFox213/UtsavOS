// tests/stateAndWizard.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { buildEventCopilotPrompt } from '../src/shared/promptBuilder';
import { OnboardingWizardView } from '../src/components/OnboardingWizardView';
import { ARCHETYPE_PRESETS } from '../src/data/archetypeSeeds';
import { calculateBudgetSummary } from '../src/shared/budgetEngine';
import { generateCountdownMilestones, generateEventDayRunOfShow } from '../src/shared/timelineEngine';
import { initializeVendorRecords } from '../src/shared/vendorEngine';
import { EventPlanState } from '../src/types/event';

function createMockPlan(): EventPlanState {
  const preset = ARCHETYPE_PRESETS[0]!;
  const budget = calculateBudgetSummary({
    totalBudget: preset.defaultBudget['INR'],
    guestCount: preset.defaultGuestCount,
    archetype: preset.archetype,
    currency: 'INR',
  });

  return {
    id: 'mock_state_plan',
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

describe('Prompt Builder & Prompt Constraint Engine', () => {
  it('buildEventCopilotPrompt: generates strict mathematical and domain constraints', () => {
    const prompt = buildEventCopilotPrompt({
      copilotMode: 'THEME_AND_IDEAS',
      eventType: 'WEDDING',
      subType: 'Royal Heritage',
      eventName: 'Priya & Karthik Royal Wedding',
      guestCount: 250,
      totalBudget: 850000,
      currency: 'INR',
      netAllocatableBudget: 697000,
      cateringCap: 255000,
      decorCap: 119000,
      venueCap: 170000,
      location: 'Chennai',
      userPrompt: 'Eco-friendly Chettinad floral decor with brass lamps',
      dietaryAndCultural: { vegetarianPct: 70 },
    });

    expect(prompt).toContain('AuraPlan AI (UtsavOS)');
    expect(prompt).toContain('STRICT MATHEMATICAL & DOMAIN CONSTRAINTS');
    expect(prompt).toContain('Event Archetype: WEDDING (Royal Heritage)');
    expect(prompt).toContain('Guest Count: 250 guests');
    expect(prompt).toContain('Total Budget: INR');
    expect(prompt).toContain('Catering Cap: INR');
    expect(prompt).toContain('Specific Copilot Mission Mode: THEME_AND_IDEAS');
  });

  it('buildEventCopilotPrompt: accommodates Community Event & Hackathon constraints', () => {
    const prompt = buildEventCopilotPrompt({
      copilotMode: 'CRISIS_SIMULATOR',
      eventType: 'COMMUNITY_EVENT',
      subType: 'Hackathon',
      eventName: 'Inter-College AI Fest',
      guestCount: 400,
      totalBudget: 150000,
      currency: 'INR',
      netAllocatableBudget: 123000,
      cateringCap: 39000,
      decorCap: 18000,
      venueCap: 24000,
      location: 'Coimbatore',
      userPrompt: 'Heavy thunderstorm forecast at 20:00',
    });

    expect(prompt).toContain('Event Archetype: COMMUNITY_EVENT (Hackathon)');
    expect(prompt).toContain('Guest Count: 400 guests');
    expect(prompt).toContain('CRISIS_SIMULATOR');
  });
});

describe('OnboardingWizardView Static & Accessibility Verification', () => {
  it('renders complete step 1 wizard with all input controls and presets bar', () => {
    const plan = createMockPlan();
    const handleUpdate = vi.fn();
    const handleGenerated = vi.fn();
    const handleFieldFocus = vi.fn();

    const html = renderToStaticMarkup(
      <OnboardingWizardView
        eventPlan={plan}
        onUpdatePlan={handleUpdate}
        onPlanGenerated={handleGenerated}
        onFieldFocus={handleFieldFocus}
      />
    );

    expect(html).toContain('Step 1: Organizer Sign-In &amp; Live Event Setup');
    expect(html).toContain('Organizer Credentials &amp; Contact Verification');
    expect(html).toContain('id="organizerName"');
    expect(html).toContain('id="organizerEmail"');
    expect(html).toContain('id="eventName"');
    expect(html).toContain('id="eventDate"');
    expect(html).toContain('id="city"');
    expect(html).toContain('id="guestCount"');
    expect(html).toContain('id="totalBudget"');
    expect(html).toContain('Generate Complete Event Blueprint &amp; Feasibility Analysis');
  });
});
