// src/services/storageService.ts
import { EventPlanState } from '../types/event';

const STORAGE_KEY = 'auraplan_event_state_v1';

export function saveEventPlanToStorage(plan: EventPlanState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
  } catch (err) {
    console.warn('Failed to save to localStorage:', err);
  }
}

export function loadEventPlanFromStorage(): EventPlanState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Exports complete plan as a formatted Markdown Dossier.
 */
export function exportPlanAsMarkdown(plan: EventPlanState): string {
  const lines: string[] = [
    `# Master Event Blueprint Dossier: ${plan.eventName}`,
    `**Archetype:** ${plan.archetype} (${plan.subType})`,
    `**Date:** ${plan.eventDateIso} | **Location:** ${plan.city}`,
    `**Organizer:** ${plan.organizer.fullName} (${plan.organizer.email})`,
    `**Guest Count:** ${plan.guestCount} | **Total Budget:** ${plan.currency} ${plan.budget.totalBudget.toLocaleString()}`,
    `**Feasibility Status:** ${plan.budget.feasibilityStatus} (Ratio: ${plan.budget.feasibilityRatio})`,
    '',
    '## 1. Budget Breakdown & Financial Shield',
    `- Contingency Reserve (8%): ${plan.currency} ${plan.budget.contingencyReserve.toLocaleString()}`,
    `- Estimated Tax Reserve (10%): ${plan.currency} ${plan.budget.estimatedTaxReserve.toLocaleString()}`,
    `- Net Allocatable Pool: ${plan.currency} ${plan.budget.netAllocatableBudget.toLocaleString()}`,
    '',
    '| Category | Allocated Amount | % Pool | Per Guest | Status |',
    '| :--- | :--- | :--- | :--- | :--- |',
  ];

  plan.budget.categories.forEach((c) => {
    const pct = ((c.allocatedAmount / plan.budget.netAllocatableBudget) * 100).toFixed(1);
    lines.push(
      `| ${c.label} | ${plan.currency} ${c.allocatedAmount.toLocaleString()} | ${pct}% | ${plan.currency} ${c.perCapitaAmount} | ${c.isLocked ? 'LOCKED' : 'DYNAMIC'} |`
    );
  });

  lines.push('', '## 2. CPM Countdown Roadmap');
  plan.milestones.forEach((m) => {
    lines.push(`- [${m.phaseLabel}] **${m.title}** (Due: ${m.dueDateIso}) — Owner: ${m.owner}`);
  });

  lines.push('', '## 3. Minute-by-Minute Run-of-Show');
  plan.runOfShow.forEach((s) => {
    lines.push(`- **${s.title}**: ${s.durationMinutes} mins (Buffer: ${s.bufferMinutes}m) — Owner: ${s.owner}`);
  });

  return lines.join('\n');
}

export function downloadTextFile(filename: string, text: string): void {
  const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
