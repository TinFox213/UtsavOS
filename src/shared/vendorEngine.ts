// src/shared/vendorEngine.ts
import {
  VendorCategoryKey,
  VendorRecord,
  VendorChecklistItem,
  BudgetSummary,
} from '../types/event';

export const DOMAIN_CHECKLIST_TEMPLATES: Record<VendorCategoryKey, string[]> = {
  VENUE_RENTAL: [
    'Confirm hall capacity fits guest count with comfortable dining space',
    'Verify fire safety NOC, electrical backup, and green generator clearance',
    'Check parking capacity and valet logistics arrangements',
    'Review sound curfew policy (outdoor audio cutoff at 22:00 PM)',
    'Confirm air-conditioning tonnage and power backup switchover SLA',
    'Inspect bridal / VIP green rooms with private attached restrooms',
    'Verify outside catering and decor vendor corkage fees',
    'Establish setup access window (minimum 6 hours before event starts)',
    'Review cancellation refund milestones and weather acts-of-god clauses',
    'Sign venue SLA and lock 20% post-event damage holdback',
  ],
  CATERING_FNB: [
    'Lock menu tasting date with head chef and dietary specialist',
    'Confirm per-plate cost breakdown including water and welcome drinks',
    'Verify separate kitchen / utensils for pure Jain and vegan prep',
    'Establish live station count (chaat, dosa, dessert counters)',
    'Review buffet replenishment SLA (maximum 5-minute refill delay)',
    'Confirm server uniform, hairnets, and hygiene certifications',
    'Lock 10% food quantity safety buffer calculation',
    'Confirm leftover food donation partnership with local NGO',
    'Lock 30/50/20 payment schedule (20% holdback pending guest satisfaction)',
    'Inspect food warmers, ice supply, and clean drinking water dispensers',
  ],
  DECOR_FLORAL: [
    'Approve 3D stage/mandap rendering and dimension diagram',
    'Confirm fresh flower sourcing schedule (morning delivery)',
    'Check entrance arch structural stability and wind-load resistance',
    'Verify photo booth lighting and custom backdrop typography',
    'Confirm table centerpiece height (under 12 inches for sightlines)',
    'Review eco-friendly / zero-foam biodegradable material commitment',
    'Establish floral teardown and composting handoff protocol',
    'Inspect brass lamps, carpets, and aisle runner placement',
    'Lock contingency floral supply for weather wilt replacement',
    'Enforce 20% holdback until complete teardown and venue cleanup',
  ],
  PHOTO_VIDEO: [
    'Review portfolio of candidate lead candid and traditional photographers',
    'Lock shot list: family portraits, ritual key moments, VIP arrivals',
    'Verify drone flying permit and outdoor battery backup count (min 4)',
    'Confirm delivery SLA: 48-hr teaser highlights, 30-day master album',
    'Review dual-slot memory backup and cloud storage redundancy protocol',
    'Confirm lead photographer presence in contract (no unannounced junior sub)',
    'Lock raw uncompressed footage delivery clause',
    'Schedule pre-event couple / family walkthrough interview',
    'Confirm crew meal arrangements during continuous shoots',
    'Lock 20% post-event holdback until high-res digital gallery delivery',
  ],
  AV_LIGHT_SOUND: [
    'Perform acoustic check and speaker placement simulation',
    'Verify 4K LED wall pixel pitch (P2.5 or better) and video playback laptop',
    'Confirm wireless microphone count (min 4 handheld + 2 lapel mics)',
    'Review stage lighting profile (warm white for faces, intelligent beams)',
    'Check dedicated generator line for sensitive audio mixing console',
    'Confirm DJ playlist cues and Do-Not-Play blacklist with host',
    'Schedule soundcheck 2 hours prior to guest arrival',
    'Lock outdoor volume throttle for municipal 22:00 PM curfew compliance',
    'Verify spare audio cables, DI boxes, and backup amplifier on site',
    'Enforce 20% holdback until flawless event conclusion',
  ],
  ATTIRE_HMU_VIP: [
    'Schedule hair and makeup trial session 3 weeks prior to event',
    'Confirm wardrobe steaming and trousseau draping assistance crew',
    'Lock on-site arrival time for makeup artists (T-4 hours before event)',
    'Verify allergy patch test for cosmetic products',
    'Confirm VIP guest welcoming scarves, garlands, and corsages',
    'Review green room mirror lighting and high-power blower outlets',
    'Confirm emergency touch-up kit availability throughout event',
    'Lock bride/groom footwear comfort and blister prevention pack',
    'Review transportation escort for VIP chief guests and elderly family',
    'Sign artist SLA with 20% completion release',
  ],
  ENTERTAINMENT: [
    'Review emcee script, bilingual crowd engagement, and pronunciation guide',
    'Lock live band / artist tech rider and acoustic sound requirements',
    'Prepare interactive party games and age-calibrated activity roster',
    'Verify kids zone supervisor and safety first-aid certifications',
    'Review background ambient music playlists for meal intervals',
    'Confirm stage entrance announcements and fanfare cues',
    'Verify artist arrival 90 minutes prior to call time',
    'Lock guest dance-floor protocol and DJ extension hourly rate cap',
    'Review stage security buffer during celebrity / VIP performances',
    'Release final tranche only upon successful program delivery',
  ],
  INVITES_SIGNAGE: [
    'Proofread invite text, muhurtham times, Google Maps QR, and dress code',
    'Test digital WhatsApp interactive card delivery across iOS and Android',
    'Verify directional signages (Parking, Dining, Restrooms, Green Rooms)',
    'Confirm easel stands and welcome board placement at foyer entrance',
    'Print physical badges / attendee wristbands with QR codes',
    'Prepare VIP reserved table signage cards',
    'Review emergency exit and first-aid station navigational signs',
    'Confirm digital guest RSVP dietary tally update to kitchen lead',
    'Inspect typography contrast against background lighting',
    'Verify print proof color fidelity before full press run',
  ],
  GIFTS_SWAG: [
    'Calculate exact return gift / swag bag count with 10% safety margin',
    'Confirm eco-friendly reusable jute/paper bag packaging',
    'Verify customization (attendee names, event date, monogram logo)',
    'Inspect goodie bag contents for dietary and age safety (no loose nuts)',
    'Organize distribution desk handover roster and checkoff sheet',
    'Arrange safe storage room close to exit doors',
    'Prepare specialized VIP speaker / chief guest mementos and shawls',
    'Confirm return gift delivery to venue 24 hours prior to event',
    'Verify quality of edible treats and manufacturing expiry dates',
    'Reconcile unused gifts for donation or post-event storage',
  ],
  TRANSPORT_STAY: [
    'Audit outstation guest travel itinerary and flight/train arrivals',
    'Contract hotel room block with complimentary breakfast and late checkout',
    'Confirm airport/station shuttle schedule and assigned driver contacts',
    'Arrange valet parking attendants with claim tickets and insurance coverage',
    'Inspect coach/bus cleanliness, working air-conditioning, and luggage space',
    'Create guest WhatsApp transport concierge group with live GPS tracking',
    'Prepare welcome snack and hydration hampers in guest hotel rooms',
    'Review return transfer schedule for departure day',
    'Confirm driver standby allowance and overtime hourly cap',
    'Finalize hotel room incidentals policy (personal bar vs host folio)',
  ],
  SECURITY_CLEAN: [
    'Deploy licensed crowd security personnel at 1:25 ratio for large crowds',
    'Establish dedicated bag check and metal detection checkpoint at entry',
    'Station certified paramedic and first-aid emergency responder kit on site',
    'Confirm emergency ambulance route and nearest hospital notification',
    'Position discrete housekeeping staff for continuous restroom cleaning',
    'Deploy color-coded waste segregation bins (Wet, Dry, Recyclable)',
    'Inspect fire extinguisher charge tags and emergency exit clearance',
    'Review lost-and-found desk protocol and central announcement channel',
    'Lock post-event deep cleaning and venue handover inspection checklist',
    'Release final payment upon zero-damage clearance from venue authority',
  ],
  LOGISTICS_MISC: [
    'Secure municipal, police, and copyright music licenses (PPL/IPRS)',
    'Procure ceremonial ritual items (samagri, lamps, sacred cloth, oils)',
    'Prepare master stationery kit (gaffer tape, zip ties, scissors, markers)',
    'Verify high-speed event Wi-Fi router coverage and guest credentials',
    'Set up mobile charging station kiosks in common lounge areas',
    'Confirm umbrella escort team for sudden weather changes',
    'Review emergency cash buffer in local currency for incidental tips',
    'Establish centralized two-way radio / walkie-talkie channel chart',
    'Conduct master run-through briefing with all 12 category leads',
    'Archive final invoices, receipts, and vendor clearance certificates',
  ],
};

/**
 * Initializes 12 vendor category records with domain checklists and 30/50/20 payment tranches.
 */
export function initializeVendorRecords(budget: BudgetSummary): VendorRecord[] {
  return budget.categories.map((cat) => {
    const checklistTitles = DOMAIN_CHECKLIST_TEMPLATES[cat.key] || [];
    const checklistItems: VendorChecklistItem[] = checklistTitles.map((title, idx) => ({
      id: `${cat.key}-chk-${idx + 1}`,
      category: cat.key,
      taskTitle: title,
      completed: idx < 2, // Default first 2 discovery checks completed
      isMandatorySafetyOrSLA: idx === 1 || idx === 8,
    }));

    const advancePaidPct = 30;
    const eventDayTranchePct = 50;
    const postEventHoldbackPct = 20;

    return {
      category: cat.key,
      categoryLabel: cat.label,
      vendorName: `Partner ${cat.label.split(' ')[0]} Specialist`,
      contactEmailOrPhone: 'vendor@auraplan-partner.com',
      allocatedBudget: cat.allocatedAmount,
      quotedPrice: cat.allocatedAmount,
      advancePaidPct,
      eventDayTranchePct,
      postEventHoldbackPct,
      bookingStatus: 'SHORTLISTED',
      highAdvanceRiskFlag: advancePaidPct > 50,
      checklistItems,
      readinessScorePct: calculateVendorReadiness(checklistItems, advancePaidPct),
    };
  });
}

/**
 * Computes vendor readiness percentage based on checklist items and payment state.
 */
export function calculateVendorReadiness(
  items: VendorChecklistItem[],
  advancePaidPct: number
): number {
  if (items.length === 0) return 0;
  const completedCount = items.filter((i) => i.completed).length;
  const checklistRatio = completedCount / items.length;

  // 80% weight on checklist tasks, 20% weight on advance commitment
  const advanceRatio = Math.min(1.0, advancePaidPct / 30);
  const readiness = Math.round((checklistRatio * 80) + (advanceRatio * 20));
  return Math.min(100, Math.max(0, readiness));
}

/**
 * Evaluates payment advance risk. If upfront advance exceeds 50%, triggers risk warning.
 */
export function evaluateAdvanceRisk(advancePct: number): { isHighRisk: boolean; message: string } {
  if (advancePct > 50) {
    return {
      isHighRisk: true,
      message: `High Advance Risk: Demanding a ${advancePct}% advance exceeds the safe 35% benchmark. A 20% holdback clause is strongly advised.`,
    };
  }
  return {
    isHighRisk: false,
    message: 'Safe Payment Tranche Structure (Standard 30% Advance / 50% Execution / 20% Holdback)',
  };
}
