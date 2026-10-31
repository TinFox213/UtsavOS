// src/schemas/validationSchemas.ts
import { z } from 'zod';

export const OrganizerAndEventInputSchema = z.object({
  organizerName: z
    .string()
    .trim()
    .min(2, 'Organizer name must be at least 2 characters.')
    .max(80, 'Organizer name cannot exceed 80 characters.'),

  organizerEmail: z
    .string()
    .trim()
    .regex(
      /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/,
      'Email domain must include a valid TLD (e.g., .com, .org, .in).'
    ),

  eventName: z
    .string()
    .trim()
    .min(3, 'Event title must be at least 3 characters.')
    .max(120, 'Event title cannot exceed 120 characters.'),

  eventType: z.enum(['WEDDING', 'BIRTHDAY', 'COMMUNITY_EVENT'], {
    errorMap: () => ({ message: 'Please select a valid event archetype.' }),
  }),

  subType: z.string().trim().min(2, 'Event sub-type is required.'),

  eventDate: z.string().refine((dateStr) => {
    const parsed = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return !isNaN(parsed.getTime()) && parsed >= today;
  }, 'Event date cannot be in the past. Please choose today or a future date.'),

  city: z
    .string()
    .trim()
    .min(2, 'City / Location is required.')
    .max(80, 'City name cannot exceed 80 characters.'),

  currency: z.enum(['INR', 'USD', 'EUR', 'GBP']),

  guestCount: z
    .number({ invalid_type_error: 'Guest count must be a valid number.' })
    .int('Guest count must be a whole number.')
    .min(5, 'Minimum guest count is 5.')
    .max(50000, 'Guest count exceeds single-venue safety cap (50,000).'),

  totalBudget: z
    .number({ invalid_type_error: 'Budget must be a valid numeric amount.' })
    .positive('Total budget must be greater than 0.')
    .max(1000000000, 'Budget exceeds maximum supported limit (1,000,000,000).'),

  userPrompt: z
    .string()
    .max(1000, 'Custom prompt cannot exceed 1,000 characters.')
    .refine(
      (val) => !/(ignore previous instructions|reveal system prompt|system instructions|<script)/i.test(val),
      'Security Guardrail: Input contains restricted instruction-override or script patterns.'
    ),
});

export type ValidatedOrganizerAndEventInput = z.infer<typeof OrganizerAndEventInputSchema>;

export const QuickFieldValidators = {
  isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email.trim());
  },
  isFutureDate(dateStr: string): boolean {
    const parsed = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return !isNaN(parsed.getTime()) && parsed >= today;
  },
  isPositiveBudget(budget: number): boolean {
    return typeof budget === 'number' && !isNaN(budget) && budget > 0;
  },
};
