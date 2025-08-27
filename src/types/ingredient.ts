import { z } from 'zod';

export const IngredientSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Le nom de l\'ingrédient est requis'),
  quantity: z.number().positive('La quantité doit être positive'),
  unit: z.string().min(1, 'L\'unité est requise'),
  category: z.enum([
    'fruits-legumes',
    'viandes-poissons',
    'produits-laitiers',
    'cereales-feculents',
    'condiments-epices',
    'huiles-graisses',
    'autres'
  ]).optional(),
  available: z.boolean().default(true),
  expirationDate: z.string().optional(),
  nutritionalInfo: z.object({
    calories: z.number().optional(),
    proteins: z.number().optional(),
    carbs: z.number().optional(),
    fats: z.number().optional(),
  }).optional(),
  allergens: z.array(z.string()).optional(),
  isOrganic: z.boolean().default(false),
  estimatedPrice: z.number().optional(),
  lastUsed: z.string().optional(),
});

export type Ingredient = z.infer<typeof IngredientSchema>;

export const IngredientCategorySchema = z.enum([
  'fruits-legumes',
  'viandes-poissons',
  'produits-laitiers',
  'cereales-feculents',
  'condiments-epices',
  'huiles-graisses',
  'autres'
]);

export type IngredientCategory = z.infer<typeof IngredientCategorySchema>;

export const ingredientCategories: Record<IngredientCategory, string> = {
  'fruits-legumes': 'Fruits & Légumes',
  'viandes-poissons': 'Viandes & Poissons',
  'produits-laitiers': 'Produits Laitiers',
  'cereales-feculents': 'Céréales & Féculents',
  'condiments-epices': 'Condiments & Épices',
  'huiles-graisses': 'Huiles & Graisses',
  'autres': 'Autres',
};

export const commonUnits = [
  'g', 'kg', 'ml', 'l', 'cl', 'dl',
  'cuillère à soupe', 'cuillère à café',
  'tasse', 'verre', 'pincée',
  'pièce', 'tranche', 'gousse',
  'branche', 'botte', 'boîte',
] as const;

export type Unit = typeof commonUnits[number];
