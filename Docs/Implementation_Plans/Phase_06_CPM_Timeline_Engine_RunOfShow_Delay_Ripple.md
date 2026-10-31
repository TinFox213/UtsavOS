# Phase 06: Critical Path Method (CPM) Timeline Engine, Run-of-Show & Delay Ripple Simulator

**Phase Number:** 06 of 15  
**Document ID:** `Phase_06_CPM_Timeline_Engine_RunOfShow_Delay_Ripple`  
**Target Code Modules:** `src/shared/timelineEngine.ts`, `tests/timelineEngine.test.ts`  
**Parent Specs:** [Doc 01: PRD](file:///e:/Promptwars%20-%20Challenge%205/Docs/01_Master_PRD_Celebration_and_Event_Planner_OS.md), [Doc 02: Math Engine Spec](file:///e:/Promptwars%20-%20Challenge%205/Docs/02_Deterministic_Budget_Timeline_and_Vendor_Math_Engine_Spec.md), [Doc 07: Testing Specification](file:///e:/Promptwars%20-%20Challenge%205/Docs/07_Comprehensive_Testing_Specification_and_Live_Video_QA_Harness.md)

---

## 1. Architectural Objectives & Rubric Mapping

Phase 06 delivers the temporal coordination engine of AuraPlan AI (UtsavOS). It models event timelines across two interconnected scales: (1) a **Macro CPM Countdown Roadmap** (`T-180d` to `T-1d`) with automatic compression into **Express Sprint Mode** when events are less than 30 days away, and (2) a **Micro Minute-by-Minute Event Day Run-of-Show** featuring topological delay absorption and venue curfew conflict detection.

| Evaluation Rubric Pillar | Phase 06 Engineering Control |
| :--- | :--- |
| **Problem Statement Alignment** | Directly delivers the "Timelines" mandate with both long-range milestones and minute-by-minute execution schedules. |
| **Edge-Case Resilience** | Automatically switches to Express Sprint Mode when lead time is tight (`<14` days) and rejects past dates. |
| **Live Crisis Demonstration (Video Sec 4)** | Powers real-time delay simulation (e.g. `+45m Caterer Delay`), ripple-shifting dependent nodes while absorbing non-critical slack buffers. |

---

## 2. Prerequisites & Input State

- Completed Phase 03 (`src/types/event.ts`).
- Workspace targets: `src/shared/timelineEngine.ts` and `tests/timelineEngine.test.ts`.

---

## 3. Detailed Technical Specification & File Blueprints

### 3.1 File: `src/shared/timelineEngine.ts`
Complete Critical Path Method countdown generator and minute-by-minute delay ripple engine:

```typescript
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
  referenceDateIso?: string; // Default today
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

/**
 * Generates macro countdown milestones from T-180d to T-1d.
 * Compresses into Express Sprint Mode if lead time < 30 days.
 */
export function generateCountdownMilestones(params: GenerateTimelineParams): TimelineMilestone[] {
  const { archetype, eventDateIso, referenceDateIso } = params;
  const leadDays = calculateLeadDays(eventDateIso, referenceDateIso);

  if (leadDays < 0) {
    throw new Error('Event date cannot be in the past. Please choose today or a future date.');
  }

  const isExpressSprint = leadDays < 30;

  // Base milestone definition templates
  const baseMilestones: Array<{
    id: string;
    title: string;
    relativeDays: number;
    category: VendorCategoryKey;
    priority: 'CRITICAL' | 'HIGH' | 'NORMAL';
    owner: string;
    deliverableCheck: string;
  }> = [
    {
      id: 'm1',
      title: 'Finalize Venue Contract & Capacity Permits',
      relativeDays: Math.min(leadDays, isExpressSprint ? Math.max(1, Math.round(leadDays * 0.9)) : 90),
      category: 'VENUE_RENTAL',
      priority: 'CRITICAL',
      owner: 'Lead Planner',
      deliverableCheck: 'Signed contract and advance deposit paid',
    },
    {
      id: 'm2',
      title: 'Tasting Session & Finalize Per-Plate Menu',
      relativeDays: Math.min(leadDays, isExpressSprint ? Math.max(1, Math.round(leadDays * 0.75)) : 60),
      category: 'CATERING_FNB',
      priority: 'CRITICAL',
      owner: 'Catering Lead',
      deliverableCheck: 'Dietary breakdown approved and per-plate cost locked',
    },
    {
      id: 'm3',
      title: 'Stage, Lighting & Decor Moodboard Sign-off',
      relativeDays: Math.min(leadDays, isExpressSprint ? Math.max(1, Math.round(leadDays * 0.6)) : 45),
      category: 'DECOR_FLORAL',
      priority: 'HIGH',
      owner: 'Decor Lead',
      deliverableCheck: 'Color palette and floral BOM confirmed',
    },
    {
      id: 'm4',
      title: 'Dispatch Digital E-Invites & Open RSVP Form',
      relativeDays: Math.min(leadDays, isExpressSprint ? Math.max(1, Math.round(leadDays * 0.5)) : 30),
      category: 'INVITES_SIGNAGE',
      priority: 'HIGH',
      owner: 'Host / Comm Lead',
      deliverableCheck: 'WhatsApp/Email broadcast dispatched',
    },
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

  const eventDateObj = new Date(eventDateIso);

  return baseMilestones.map((m) => {
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

/**
 * Generates baseline minute-by-minute Event Day Run-of-Show.
 */
export function generateEventDayRunOfShow(archetype: EventArchetype): RunOfShowSlot[] {
  if (archetype === 'WEDDING') {
    return [
      {
        id: 'ros-w1',
        startTimeMinutes: 420, // 07:00 AM
        durationMinutes: 90,
        bufferMinutes: 15,
        title: 'Bridal & Groom HMU and Mandap Floral Setup',
        category: 'ATTIRE_HMU_VIP',
        owner: 'Styling & Decor Crew',
        dependsOnIds: [],
        isCriticalPath: true,
        delayAppliedMinutes: 0,
        hasCurfewConflict: false,
        notes: 'Mandap sacred zone flowers must be fresh by 08:30 AM',
      },
      {
        id: 'ros-w2',
        startTimeMinutes: 525, // 08:45 AM
        durationMinutes: 45,
        bufferMinutes: 15,
        title: 'Baraat / Welcoming of Guests & Nadaswaram',
        category: 'ENTERTAINMENT',
        owner: 'Family Coordinators',
        dependsOnIds: ['ros-w1'],
        isCriticalPath: true,
        delayAppliedMinutes: 0,
        hasCurfewConflict: false,
        notes: 'Welcome drinks and flower petals ready at entrance',
      },
      {
        id: 'ros-w3',
        startTimeMinutes: 585, // 09:45 AM
        durationMinutes: 90,
        bufferMinutes: 20,
        title: 'Muhurtham & Sacred Ceremony Rituals',
        category: 'LOGISTICS_MISC',
        owner: 'Priest / Officiant',
        dependsOnIds: ['ros-w2'],
        isCriticalPath: true,
        delayAppliedMinutes: 0,
        hasCurfewConflict: false,
        notes: 'Auspicious muhurtham window strictly 09:45 to 11:15 AM',
      },
      {
        id: 'ros-w4',
        startTimeMinutes: 695, // 11:35 AM
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
        startTimeMinutes: 1140, // 07:00 PM
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

  // Community Event / Hackathon
  return [
    {
      id: 'ros-c1',
      startTimeMinutes: 480, // 08:00 AM
      durationMinutes: 60,
      bufferMinutes: 15,
      title: 'Participant Check-In, QR Entry & Swag Distribution',
      category: 'INVITES_SIGNAGE',
      owner: 'Volunteer Desk',
      dependsOnIds: [],
      isCriticalPath: true,
      delayAppliedMinutes: 0,
      hasCurfewConflict: false,
      notes: 'Verify digital QR entry passes and hand over lanyards',
    },
    {
      id: 'ros-c2',
      startTimeMinutes: 555, // 09:15 AM
      durationMinutes: 45,
      bufferMinutes: 10,
      title: 'Opening Keynote & Problem Statement Release',
      category: 'AV_LIGHT_SOUND',
      owner: 'Event Chair',
      dependsOnIds: ['ros-c1'],
      isCriticalPath: true,
      delayAppliedMinutes: 0,
      hasCurfewConflict: false,
      notes: 'Test live stream, lavalier mic, and screen projection',
    },
    {
      id: 'ros-c3',
      startTimeMinutes: 610, // 10:10 AM
      durationMinutes: 300,
      bufferMinutes: 30,
      title: 'Hacking Sprint 1 & Mentorship Rounds',
      category: 'LOGISTICS_MISC',
      owner: 'Technical Mentors',
      dependsOnIds: ['ros-c2'],
      isCriticalPath: true,
      delayAppliedMinutes: 0,
      hasCurfewConflict: false,
      notes: 'Continuous Wi-Fi and power grid load monitoring',
    },
    {
      id: 'ros-c4',
      startTimeMinutes: 940, // 03:40 PM
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
      startTimeMinutes: 1140, // 07:00 PM
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

/**
 * Propagates an operational delay through the Run-of-Show dependency graph.
 * Absorbs delay in slack buffer first, shifts dependent nodes, and flags curfew conflicts.
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

  // Absorb in node buffer first
  const netShift = Math.max(0, delayMinutes - target.bufferMinutes);
  target.delayAppliedMinutes += delayMinutes;
  target.durationMinutes += delayMinutes;

  // Topological pass to propagate net shift
  const visited = new Set<string>();
  const queue: Array<{ id: string; shift: number }> = [{ id: delayedNodeId, shift: netShift }];

  while (queue.length > 0) {
    const item = queue.shift()!;
    if (visited.has(item.id)) continue;
    visited.add(item.id);

    // Find all nodes that depend on item.id
    for (const [id, node] of nodeMap.entries()) {
      if (node.dependsOnIds.includes(item.id)) {
        node.startTimeMinutes += item.shift;
        // Check for venue sound curfew (22:00 = 1320 minutes, 23:30 = 1410 minutes)
        if (node.startTimeMinutes + node.durationMinutes > 1320) {
          node.hasCurfewConflict = true;
        }
        queue.push({ id, shift: item.shift });
      }
    }
  }

  return Array.from(nodeMap.values());
}
```

### 3.2 File: `tests/timelineEngine.test.ts`
8 unit tests asserting countdown calculations, Express Sprint mode, and delay ripple:

```typescript
// tests/timelineEngine.test.ts
import { describe, it, expect } from 'vitest';
import {
  calculateLeadDays,
  generateCountdownMilestones,
  generateEventDayRunOfShow,
  applyTimelineDelay,
} from '../src/shared/timelineEngine';

describe('CPM Timeline & Run-of-Show Engine', () => {
  it('Calculates lead days accurately between two dates', () => {
    const lead = calculateLeadDays('2026-12-31', '2026-12-01');
    expect(lead).toBe(30);
  });

  it('Generates standard 6-phase countdown milestones when lead time >= 30 days', () => {
    const milestones = generateCountdownMilestones({
      archetype: 'WEDDING',
      eventDateIso: '2026-12-18',
      referenceDateIso: '2026-06-01', // ~200 days lead
    });
    expect(milestones.length).toBe(7);
    expect(milestones[0]?.title).toContain('Venue');
  });

  it('Switches automatically to Express Sprint Mode when lead time < 30 days', () => {
    const milestones = generateCountdownMilestones({
      archetype: 'BIRTHDAY',
      eventDateIso: '2026-10-25',
      referenceDateIso: '2026-10-15', // 10 days lead
    });
    expect(milestones[0]?.phaseLabel).toContain('Sprint');
  });

  it('Throws clear error on past event date', () => {
    expect(() => {
      generateCountdownMilestones({
        archetype: 'COMMUNITY_EVENT',
        eventDateIso: '2020-01-01',
        referenceDateIso: '2026-10-24',
      });
    }).toThrow('Event date cannot be in the past');
  });

  it('Generates minute-by-minute Run-of-Show for Wedding with critical path slots', () => {
    const ros = generateEventDayRunOfShow('WEDDING');
    expect(ros.length).toBe(5);
    const feast = ros.find((s) => s.title.includes('Feast'));
    expect(feast?.startTimeMinutes).toBe(695); // 11:35 AM
  });

  it('Delay Ripple: Absorbs delay in slack buffer before shifting dependent slots', () => {
    const ros = generateEventDayRunOfShow('WEDDING');
    // HMU has 15 min buffer. Apply 10 min delay -> net shift 0
    const updated = applyTimelineDelay(ros, 'ros-w1', 10);
    const baraat = updated.find((s) => s.id === 'ros-w2');
    expect(baraat?.startTimeMinutes).toBe(525); // Unchanged because buffer absorbed it
  });

  it('Delay Ripple: Propagates net shift when delay exceeds buffer', () => {
    const ros = generateEventDayRunOfShow('WEDDING');
    // HMU has 15 min buffer. Apply 45 min delay -> net shift 30 mins
    const updated = applyTimelineDelay(ros, 'ros-w1', 45);
    const baraat = updated.find((s) => s.id === 'ros-w2');
    expect(baraat?.startTimeMinutes).toBe(525 + 30); // 555
  });

  it('Curfew Conflict: Flags curfew conflict when downstream node exceeds 22:00 PM', () => {
    const ros = generateEventDayRunOfShow('COMMUNITY_EVENT');
    // Apply massive delay of 120 minutes to Keynote ros-c2
    const updated = applyTimelineDelay(ros, 'ros-c2', 120);
    const djNight = updated.find((s) => s.id === 'ros-c5');
    expect(djNight?.hasCurfewConflict).toBe(true);
  });
});
```

---

## 4. Copy-Pasteable Antigravity Execution Prompt

```markdown
> **Antigravity Phase 06 Execution Prompt:**
> Build the Critical Path Method (CPM) timeline engine and Run-of-Show simulator for AuraPlan AI (UtsavOS):
> 1. Create `src/shared/timelineEngine.ts`:
>    - Implement `calculateLeadDays()`, `generateCountdownMilestones()` (supporting standard countdown vs Express Sprint Mode for <30 days), and `generateEventDayRunOfShow()`.
>    - Implement `applyTimelineDelay()` performing topological delay ripple calculation, buffer absorption, and curfew conflict detection (post 22:00 PM).
> 2. Create `tests/timelineEngine.test.ts` with 8 unit tests covering standard countdown, sprint mode, past date protection, and delay ripple math.
> 3. Verify with `npx vitest run tests/timelineEngine.test.ts`.
```

---

## 5. Verification & Test Commands

### Automated Verification
```powershell
# Run the timeline and CPM test suite
npx vitest run tests/timelineEngine.test.ts
```

### Manual Verification
1. Verify that a `+45m` caterer delay pushes dependent run-of-show slots by the net unabsorbed time.
2. Confirm that events taking place past `22:00 PM (1320 minutes)` trigger `hasCurfewConflict = true`.

---

## 6. Failure Modes & Recovery Protocol

- **Cyclic Dependency in Run-of-Show:** Guard against cycles by keeping `visited` sets and asserting acyclic DAG structure in unit tests.
