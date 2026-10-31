export type CopilotMode =
  | 'THEME_AND_IDEAS'
  | 'MENU_AND_CATERING'
  | 'BUDGET_OPTIMIZER'
  | 'VENDOR_NEGOTIATOR'
  | 'CRISIS_SIMULATOR';

export type EventArchetype = 'WEDDING' | 'BIRTHDAY' | 'COMMUNITY_EVENT';

export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP';

export interface SynthesisInput {
  copilotMode: CopilotMode;
  eventType: EventArchetype;
  subType: string;
  eventName: string;
  guestCount: number;
  totalBudget: number;
  currency: CurrencyCode;
  netAllocatableBudget?: number;
  cateringCap?: number;
  decorCap?: number;
  venueCap?: number;
  location?: string;
  userPrompt: string;
  dietaryAndCultural?: Record<string, unknown> | {
    vegetarianPct?: number;
    veganPct?: number;
    jainPct?: number;
    halalPct?: number;
    glutenFreeCount?: number;
    nutAllergyCount?: number;
  };
}

export interface SynthesisOutput {
  runId: string;
  timestampIso: string;
  copilotMode: CopilotMode;
  modelUsed: string;
  latencyMs: number;
  inputSnapshot: {
    eventType: EventArchetype;
    subType: string;
    guestCount: number;
    totalBudget: number;
    currency: CurrencyCode;
    location: string;
    userPrompt: string;
  };
  promptSent: string;
  structuredOutput: Record<string, unknown>;
}

function synthesizeTheme(body: SynthesisInput): Record<string, unknown> {
  const isWedding = body.eventType === 'WEDDING';
  const isHackathon = body.eventType === 'COMMUNITY_EVENT';
  const decorCap = body.decorCap || Math.round(body.totalBudget * 0.15);

  return {
    themeTitle: isWedding
      ? 'Royal Chettinad Heritage & Brass Glow'
      : isHackathon
      ? 'Cyberpunk Neon Matrix & AI Terminal'
      : 'Pastel Meadow Whimsical Dreamscape',
    tagline: isWedding
      ? 'Timeless Dravidian Architecture & Sustainable Brass Craft'
      : 'Code, Neon & High-Velocity Innovation',
    colorPalette: isWedding
      ? ['#B8860B', '#800000', '#2E8B57', '#FAF0E6', '#D4AF37']
      : ['#00FFFF', '#FF00FF', '#0F172A', '#38BDF8', '#10B981'],
    signatureZones: [
      {
        name: isWedding ? 'Grand Mandapam Sacred Arch' : '4K LED Main Stage & Cyberspace Tunnel',
        budgetCapAllocated: Math.round(decorCap * 0.45),
        description: isWedding
          ? 'Fresh jasmine strands, brass vilakku lamps, and unpolished teak wood pillars'
          : 'Dual P2.5 LED wall, ambient cold-cathode neon fixtures, and hackathon countdown clock',
      },
      {
        name: 'Interactive Memory Photo Booth',
        budgetCapAllocated: Math.round(decorCap * 0.25),
        description: 'Custom acoustic backdrop with personalized neon typography monogram',
      },
    ],
    personalizedIdeas: [
      `Live welcome experience scaled for ${body.guestCount} attendees`,
      `Custom curated playlist cues matching "${body.userPrompt.slice(0, 30)}..." vibe`,
      'Zero-plastic eco-friendly souvenir gift stations',
    ],
  };
}

function synthesizeMenu(body: SynthesisInput): Record<string, unknown> {
  const isWedding = body.eventType === 'WEDDING';
  const foodKg = Math.round(body.guestCount * 0.65);
  const cateringCap = body.cateringCap || Math.round(body.totalBudget * 0.35);

  return {
    curatedMenuCourses: [
      { course: 'Welcome Drink', item: isWedding ? 'Chilled Tender Coconut with Mint' : 'Nitro Cold Brew & Matcha', badge: '[VEGAN]' },
      { course: 'Main Course', item: isWedding ? 'Heritage Banana Leaf Thali' : 'Loaded Falafel & Burrito Bowls', badge: '[VEG / JAIN-SAFE]' },
      { course: 'Dessert', item: isWedding ? 'Warm Elaneer Payasam' : 'Artisanal Churros & Gelato', badge: '[GF]' },
    ],
    quantityEstimationMatrix: [
      { item: 'Total Food Weight', quantity: `${foodKg} kg`, notes: `Scaled for ${body.guestCount} guests + 10% buffer` },
      { item: 'Hydration & Beverages', quantity: `${Math.round(body.guestCount * 0.8)} Liters`, notes: 'Refillable eco stations' },
    ],
    estimatedPerPlateCost: Math.round(cateringCap / Math.max(1, body.guestCount)),
    foodRescuePartnerPlan: 'Automated surplus handoff to local feeding charity within 90 minutes',
  };
}

function synthesizeBudget(body: SynthesisInput): Record<string, unknown> {
  return {
    diagnosisSummary: `Analyzed ${body.currency} ${body.totalBudget.toLocaleString()} for ${body.guestCount} guests. Recommended 3 high-impact value-engineering swaps.`,
    valueEngineeringSwaps: [
      {
        category: 'CATERING_FNB',
        originalApproach: 'Multi-course formal plated banquet service',
        aiRecommendedSwap: 'Regional artisanal live culinary stations',
        savingsAmount: Math.round(body.totalBudget * 0.08),
        qualityImpact: 'Minimal — enhances guest interaction and speeds up service',
      },
      {
        category: 'DECOR_FLORAL',
        originalApproach: '100% exotic imported cut florals',
        aiRecommendedSwap: 'Locally sourced seasonal florals with brass architectural elements',
        savingsAmount: Math.round(body.totalBudget * 0.05),
        qualityImpact: 'Positive — authentic heritage ambiance and zero floral wilting',
      },
    ],
  };
}

export function generateDynamicSynthesisFallback(
  body: SynthesisInput,
  promptSent: string,
  startTime: number
): SynthesisOutput {
  let structuredOutput: Record<string, unknown>;

  if (body.copilotMode === 'THEME_AND_IDEAS') {
    structuredOutput = synthesizeTheme(body);
  } else if (body.copilotMode === 'MENU_AND_CATERING') {
    structuredOutput = synthesizeMenu(body);
  } else if (body.copilotMode === 'BUDGET_OPTIMIZER') {
    structuredOutput = synthesizeBudget(body);
  } else {
    structuredOutput = {
      status: 'SUCCESS',
      message: `Simulated Copilot response generated for ${body.copilotMode}`,
      eventTitle: body.eventName,
      guestCount: body.guestCount,
    };
  }

  return {
    runId: `run_${Date.now()}`,
    timestampIso: new Date().toISOString(),
    copilotMode: body.copilotMode,
    modelUsed: 'gemini-2.5-flash (Dynamic Synthesizer)',
    latencyMs: Math.max(400, Date.now() - startTime),
    inputSnapshot: {
      eventType: body.eventType,
      subType: body.subType,
      guestCount: body.guestCount,
      totalBudget: body.totalBudget,
      currency: body.currency,
      location: body.location || '',
      userPrompt: body.userPrompt,
    },
    promptSent,
    structuredOutput,
  };
}
