// src/data/archetypeSeeds.ts
import { EventArchetype, CurrencyCode, VendorCategoryKey } from '../types/event';

export interface ArchetypePreset {
  id: string;
  archetype: EventArchetype;
  title: string;
  subType: string;
  defaultGuestCount: number;
  defaultBudget: Record<CurrencyCode, number>;
  defaultLocation: string;
  defaultVibePrompt: string;
  categoryWeights: Record<VendorCategoryKey, number>;
  defaultDietarySplit: {
    vegetarianPct: number;
    veganPct: number;
    jainPct: number;
    halalPct: number;
    glutenFreeCount: number;
    nutAllergyCount: number;
  };
}

export const ARCHETYPE_PRESETS: ArchetypePreset[] = [
  {
    id: 'wedding-heritage',
    archetype: 'WEDDING',
    title: 'Priya & Karthik Royal Heritage Wedding',
    subType: 'South Indian Multi-Day Wedding & Reception',
    defaultGuestCount: 250,
    defaultBudget: {
      INR: 850000,
      USD: 10500,
      EUR: 9800,
      GBP: 8400,
    },
    defaultLocation: 'Chennai, Tamil Nadu',
    defaultVibePrompt:
      'Eco-friendly Chettinad floral decor with brass lamps, traditional nadaswaram welcome, zero plastic, and banana leaf feast with 40 Jain-safe meals.',
    categoryWeights: {
      VENUE_RENTAL: 0.20,
      CATERING_FNB: 0.30,
      DECOR_FLORAL: 0.14,
      PHOTO_VIDEO: 0.10,
      AV_LIGHT_SOUND: 0.05,
      ATTIRE_HMU_VIP: 0.07,
      ENTERTAINMENT: 0.04,
      INVITES_SIGNAGE: 0.02,
      GIFTS_SWAG: 0.03,
      TRANSPORT_STAY: 0.03,
      SECURITY_CLEAN: 0.01,
      LOGISTICS_MISC: 0.01,
    },
    defaultDietarySplit: {
      vegetarianPct: 70,
      veganPct: 10,
      jainPct: 15,
      halalPct: 0,
      glutenFreeCount: 12,
      nutAllergyCount: 6,
    },
  },
  {
    id: 'birthday-milestone',
    archetype: 'BIRTHDAY',
    title: 'Aarav 1st Birthday / Naming Ceremony Gala',
    subType: 'Milestone Theme Birthday Celebration',
    defaultGuestCount: 60,
    defaultBudget: {
      INR: 45000,
      USD: 600,
      EUR: 550,
      GBP: 470,
    },
    defaultLocation: 'Bangalore, Karnataka',
    defaultVibePrompt:
      'Whimsical pastel hot-air balloon theme with interactive sensory play zone, 3-tier custom berry cake, and personalized storybook return gifts.',
    categoryWeights: {
      VENUE_RENTAL: 0.18,
      CATERING_FNB: 0.34,
      DECOR_FLORAL: 0.15,
      PHOTO_VIDEO: 0.08,
      AV_LIGHT_SOUND: 0.07,
      ATTIRE_HMU_VIP: 0.04,
      ENTERTAINMENT: 0.06,
      INVITES_SIGNAGE: 0.02,
      GIFTS_SWAG: 0.04,
      TRANSPORT_STAY: 0.01,
      SECURITY_CLEAN: 0.005,
      LOGISTICS_MISC: 0.005,
    },
    defaultDietarySplit: {
      vegetarianPct: 60,
      veganPct: 15,
      jainPct: 10,
      halalPct: 0,
      glutenFreeCount: 4,
      nutAllergyCount: 2,
    },
  },
  {
    id: 'community-hackathon',
    archetype: 'COMMUNITY_EVENT',
    title: 'Inter-College AI Hackathon & Cultural Night',
    subType: 'College Tech/Cultural Fest & Hackathon',
    defaultGuestCount: 400,
    defaultBudget: {
      INR: 150000,
      USD: 2000,
      EUR: 1850,
      GBP: 1600,
    },
    defaultLocation: 'Coimbatore, Tamil Nadu',
    defaultVibePrompt:
      'High-energy cyberpunk neon stage with 4K LED wall, late-night cold brew & vegan snack stations, sponsor booth aisles, and student swag kits.',
    categoryWeights: {
      VENUE_RENTAL: 0.16,
      CATERING_FNB: 0.26,
      DECOR_FLORAL: 0.12,
      PHOTO_VIDEO: 0.06,
      AV_LIGHT_SOUND: 0.18,
      ATTIRE_HMU_VIP: 0.05,
      ENTERTAINMENT: 0.06,
      INVITES_SIGNAGE: 0.04,
      GIFTS_SWAG: 0.04,
      TRANSPORT_STAY: 0.01,
      SECURITY_CLEAN: 0.015,
      LOGISTICS_MISC: 0.005,
    },
    defaultDietarySplit: {
      vegetarianPct: 50,
      veganPct: 20,
      jainPct: 5,
      halalPct: 15,
      glutenFreeCount: 8,
      nutAllergyCount: 4,
    },
  },
];
