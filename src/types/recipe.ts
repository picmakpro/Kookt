import { z } from 'zod';
import { IngredientSchema } from './ingredient';

export const RecipeStepSchema = z.object({
  id: z.string(),
  order: z.number().min(1),
  instruction: z.string().min(1, 'L\'instruction ne peut pas être vide'),
  duration: z.number().optional(), // en minutes
  temperature: z.number().optional(), // en degrés Celsius
  tips: z.string().optional(),
  isCompleted: z.boolean().default(false),
});

export const NutritionSchema = z.object({
  calories: z.number().min(0),
  proteins: z.number().min(0),
  carbs: z.number().min(0),
  fats: z.number().min(0),
  fiber: z.number().min(0).optional(),
  sugar: z.number().min(0).optional(),
  sodium: z.number().min(0).optional(),
});

export const RecipeSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Le titre est requis'),
  description: z.string().min(1, 'La description est requise'),
  imageUrl: z.string().optional(),
  prepTime: z.number().min(0), // en minutes
  cookTime: z.number().min(0), // en minutes
  totalTime: z.number().min(0), // calculé automatiquement
  servings: z.number().min(1).max(20),
  difficulty: z.enum(['facile', 'moyen', 'difficile']),
  cuisine: z.string().optional(), // ex: 'française', 'italienne', 'asiatique'
  
  ingredients: z.array(IngredientSchema),
  steps: z.array(RecipeStepSchema),
  
  nutrition: NutritionSchema.optional(),
  
  tags: z.array(z.string()),
  dietary: z.array(z.enum([
    'vegetarien',
    'vegan',
    'sans-gluten',
    'sans-lactose',
    'halal',
    'casher',
    'paleo',
    'keto',
    'low-carb',
    'high-protein'
  ])),
  allergens: z.array(z.string()),
  
  // Métadonnées
  createdAt: z.string(),
  updatedAt: z.string(),
  author: z.string().default('Kookt IA'),
  source: z.string().optional(),
  aiGenerated: z.boolean().default(true),
  
  // Interactions utilisateur
  rating: z.number().min(0).max(5).optional(),
  userNotes: z.string().optional(),
  isFavorite: z.boolean().default(false),
  cookCount: z.number().min(0).default(0),
  lastCookedAt: z.string().optional(),
  
  // Coût estimé
  estimatedCost: z.object({
    total: z.number().min(0),
    perServing: z.number().min(0),
    currency: z.string().default('EUR'),
  }).optional(),
  
  // Substitutions suggérées
  substitutions: z.array(z.object({
    originalIngredient: z.string(),
    alternatives: z.array(z.string()),
    reason: z.string().optional(),
  })).optional(),
});

export type Recipe = z.infer<typeof RecipeSchema>;
export type RecipeStep = z.infer<typeof RecipeStepSchema>;
export type Nutrition = z.infer<typeof NutritionSchema>;

export const DifficultySchema = z.enum(['facile', 'moyen', 'difficile']);
export type Difficulty = z.infer<typeof DifficultySchema>;

export const DietaryRestrictionSchema = z.enum([
  'vegetarien',
  'vegan',
  'sans-gluten',
  'sans-lactose',
  'halal',
  'casher',
  'paleo',
  'keto',
  'low-carb',
  'high-protein'
]);
export type DietaryRestriction = z.infer<typeof DietaryRestrictionSchema>;

export const difficultyLabels: Record<Difficulty, string> = {
  'facile': 'Facile',
  'moyen': 'Moyen',
  'difficile': 'Difficile',
};

export const dietaryLabels: Record<DietaryRestriction, string> = {
  'vegetarien': 'Végétarien',
  'vegan': 'Vegan',
  'sans-gluten': 'Sans Gluten',
  'sans-lactose': 'Sans Lactose',
  'halal': 'Halal',
  'casher': 'Casher',
  'paleo': 'Paléo',
  'keto': 'Kéto',
  'low-carb': 'Pauvre en Glucides',
  'high-protein': 'Riche en Protéines',
};

// Types pour la génération IA
export interface RecipeGenerationRequest {
  ingredients: string[];
  dietaryRestrictions: DietaryRestriction[];
  allergens: string[];
  maxTime?: number;
  servings?: number;
  budgetLevel?: 'economique' | 'moyen' | 'premium';
  goals?: string[]; // ex: ['protéiné', 'anti-gaspillage', 'rapide']
  cuisine?: string;
  difficulty?: Difficulty;
}

export interface RecipeGenerationResponse {
  recipes: Recipe[];
  metadata: {
    generatedAt: string;
    processingTime: number;
    aiModel: string;
    confidence: number;
  };
}
