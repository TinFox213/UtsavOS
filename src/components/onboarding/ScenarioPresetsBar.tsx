// src/components/onboarding/ScenarioPresetsBar.tsx
import React from 'react';
import { BookmarkCheck } from 'lucide-react';
import { ARCHETYPE_PRESETS } from '../../data/archetypeSeeds';

interface ScenarioPresetsBarProps {
  onSelectPreset: (presetId: string) => void;
}

/**
 * Quick 1-click scenario preset selector for testing archetype presets.
 */
export const ScenarioPresetsBar: React.FC<ScenarioPresetsBarProps> = ({ onSelectPreset }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-400 font-medium">Quick Presets:</span>
      {ARCHETYPE_PRESETS.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => onSelectPreset(p.id)}
          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
        >
          <BookmarkCheck className="w-3.5 h-3.5 text-indigo-500" aria-hidden="true" />
          {p.archetype === 'WEDDING' ? 'Wedding' : p.archetype === 'BIRTHDAY' ? 'Birthday' : 'Hackathon'}
        </button>
      ))}
    </div>
  );
};
