// src/shared/timelineEngine.ts
import {
  EventArchetype,
  TimelineMilestone,
  RunOfShowSlot,
  VendorCategoryKey,
} from '../types/event';

export interface GenerateTimelineParams {
  archetype: EventArchetype;
  eventDateIso: string;
  referenceDateIso?: string;
}

interface MilestoneTemplate {
  id: string;
  title: string;
  relativeDays: number;
  category: VendorCategoryKey;
  priority: 'CRITICAL' | 'HIGH' | 'NORMAL';
  owner: string;
  deliverableCheck: string;
}

/**
 * Calculates lead days between reference date and event date.
 */
export function calculateLeadDays(eventDateIso: string, referenceDateIso?: string): number {
  const eventDate = new Date(eventDateIso);
  const refDate = referenceDateIso ? new Date(referenceDateIso) : new Date();
  eventDate.setHours(0, 0, 0, 0);
  refDate.setHours(0, 0, 0, 0);

  const diffMs = eventDate.getTime() - refDate.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

function getEarlyMilestones(
  archetype: EventArchetype,
  leadDays: number,
  isExpressSprint: boolean
): MilestoneTemplate[] {
  const weddingTitle = 'Finalize Venue & Mandapam Contract & Capacity Permits';
  const genericTitle = 'Finalize Venue Contract & Capacity Permits';
  const m1Days = Math.min(leadDays, isExpressSprint ? Math.max(1, Math.round(leadDays * 0.9)) : 90);
  const m2Days = Math.min(leadDays, isExpressSprint ? Math.max(1, Math.round(leadDays * 0.75)) : 60);
  const m3Days = Math.min(leadDays, isExpressSprint ? Math.max(1, Math.round(leadDays * 0.6)) : 45);
  const m4Days = Math.min(leadDays, isExpressSprint ? Math.max(1, Math.round(leadDays * 0.5)) : 30);

  return [
    { id: 'm1', title: archetype === 'WEDDING' ? weddingTitle : genericTitle, relativeDays: m1Days, category: 'VENUE_RENTAL', priority: 'CRITICAL', owner: 'Lead Planner', deliverableCheck: 'Signed contract and advance deposit paid' },
    { id: 'm2', title: 'Tasting Session & Finalize Per-Plate Menu', relativeDays: m2Days, category: 'CATERING_FNB', priority: 'CRITICAL', owner: 'Catering Lead', deliverableCheck: 'Dietary breakdown approved and per-plate cost locked' },
    { id: 'm3', title: 'Stage, Lighting & Decor Moodboard Sign-off', relativeDays: m3Days, category: 'DECOR_FLORAL', priority: 'HIGH', owner: 'Decor Lead', deliverableCheck: 'Color palette and floral BOM confirmed' },
    { id: 'm4', title: 'Dispatch Digital E-Invites & Open RSVP Form', relativeDays: m4Days, category: 'INVITES_SIGNAGE', priority: 'HIGH', owner: 'Host / Comm Lead', deliverableCheck: 'WhatsApp/Email broadcast dispatched' },
  ];
}

function getLateMilestones(leadDays: number, isExpressSprint: boolean): MilestoneTemplate[] {
  return [
    {
      id: 'm5',
      title: 'Book AV, Soundcheck Schedule & Emcee Script',
      relativeDays: Math.min(leadDays, isExpressSprint ? Math.max(1, Math.round(leadDays * 0.3)) : 14),
      category: 'AV_LIGHT_SOUND',
      priority: 'NORMAL',
      owner: 'Tech Lead',
      deliverableCheck: 'Microphones, playlist cues, and LED wall specs verified',
    },
    {
      id: 'm6',
      title: 'Final Headcount Lock & Dietary Balance Review',
      relativeDays: Math.min(leadDays, isExpressSprint ? Math.max(1, Math.round(leadDays * 0.2)) : 7),
      category: 'CATERING_FNB',
      priority: 'CRITICAL',
      owner: 'Catering Lead',
      deliverableCheck: 'Final guest attendance transmitted to kitchen',
    },
    {
      id: 'm7',
      title: 'Vendor Readiness SLA & Balance Payment Holdback Check',
      relativeDays: 1,
      category: 'LOGISTICS_MISC',
      priority: 'CRITICAL',
      owner: 'Lead Planner',
      deliverableCheck: 'All 12 vendors confirmed for on-time arrival',
    },
  ];
}

function getMilestoneTemplates(
  archetype: EventArchetype,
  leadDays: number,
  isExpressSprint: boolean
): MilestoneTemplate[] {
  return [
    ...getEarlyMilestones(archetype, leadDays, isExpressSprint),
    ...getLateMilestones(leadDays, isExpressSprint),
  ];
}

/**
 * Generates macro countdown milestones from T-180d to T-1d.
 */
export function generateCountdownMilestones(params: GenerateTimelineParams): TimelineMilestone[] {
  const { archetype, eventDateIso, referenceDateIso } = params;
  const leadDays = calculateLeadDays(eventDateIso, referenceDateIso);
  if (leadDays < 0) {
    throw new Error('Event date cannot be in the past. Please choose today or a future date.');
  }

  const isExpressSprint = leadDays < 30;
  const templates = getMilestoneTemplates(archetype, leadDays, isExpressSprint);
  const eventDateObj = new Date(eventDateIso);

  return templates.map((m) => {
    const dueDate = new Date(eventDateObj);
    dueDate.setDate(dueDate.getDate() - m.relativeDays);
    let phaseLabel = `T-${m.relativeDays} Days`;
    if (m.relativeDays === 1) phaseLabel = 'T-1 Day (Eve)';
    if (m.relativeDays === 0) phaseLabel = 'Event Day';
    if (isExpressSprint) phaseLabel = `Sprint T-${m.relativeDays}d`;

    return {
      id: m.id,
      title: m.title,
      phaseLabel,
      dueDateIso: dueDate.toISOString().slice(0, 10),
      daysBeforeEvent: m.relativeDays,
      category: m.category,
      priority: m.priority,
      status: 'PENDING',
      owner: m.owner,
      deliverableCheck: m.deliverableCheck,
    };
  });
}

function getWeddingMorningSlots(): RunOfShowSlot[] {
  return [
    { id: 'ros-w1', startTimeMinutes: 420, durationMinutes: 90, bufferMinutes: 15, title: 'Bridal & Groom HMU and Mandap Floral Setup', category: 'ATTIRE_HMU_VIP', owner: 'Styling & Decor Crew', dependsOnIds: [], isCriticalPath: true, delayAppliedMinutes: 0, hasCurfewConflict: false, notes: 'Mandap sacred zone flowers must be fresh by 08:30 AM' },
    { id: 'ros-w2', startTimeMinutes: 525, durationMinutes: 45, bufferMinutes: 15, title: 'Baraat / Welcoming of Guests & Nadaswaram', category: 'ENTERTAINMENT', owner: 'Family Coordinators', dependsOnIds: ['ros-w1'], isCriticalPath: true, delayAppliedMinutes: 0, hasCurfewConflict: false, notes: 'Welcome drinks and flower petals ready at entrance' },
    { id: 'ros-w3', startTimeMinutes: 585, durationMinutes: 90, bufferMinutes: 20, title: 'Muhurtham & Sacred Ceremony Rituals', category: 'LOGISTICS_MISC', owner: 'Priest / Officiant', dependsOnIds: ['ros-w2'], isCriticalPath: true, delayAppliedMinutes: 0, hasCurfewConflict: false, notes: 'Auspicious muhurtham window strictly 09:45 to 11:15 AM' },
  ];
}

function getWeddingEveningSlots(): RunOfShowSlot[] {
  return [
    {
      id: 'ros-w4',
      startTimeMinutes: 695,
      durationMinutes: 120,
      bufferMinutes: 30,
      title: 'Traditional Wedding Feast (Banana Leaf Catering)',
      category: 'CATERING_FNB',
      owner: 'Head Chef',
      dependsOnIds: ['ros-w3'],
      isCriticalPath: true,
      delayAppliedMinutes: 0,
      hasCurfewConflict: false,
      notes: 'Continuous dining batches with dedicated Jain/Vegan service lines',
    },
    {
      id: 'ros-w5',
      startTimeMinutes: 1140,
      durationMinutes: 180,
      bufferMinutes: 15,
      title: 'Grand Evening Reception & Musical Performance',
      category: 'AV_LIGHT_SOUND',
      owner: 'Stage Manager',
      dependsOnIds: ['ros-w4'],
      isCriticalPath: false,
      delayAppliedMinutes: 0,
      hasCurfewConflict: false,
      notes: 'Outdoor amplified music curfew cutoff is 22:00 PM',
    },
  ];
}

function getWeddingRunOfShowSlots(): RunOfShowSlot[] {
  return [...getWeddingMorningSlots(), ...getWeddingEveningSlots()];
}

function getCommunityDaySlots(): RunOfShowSlot[] {
  return [
    { id: 'ros-c1', startTimeMinutes: 480, durationMinutes: 60, bufferMinutes: 15, title: 'Participant Check-In, QR Entry & Swag Distribution', category: 'INVITES_SIGNAGE', owner: 'Volunteer Desk', dependsOnIds: [], isCriticalPath: true, delayAppliedMinutes: 0, hasCurfewConflict: false, notes: 'Verify digital QR entry passes and hand over lanyards' },
    { id: 'ros-c2', startTimeMinutes: 555, durationMinutes: 45, bufferMinutes: 10, title: 'Opening Keynote & Problem Statement Release', category: 'AV_LIGHT_SOUND', owner: 'Event Chair', dependsOnIds: ['ros-c1'], isCriticalPath: true, delayAppliedMinutes: 0, hasCurfewConflict: false, notes: 'Test live stream, lavalier mic, and screen projection' },
    { id: 'ros-c3', startTimeMinutes: 610, durationMinutes: 300, bufferMinutes: 30, title: 'Hacking Sprint 1 & Mentorship Rounds', category: 'LOGISTICS_MISC', owner: 'Technical Mentors', dependsOnIds: ['ros-c2'], isCriticalPath: true, delayAppliedMinutes: 0, hasCurfewConflict: false, notes: 'Continuous Wi-Fi and power grid load monitoring' },
  ];
}

function getCommunityEveningSlots(): RunOfShowSlot[] {
  return [
    {
      id: 'ros-c4',
      startTimeMinutes: 940,
      durationMinutes: 60,
      bufferMinutes: 15,
      title: 'Sponsor Showcase & High-Tea Networking',
      category: 'CATERING_FNB',
      owner: 'Hospitality Lead',
      dependsOnIds: ['ros-c3'],
      isCriticalPath: false,
      delayAppliedMinutes: 0,
      hasCurfewConflict: false,
      notes: 'Coffee, tea, and packaged snacks in foyer',
    },
    {
      id: 'ros-c5',
      startTimeMinutes: 1140,
      durationMinutes: 120,
      bufferMinutes: 0,
      title: 'Top-10 Pitches, Award Ceremony & DJ Night',
      category: 'ENTERTAINMENT',
      owner: 'Lead Emcee',
      dependsOnIds: ['ros-c4'],
      isCriticalPath: true,
      delayAppliedMinutes: 0,
      hasCurfewConflict: false,
      notes: 'Outdoor sound curfew strictly 22:00 PM (1320 minutes)',
    },
  ];
}

function getCommunityRunOfShowSlots(): RunOfShowSlot[] {
  return [...getCommunityDaySlots(), ...getCommunityEveningSlots()];
}

/**
 * Generates baseline minute-by-minute Event Day Run-of-Show.
 */
export function generateEventDayRunOfShow(archetype: EventArchetype): RunOfShowSlot[] {
  return archetype === 'WEDDING' ? getWeddingRunOfShowSlots() : getCommunityRunOfShowSlots();
}

/**
 * Propagates an operational delay through the Run-of-Show dependency graph.
 */
export function applyTimelineDelay(
  runOfShow: RunOfShowSlot[],
  delayedNodeId: string,
  delayMinutes: number
): RunOfShowSlot[] {
  const nodeMap = new Map<string, RunOfShowSlot>();
  runOfShow.forEach((node) => nodeMap.set(node.id, { ...node }));

  const target = nodeMap.get(delayedNodeId);
  if (!target) return runOfShow;

  const netShift = Math.max(0, delayMinutes - target.bufferMinutes);
  target.delayAppliedMinutes += delayMinutes;
  target.durationMinutes += delayMinutes;

  const visited = new Set<string>();
  const queue: Array<{ id: string; shift: number }> = [{ id: delayedNodeId, shift: netShift }];

  while (queue.length > 0) {
    const item = queue.shift()!;
    if (visited.has(item.id)) continue;
    visited.add(item.id);

    for (const [, node] of nodeMap.entries()) {
      if (node.dependsOnIds.includes(item.id)) {
        node.startTimeMinutes += item.shift;
        if (node.startTimeMinutes + node.durationMinutes > 1320) {
          node.hasCurfewConflict = true;
        }
        queue.push({ id: node.id, shift: item.shift });
      }
    }
  }

  return Array.from(nodeMap.values());
}
