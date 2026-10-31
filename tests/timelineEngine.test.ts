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
