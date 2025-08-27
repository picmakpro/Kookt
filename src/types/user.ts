import { z } from 'zod';
import { DietaryRestrictionSchema } from './recipe';

export const UserPreferencesSchema = z.object({
  dietaryRestrictions: z.array(DietaryRestrictionSchema),
  allergens: z.array(z.string()),
  dislikedIngredients: z.array(z.string()),
  preferredCuisines: z.array(z.string()),
  cookingSkillLevel: z.enum(['debutant', 'intermediaire', 'avance']),
  availableCookingTime: z.enum(['15min', '30min', '1h', '2h+', 'pas-de-limite']),
  budgetPreference: z.enum(['economique', 'moyen', 'premium']),
  preferredServings: z.number().min(1).max(12).default(2),
  kitchenEquipment: z.array(z.enum([
    'four',
    'micro-ondes',
    'plaque-cuisson',
    'friteuse',
    'robot-cuisine',
    'mixeur',
    'autocuiseur',
    'barbecue',
    'wok',
    'steamer'
  ])),
  notificationsEnabled: z.boolean().default(true),
  shareDataForImprovement: z.boolean().default(false),
});

export const UserProfileSchema = z.object({
  id: z.string(),
  email: z.string().email().optional(),
  name: z.string().optional(),
  avatar: z.string().optional(),
  
  preferences: UserPreferencesSchema,
  
  // Statistiques d'utilisation
  stats: z.object({
    recipesGenerated: z.number().min(0).default(0),
    recipesCooked: z.number().min(0).default(0),
    favoriteRecipes: z.number().min(0).default(0),
    totalCookingTime: z.number().min(0).default(0), // en minutes
    ingredientsSaved: z.number().min(0).default(0),
    lastActiveAt: z.string().optional(),
  }),
  
  // Authentification
  authProvider: z.enum(['email', 'google', 'apple', 'guest']).optional(),
  isPremium: z.boolean().default(false),
  premiumExpiresAt: z.string().optional(),
  
  // Métadonnées
  createdAt: z.string(),
  updatedAt: z.string(),
  onboardingCompleted: z.boolean().default(false),
  appVersion: z.string().optional(),
});

export type UserPreferences = z.infer<typeof UserPreferencesSchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;

export const CookingSkillLevelSchema = z.enum(['debutant', 'intermediaire', 'avance']);
export type CookingSkillLevel = z.infer<typeof CookingSkillLevelSchema>;

export const BudgetPreferenceSchema = z.enum(['economique', 'moyen', 'premium']);
export type BudgetPreference = z.infer<typeof BudgetPreferenceSchema>;

export const cookingSkillLabels: Record<CookingSkillLevel, string> = {
  'debutant': 'Débutant',
  'intermediaire': 'Intermédiaire',
  'avance': 'Avancé',
};

export const budgetLabels: Record<BudgetPreference, string> = {
  'economique': 'Économique',
  'moyen': 'Moyen',
  'premium': 'Premium',
};

export const cookingTimeLabels = {
  '15min': '15 minutes max',
  '30min': '30 minutes max',
  '1h': '1 heure max',
  '2h+': '2 heures ou plus',
  'pas-de-limite': 'Pas de limite',
} as const;

export const kitchenEquipmentLabels = {
  'four': 'Four',
  'micro-ondes': 'Micro-ondes',
  'plaque-cuisson': 'Plaque de cuisson',
  'friteuse': 'Friteuse',
  'robot-cuisine': 'Robot de cuisine',
  'mixeur': 'Mixeur',
  'autocuiseur': 'Autocuiseur',
  'barbecue': 'Barbecue',
  'wok': 'Wok',
  'steamer': 'Cuiseur vapeur',
} as const;

// Type pour l'onboarding
export interface OnboardingData {
  step: number;
  preferences: Partial<UserPreferences>;
  completed: boolean;
}
