// src/components/vendor/VendorChecklistItem.tsx
import React from 'react';
import { CheckSquare, Square } from 'lucide-react';
import { VendorCategoryKey } from '../../types/event';

interface VendorChecklistItemProps {
  id: string;
  category: VendorCategoryKey;
  taskTitle: string;
  completed: boolean;
  onToggle: (category: VendorCategoryKey, checkId: string) => void;
}

/**
 * Individual checklist deliverable item with accessible checkbox button.
 */
export const VendorChecklistItem: React.FC<VendorChecklistItemProps> = ({
  id,
  category,
  taskTitle,
  completed,
  onToggle,
}) => {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={completed}
      aria-label={`${taskTitle}: ${completed ? 'completed' : 'pending'}`}
      onClick={() => onToggle(category, id)}
      className={`p-2.5 rounded-lg border text-xs text-left flex items-start gap-2.5 cursor-pointer transition-all w-full ${
        completed ? 'bg-emerald-50 border-emerald-200 text-slate-800' : 'bg-white border-slate-200 text-slate-600'
      }`}
    >
      {completed ? (
        <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
      ) : (
        <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" aria-hidden="true" />
      )}
      <span className={completed ? 'line-through text-slate-400' : ''}>{taskTitle}</span>
    </button>
  );
};
