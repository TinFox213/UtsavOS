// src/utils/icsExport.ts
import { TimelineMilestone, RunOfShowSlot } from '../types/event';

export function generateIcsCalendar(
  eventName: string,
  city: string,
  milestones: TimelineMilestone[],
  _runOfShow?: RunOfShowSlot[]
): string {
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//AuraPlan AI//UtsavOS Event Planner//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:AuraPlan - ${eventName}`,
  ];

  milestones.forEach((m) => {
    const dt = m.dueDateIso.replace(/-/g, '');
    lines.push(
      'BEGIN:VEVENT',
      `UID:${m.id}@auraplan.ai`,
      `DTSTAMP:${dt}T090000Z`,
      `DTSTART;VALUE=DATE:${dt}`,
      `SUMMARY:[${m.phaseLabel}] ${m.title}`,
      `DESCRIPTION:Owner: ${m.owner}\\nDeliverable: ${m.deliverableCheck}`,
      `LOCATION:${city}`,
      'STATUS:CONFIRMED',
      'END:VEVENT'
    );
  });

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

export function downloadIcsFile(fileName: string, icsContent: string): void {
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
