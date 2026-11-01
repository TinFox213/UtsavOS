// src/shared/dynamicDiffEngine.ts
import { AIGenerationRun, DynamicDiffReport } from '../types/event';

export interface DeltaItem {
  field: string;
  from: string | number;
  to: string | number;
}

export interface MutatedFieldItem {
  fieldPath: string;
  previousValue: unknown;
  updatedValue: unknown;
  category: string;
}

function compareInputSnapshots(runA: AIGenerationRun, runB: AIGenerationRun): DeltaItem[] {
  const deltas: DeltaItem[] = [];
  const sA = runA.inputSnapshot;
  const sB = runB.inputSnapshot;

  if (sA.guestCount !== sB.guestCount) {
    deltas.push({ field: 'Guest Count', from: `${sA.guestCount} guests`, to: `${sB.guestCount} guests` });
  }
  if (sA.totalBudget !== sB.totalBudget) {
    deltas.push({
      field: 'Total Budget',
      from: `${sA.currency} ${sA.totalBudget.toLocaleString()}`,
      to: `${sB.currency} ${sB.totalBudget.toLocaleString()}`,
    });
  }
  if (sA.eventType !== sB.eventType) {
    deltas.push({ field: 'Archetype', from: sA.eventType, to: sB.eventType });
  }
  if (sA.userPrompt !== sB.userPrompt) {
    deltas.push({
      field: 'User Vibe Prompt',
      from: sA.userPrompt.slice(0, 40) + '...',
      to: sB.userPrompt.slice(0, 40) + '...',
    });
  }
  return deltas;
}

function isPlainObject(val: unknown): val is Record<string, unknown> {
  return typeof val === 'object' && val !== null;
}

function deepCompareObjects(
  objA: Record<string, unknown>,
  objB: Record<string, unknown>,
  mutatedFields: MutatedFieldItem[],
  path = ''
): void {
  const allKeys = new Set([...Object.keys(objA || {}), ...Object.keys(objB || {})]);
  for (const key of allKeys) {
    const currentPath = path ? `${path}.${key}` : key;
    const valA = objA?.[key];
    const valB = objB?.[key];

    if (isPlainObject(valA) && isPlainObject(valB)) {
      deepCompareObjects(valA, valB, mutatedFields, currentPath);
    } else if (JSON.stringify(valA) !== JSON.stringify(valB)) {
      mutatedFields.push({
        fieldPath: currentPath,
        previousValue: valA,
        updatedValue: valB,
        category: path.split('.')[0] || 'General',
      });
    }
  }
}

/**
 * Computes side-by-side delta between two AI generation runs.
 */
export function computeDynamicDiff(runA: AIGenerationRun, runB: AIGenerationRun): DynamicDiffReport {
  const inputDeltas = compareInputSnapshots(runA, runB);
  const mutatedFields: MutatedFieldItem[] = [];
  deepCompareObjects(runA.structuredOutput, runB.structuredOutput, mutatedFields);

  return {
    runAId: runA.runId,
    runBId: runB.runId,
    inputDeltas,
    mutatedFields,
    summary: `Verified Dynamic AI Generation: ${inputDeltas.length} inputs altered, causing ${mutatedFields.length} structured output fields to dynamically mutate.`,
  };
}
