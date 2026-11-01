// src/components/onboarding/OrganizerCredentialsSection.tsx
import React from 'react';
import { QuickFieldValidators } from '../../schemas/validationSchemas';

interface OrganizerCredentialsSectionProps {
  organizerName: string;
  organizerEmail: string;
  errors: Record<string, string>;
  onFieldChange: (field: string, value: string) => void;
}

/**
 * Organizer credentials section with live RFC-5322 email validation.
 */
export const OrganizerCredentialsSection: React.FC<OrganizerCredentialsSectionProps> = ({
  organizerName,
  organizerEmail,
  errors,
  onFieldChange,
}) => {
  const isEmailValid = QuickFieldValidators.isValidEmail(organizerEmail);

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
        Organizer Credentials & Contact Verification
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="organizerName" className="block text-xs font-bold text-slate-700 mb-1">
            Organizer Full Name *
          </label>
          <input
            id="organizerName"
            type="text"
            value={organizerName}
            onChange={(e) => onFieldChange('organizerName', e.target.value)}
            onFocus={() => onFieldChange('organizerName', organizerName)}
            aria-invalid={Boolean(errors.organizerName)}
            aria-describedby={errors.organizerName ? 'err-organizerName' : undefined}
            className="w-full text-base font-medium px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/20 bg-white"
            placeholder="Arikaran P"
          />
          {errors.organizerName && (
            <p id="err-organizerName" className="text-xs text-rose-600 mt-1">
              {errors.organizerName}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="organizerEmail" className="block text-xs font-bold text-slate-700 mb-1">
            Organizer Email (RFC-5322) *
          </label>
          <input
            id="organizerEmail"
            type="email"
            value={organizerEmail}
            onChange={(e) => onFieldChange('organizerEmail', e.target.value)}
            onFocus={() => onFieldChange('organizerEmail', organizerEmail)}
            aria-invalid={Boolean(errors.organizerEmail)}
            aria-describedby={errors.organizerEmail ? 'err-organizerEmail' : undefined}
            className={`w-full text-base font-medium px-4 py-2.5 rounded-xl border-2 ${
              isEmailValid ? 'border-emerald-500' : 'border-rose-500'
            } focus:ring-4 focus:ring-indigo-500/20 bg-white`}
            placeholder="john@example.com"
          />
          {errors.organizerEmail && (
            <p id="err-organizerEmail" className="text-xs text-rose-600 mt-1">
              {errors.organizerEmail}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
