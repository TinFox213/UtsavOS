// src/components/onboarding/EventParametersSection.tsx
import React from 'react';
import { Sparkles, Users, Calendar } from 'lucide-react';
import { EventArchetype, CurrencyCode } from '../../types/event';

export interface EventParametersData {
  archetype: EventArchetype;
  eventName: string;
  eventDate: string;
  city: string;
  currency: CurrencyCode;
  guestCount: number;
  totalBudget: number;
  userPrompt: string;
}

interface EventParametersSectionProps {
  formData: EventParametersData;
  errors: Record<string, string>;
  onFieldChange: (field: string, value: unknown) => void;
}

const ARCHETYPE_CARDS = [
  { type: 'WEDDING' as const, label: 'Weddings & Multi-Day Ceremonies', icon: Sparkles },
  { type: 'BIRTHDAY' as const, label: 'Birthdays & Milestone Galas', icon: Users },
  { type: 'COMMUNITY_EVENT' as const, label: 'Community Events & Tech Fests', icon: Calendar },
];

/**
 * Event parameter inputs including archetype selection cards, budget, date, and guest count.
 */
export const EventParametersSection: React.FC<EventParametersSectionProps> = ({
  formData,
  errors,
  onFieldChange,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-2">Select Celebration Archetype *</label>
        <div role="radiogroup" aria-label="Celebration archetype selection" className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {ARCHETYPE_CARDS.map((card) => {
            const Icon = card.icon;
            const isSelected = formData.archetype === card.type;
            return (
              <button
                key={card.type}
                type="button"
                role="radio"
                aria-checked={isSelected}
                aria-pressed={isSelected}
                onClick={() => onFieldChange('archetype', card.type)}
                className={`p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <Icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} aria-hidden="true" />
                <div className="font-bold text-sm text-slate-900">{card.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <label htmlFor="eventName" className="block text-xs font-bold text-slate-700 mb-1">
            Event Title *
          </label>
          <input
            id="eventName"
            type="text"
            value={formData.eventName}
            onChange={(e) => onFieldChange('eventName', e.target.value)}
            onFocus={() => onFieldChange('eventName', formData.eventName)}
            className="w-full text-base font-medium px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/20 bg-white"
          />
        </div>

        <div>
          <label htmlFor="eventDate" className="block text-xs font-bold text-slate-700 mb-1">
            Target Event Date *
          </label>
          <input
            id="eventDate"
            type="date"
            value={formData.eventDate}
            onChange={(e) => onFieldChange('eventDate', e.target.value)}
            onFocus={() => onFieldChange('eventDate', formData.eventDate)}
            aria-invalid={Boolean(errors.eventDate)}
            aria-describedby={errors.eventDate ? 'err-eventDate' : undefined}
            className="w-full text-base font-medium px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/20 bg-white"
          />
          {errors.eventDate && (
            <p id="err-eventDate" className="text-xs text-rose-600 mt-1">
              {errors.eventDate}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="city" className="block text-xs font-bold text-slate-700 mb-1">
            City / Location *
          </label>
          <input
            id="city"
            type="text"
            value={formData.city}
            onChange={(e) => onFieldChange('city', e.target.value)}
            onFocus={() => onFieldChange('city', formData.city)}
            className="w-full text-base font-medium px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/20 bg-white"
          />
        </div>

        <div>
          <label htmlFor="guestCount" className="block text-xs font-bold text-slate-700 mb-1">
            Guest Count (N) *
          </label>
          <input
            id="guestCount"
            type="number"
            value={formData.guestCount}
            onChange={(e) => onFieldChange('guestCount', Number(e.target.value))}
            onFocus={() => onFieldChange('guestCount', formData.guestCount)}
            className="w-full text-base font-medium px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/20 bg-white tabular-nums"
          />
        </div>

        <div>
          <label htmlFor="totalBudget" className="block text-xs font-bold text-slate-700 mb-1">
            Total Budget ({formData.currency}) *
          </label>
          <input
            id="totalBudget"
            type="number"
            value={formData.totalBudget}
            onChange={(e) => onFieldChange('totalBudget', Number(e.target.value))}
            onFocus={() => onFieldChange('totalBudget', formData.totalBudget)}
            aria-invalid={Boolean(errors.totalBudget)}
            aria-describedby={errors.totalBudget ? 'err-totalBudget' : undefined}
            className="w-full text-base font-medium px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/20 bg-white tabular-nums"
          />
          {errors.totalBudget && (
            <p id="err-totalBudget" className="text-xs text-rose-600 mt-1">
              {errors.totalBudget}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="userPrompt" className="block text-xs font-bold text-slate-700 mb-1">
          Personalized Theme, Decor Vibe & Dietary Needs (Prompt for Gemini 2.5 Flash)
        </label>
        <textarea
          id="userPrompt"
          rows={3}
          value={formData.userPrompt}
          onChange={(e) => onFieldChange('userPrompt', e.target.value)}
          onFocus={() => onFieldChange('userPrompt', formData.userPrompt)}
          className="w-full text-base font-medium px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/20 bg-white"
          placeholder="e.g. Eco-friendly Chettinad floral decor with brass lamps and banana leaf feast with 40 Jain-safe meals..."
        />
      </div>
    </div>
  );
};
