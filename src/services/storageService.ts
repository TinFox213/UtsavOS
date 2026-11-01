// src/services/storageService.ts
import { EventPlanState } from '../types/event';

const STORAGE_KEY = 'auraplan_event_state_v1';

export function isSafeHttpUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function isValidEventPlan(data: unknown): data is EventPlanState {
  if (!data || typeof data !== 'object') return false;
  const p = data as Record<string, unknown>;
  const hasStrings = typeof p['id'] === 'string' && typeof p['eventName'] === 'string' && typeof p['city'] === 'string';
  const hasBudget = typeof p['guestCount'] === 'number' && typeof p['budget'] === 'object' && p['budget'] !== null;
  const hasArrays = Array.isArray(p['milestones']) && Array.isArray(p['vendors']);
  return hasStrings && hasBudget && hasArrays;
}

export function saveEventPlanToStorage(plan: EventPlanState): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
    return true;
  } catch {
    return false;
  }
}

export function loadEventPlanFromStorage(): EventPlanState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isValidEventPlan(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function clearEventPlanStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Silent fallback
  }
}

function buildDossierHeader(plan: EventPlanState): string[] {
  return [
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
}

function buildDossierSections(plan: EventPlanState): string[] {
  const lines: string[] = [];
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
  return lines;
}

export function exportPlanAsMarkdown(plan: EventPlanState): string {
  const header = buildDossierHeader(plan);
  const sections = buildDossierSections(plan);
  return [...header, ...sections].join('\n');
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
  URL.revokeObjectURL(url);
}
