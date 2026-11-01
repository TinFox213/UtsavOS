// tests/utilsAndWorkspace.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import {
  buildGoogleCalendarUrl,
  buildGmailComposeUrl,
  buildGoogleMapsSearchUrl,
  triggerWorkspaceWebhookSync,
} from '../src/services/googleWorkspaceService';
import {
  saveEventPlanToStorage,
  loadEventPlanFromStorage,
  clearEventPlanStorage,
  exportPlanAsMarkdown,
  isSafeHttpUrl,
} from '../src/services/storageService';
import { generateIcsCalendar } from '../src/utils/icsExport';
import { buildUPIPaymentUri, generateQRMatrixSvg } from '../src/utils/qrGenerator';
import { speakText, createSpeechRecognizer } from '../src/utils/speechUtils';
import { checkRateLimit, resetRateLimitStore } from '../api/_lib/security';
import { EventPlanState } from '../src/types/event';
import { calculateBudgetSummary } from '../src/shared/budgetEngine';

describe('Google Workspace Service', () => {
  it('builds valid Google Calendar TEMPLATE deep link', () => {
    const url = buildGoogleCalendarUrl('Heritage Gala', 'Grand Feast', 'Chennai', '2026-12-18');
    expect(url).toContain('https://calendar.google.com/calendar/render');
    expect(url).toContain('action=TEMPLATE');
    expect(url).toContain('text=Heritage%20Gala');
    expect(url).toContain('location=Chennai');
  });

  it('builds valid Gmail Compose URL with encoded params', () => {
    const url = buildGmailComposeUrl('vendor@example.com', 'RFP Inquiry', 'Please quote catering');
    expect(url).toContain('https://mail.google.com/mail/?view=cm');
    expect(url).toContain('to=vendor%40example.com');
    expect(url).toContain('su=RFP%20Inquiry');
  });

  it('builds valid Google Maps search URL', () => {
    const url = buildGoogleMapsSearchUrl('ITC Grand Chola Chennai');
    expect(url).toContain('https://www.google.com/maps/search/?api=1');
    expect(url).toContain('query=ITC%20Grand%20Chola%20Chennai');
  });

  it('triggers workspace webhook sync with graceful demo fallback', async () => {
    const result = await triggerWorkspaceWebhookSync({
      eventName: 'Cyberpunk Hackathon',
      eventDate: '2026-11-20',
      city: 'Bengaluru',
      currency: 'INR',
      totalBudget: 450000,
      guestCount: 150,
      allocations: [],
      milestones: [],
      vendors: [],
    });

    expect(result.status).toBe('success');
    expect(result.spreadsheetUrl).toContain('docs.google.com/spreadsheets');
    expect(result.documentUrl).toContain('docs.google.com/document');
    expect(result.formPublishUrl).toContain('docs.google.com/forms');
  });
});

describe('Storage Service & Security Sanitization', () => {
  const dummyPlan: EventPlanState = {
    id: 'test_plan_001',
    createdAtIso: '2026-11-01T00:00:00.000Z',
    updatedAtIso: '2026-11-01T00:00:00.000Z',
    organizer: {
      fullName: 'Arikaran P',
      email: 'john@example.com',
      phone: '+91 98765 43210',
      organizationOrFamily: 'Heritage Committee',
    },
    archetype: 'WEDDING',
    subType: 'Royal Heritage',
    eventName: 'Karthik & Priya Wedding',
    eventDateIso: '2026-12-18',
    city: 'Madurai',
    currency: 'INR',
    guestCount: 200,
    dietary: {
      vegetarianPct: 80,
      veganPct: 10,
      jainPct: 10,
      halalPct: 0,
      glutenFreeCount: 5,
      nutAllergyCount: 2,
    },
    budget: calculateBudgetSummary({
      totalBudget: 850000,
      guestCount: 200,
      archetype: 'WEDDING',
      currency: 'INR',
    }),
    milestones: [],
    runOfShow: [],
    vendors: [],
    aiRuns: [],
    customVibePrompt: 'Brass diyas and floral mandapam',
  };

  beforeEach(() => {
    const store: Record<string, string> = {};
    globalThis.localStorage = {
      getItem: (key: string) => store[key] ?? null,
      setItem: (key: string, val: string) => {
        store[key] = val;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {},
      length: 0,
      key: () => null,
    };
  });

  it('saves and re-hydrates valid event plan from localStorage', () => {
    const saved = saveEventPlanToStorage(dummyPlan);
    expect(saved).toBe(true);

    const loaded = loadEventPlanFromStorage();
    expect(loaded).not.toBeNull();
    expect(loaded?.eventName).toBe('Karthik & Priya Wedding');
    expect(loaded?.guestCount).toBe(200);
  });

  it('returns null and shields against corrupted or maliciously injected JSON', () => {
    globalThis.localStorage.setItem('auraplan_event_state_v1', '{"maliciousInjection": true}');
    const loaded = loadEventPlanFromStorage();
    expect(loaded).toBeNull();

    globalThis.localStorage.setItem('auraplan_event_state_v1', '{corrupt json');
    const corrupt = loadEventPlanFromStorage();
    expect(corrupt).toBeNull();
  });

  it('clears stored event plan on demand', () => {
    saveEventPlanToStorage(dummyPlan);
    clearEventPlanStorage();
    expect(loadEventPlanFromStorage()).toBeNull();
  });

  it('exports formatted Markdown Dossier containing key sections', () => {
    const md = exportPlanAsMarkdown(dummyPlan);
    expect(md).toContain('# Master Event Blueprint Dossier: Karthik & Priya Wedding');
    expect(md).toContain('## 1. Budget Breakdown & Financial Shield');
    expect(md).toContain('Contingency Reserve (8%)');
    expect(md).toContain('Estimated Tax Reserve (10%)');
  });

  it('isSafeHttpUrl validates protocols properly', () => {
    expect(isSafeHttpUrl('https://calendar.google.com')).toBe(true);
    expect(isSafeHttpUrl('http://localhost:3000')).toBe(true);
    expect(isSafeHttpUrl('javascript:alert(1)')).toBe(false);
    expect(isSafeHttpUrl('data:text/html,<h1>XSS</h1>')).toBe(false);
    expect(isSafeHttpUrl('not a url')).toBe(false);
  });
});

describe('RFC-5545 ICS Calendar Export', () => {
  it('generates compliant VCALENDAR and VEVENT blocks', () => {
    const ics = generateIcsCalendar(
      'AuraPlan Annual Gala',
      'Chennai Convention Center',
      [
        {
          id: 'm1',
          daysBeforeEvent: 30,
          phaseLabel: 'T-30d',
          title: 'Finalize Catering Menu & Tastings',
          owner: 'Catering Lead',
          deliverableCheck: 'Menu confirmed',
          dueDateIso: '2026-11-18',
          status: 'PENDING',
          category: 'CATERING_FNB',
          priority: 'CRITICAL',
        },
      ]
    );

    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('VERSION:2.0');
    expect(ics).toContain('PRODID:-//AuraPlan AI//UtsavOS Event Planner//EN');
    expect(ics).toContain('BEGIN:VEVENT');
    expect(ics).toContain('SUMMARY:[T-30d] Finalize Catering Menu & Tastings');
    expect(ics).toContain('LOCATION:Chennai Convention Center');
    expect(ics).toContain('END:VEVENT');
    expect(ics).toContain('END:VCALENDAR');
  });
});

describe('NPCI UPI QR Matrix Generator', () => {
  it('builds standard UPI payment URI with exact parameters', () => {
    const uri = buildUPIPaymentUri({
      payeeVpa: 'auraplan@icici',
      payeeName: 'AuraPlan Escrow',
      amount: 45000,
      currency: 'INR',
      transactionNote: 'Catering Advance Tranche',
    });

    expect(uri).toContain('upi://pay?');
    expect(uri).toContain('pa=auraplan%40icici');
    expect(uri).toContain('am=45000.00');
    expect(uri).toContain('cu=INR');
  });

  it('generates valid SVG matrix string', () => {
    const svg = generateQRMatrixSvg('upi://pay?pa=auraplan@icici&am=25000.00', 200);
    expect(svg).toContain('<svg');
    expect(svg).toContain('viewBox="0 0 200 200"');
    expect(svg).toContain('</svg>');
  });
});

describe('Web Speech Utilities Resilience', () => {
  it('gracefully handles missing SpeechSynthesis API without crashing', () => {
    expect(() => speakText('Welcome to AuraPlan AI')).not.toThrow();
  });

  it('reports isSupported=false and no-op callbacks when SpeechRecognition missing', () => {
    const recognizer = createSpeechRecognizer(() => {});
    expect(recognizer.isSupported).toBe(false);
    expect(() => recognizer.start()).not.toThrow();
    expect(() => recognizer.stop()).not.toThrow();
  });
});

describe('Sliding-Window IP Rate Limiter', () => {
  beforeEach(() => {
    resetRateLimitStore();
  });

  it('allows requests within limit and decrements remaining counter', () => {
    const ip = '192.168.1.100';
    const r1 = checkRateLimit(ip, 3, 60_000);
    expect(r1.allowed).toBe(true);
    expect(r1.remaining).toBe(2);

    const r2 = checkRateLimit(ip, 3, 60_000);
    expect(r2.allowed).toBe(true);
    expect(r2.remaining).toBe(1);

    const r3 = checkRateLimit(ip, 3, 60_000);
    expect(r3.allowed).toBe(true);
    expect(r3.remaining).toBe(0);
  });

  it('blocks request when limit exceeded and provides resetAt timestamp', () => {
    const ip = '10.0.0.5';
    for (let i = 0; i < 5; i++) {
      checkRateLimit(ip, 5, 10_000);
    }

    const blocked = checkRateLimit(ip, 5, 10_000);
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.resetAt).toBeGreaterThan(Date.now());
  });

  it('tracks distinct IP addresses independently', () => {
    const ip1 = '1.1.1.1';
    const ip2 = '2.2.2.2';

    for (let i = 0; i < 2; i++) {
      checkRateLimit(ip1, 2, 60_000);
    }
    expect(checkRateLimit(ip1, 2, 60_000).allowed).toBe(false);
    expect(checkRateLimit(ip2, 2, 60_000).allowed).toBe(true);
  });
});
