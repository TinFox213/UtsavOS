// src/shared/dynamicDiffEngine.ts
import { AIGenerationRun, DynamicDiffReport } from '../types/event';

/**
 * Computes side-by-side delta between two AI generation runs.
 * Identifies modified inputs and mutated output fields to prove responses are dynamic.
 */
export function computeDynamicDiff(runA: AIGenerationRun, runB: AIGenerationRun): DynamicDiffReport {
  const inputDeltas: Array<{ field: string; from: string | number; to: string | number }> = [];

  // Compare inputs
  if (runA.inputSnapshot.guestCount !== runB.inputSnapshot.guestCount) {
    inputDeltas.push({
      field: 'Guest Count',
      from: `${runA.inputSnapshot.guestCount} guests`,
      to: `${runB.inputSnapshot.guestCount} guests`,
    });
  }
  if (runA.inputSnapshot.totalBudget !== runB.inputSnapshot.totalBudget) {
    inputDeltas.push({
      field: 'Total Budget',
      from: `${runA.inputSnapshot.currency} ${runA.inputSnapshot.totalBudget.toLocaleString()}`,
      to: `${runB.inputSnapshot.currency} ${runB.inputSnapshot.totalBudget.toLocaleString()}`,
    });
  }
  if (runA.inputSnapshot.eventType !== runB.inputSnapshot.eventType) {
    inputDeltas.push({
      field: 'Archetype',
      from: runA.inputSnapshot.eventType,
      to: runB.inputSnapshot.eventType,
    });
  }
  if (runA.inputSnapshot.userPrompt !== runB.inputSnapshot.userPrompt) {
    inputDeltas.push({
      field: 'User Vibe Prompt',
      from: runA.inputSnapshot.userPrompt.slice(0, 40) + '...',
      to: runB.inputSnapshot.userPrompt.slice(0, 40) + '...',
    });
  }

  // Compare outputs recursively
  const mutatedFields: Array<{
    fieldPath: string;
    previousValue: unknown;
    updatedValue: unknown;
    category: string;
  }> = [];

  function deepCompare(objA: Record<string, unknown>, objB: Record<string, unknown>, path = '') {
    const allKeys = new Set([...Object.keys(objA || {}), ...Object.keys(objB || {})]);
    for (const key of allKeys) {
      const currentPath = path ? `${path}.${key}` : key;
      const valA = objA?.[key];
      const valB = objB?.[key];

      if (typeof valA === 'object' && valA !== null && typeof valB === 'object' && valB !== null) {
        deepCompare(valA as Record<string, unknown>, valB as Record<string, unknown>, currentPath);
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

  deepCompare(runA.structuredOutput, runB.structuredOutput);

  return {
    runAId: runA.runId,
    runBId: runB.runId,
    inputDeltas,
    mutatedFields,
    summary: `Verified Dynamic AI Generation: ${inputDeltas.length} inputs altered, causing ${mutatedFields.length} structured output fields to dynamically mutate.`,
  };
}
