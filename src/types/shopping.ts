import { z } from 'zod';
import { IngredientCategorySchema } from './ingredient';

export const ShoppingListItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  quantity: z.number().positive(),
  unit: z.string(),
  category: IngredientCategorySchema,
  estimatedPrice: z.number().positive().optional(),
  isChecked: z.boolean().default(false),
  recipeId: z.string().optional(), // Recette d'origine
  recipeName: z.string().optional(),
  isOptional: z.boolean().default(false),
  alternatives: z.array(z.string()).optional(),
  notes: z.string().optional(),
  addedAt: z.string(),
});

export const ShoppingListSchema = z.object({
  id: z.string(),
  name: z.string().default('Ma liste de courses'),
  items: z.array(ShoppingListItemSchema),
  totalEstimatedPrice: z.number().min(0).default(0),
  currency: z.string().default('EUR'),
  createdAt: z.string(),
  updatedAt: z.string(),
  isArchived: z.boolean().default(false),
  sharedWith: z.array(z.string()).optional(), // IDs des utilisateurs
  lastShoppingDate: z.string().optional(),
});

export type ShoppingListItem = z.infer<typeof ShoppingListItemSchema>;
export type ShoppingList = z.infer<typeof ShoppingListSchema>;

// Groupement par catégorie pour l'affichage
export interface ShoppingListByCategory {
  category: string;
  items: ShoppingListItem[];
  totalPrice: number;
  checkedCount: number;
  totalCount: number;
}

// Export des listes
export interface ShoppingListExport {
  format: 'text' | 'whatsapp' | 'notes' | 'email';
  content: string;
  subject?: string; // Pour email
}

// Statistiques de courses
export interface ShoppingStats {
  totalLists: number;
  totalItems: number;
  averagePrice: number;
  mostBoughtItems: Array<{
    name: string;
    count: number;
  }>;
  monthlySpending: Array<{
    month: string;
    amount: number;
  }>;
}
