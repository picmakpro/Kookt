import { z } from 'zod';
import { 
  RecipeSchema, 
  IngredientSchema, 
  UserPreferencesSchema,
  ShoppingListSchema 
} from '../types';

// Validation des recettes
export const validateRecipe = (data: unknown) => {
  try {
    return RecipeSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation de recette échouée: ${error.errors.map(e => e.message).join(', ')}`);
    }
    throw error;
  }
};

// Validation des ingrédients
export const validateIngredient = (data: unknown) => {
  try {
    return IngredientSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation d'ingrédient échouée: ${error.errors.map(e => e.message).join(', ')}`);
    }
    throw error;
  }
};

// Validation des préférences utilisateur
export const validateUserPreferences = (data: unknown) => {
  try {
    return UserPreferencesSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation des préférences échouée: ${error.errors.map(e => e.message).join(', ')}`);
    }
    throw error;
  }
};

// Validation des listes de courses
export const validateShoppingList = (data: unknown) => {
  try {
    return ShoppingListSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation de liste de courses échouée: ${error.errors.map(e => e.message).join(', ')}`);
    }
    throw error;
  }
};

// Validation d'email
export const validateEmail = (email: string): boolean => {
  const emailSchema = z.string().email();
  return emailSchema.safeParse(email).success;
};

// Validation de mot de passe
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Le mot de passe doit contenir au moins 8 caractères');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une majuscule');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une minuscule');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un chiffre');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validation de nom d'ingrédient
export const validateIngredientName = (name: string): boolean => {
  if (!name || name.trim().length === 0) return false;
  if (name.length > 100) return false;
  // Accepte lettres, espaces, tirets, apostrophes, parenthèses
  const validChars = /^[a-zA-ZÀ-ÿ\s\-'()]+$/;
  return validChars.test(name.trim());
};

// Validation de quantité
export const validateQuantity = (quantity: number): boolean => {
  return quantity > 0 && quantity <= 10000 && Number.isFinite(quantity);
};

// Validation de temps de cuisson
export const validateCookingTime = (time: number): boolean => {
  return time >= 0 && time <= 1440 && Number.isInteger(time); // Max 24h
};

// Validation de nombre de portions
export const validateServings = (servings: number): boolean => {
  return servings >= 1 && servings <= 20 && Number.isInteger(servings);
};

// Sanitisation de texte
export const sanitizeText = (text: string): string => {
  return text
    .trim()
    .replace(/\s+/g, ' ') // Remplace multiples espaces par un seul
    .replace(/[<>]/g, '') // Supprime < et >
    .substring(0, 1000); // Limite à 1000 caractères
};

// Validation d'URL d'image
export const validateImageUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
};

// Validation de données JSON
export const validateJson = (jsonString: string): { isValid: boolean; data?: any; error?: string } => {
  try {
    const data = JSON.parse(jsonString);
    return { isValid: true, data };
  } catch (error) {
    return { 
      isValid: false, 
      error: error instanceof Error ? error.message : 'JSON invalide' 
    };
  }
};

// Helpers pour les erreurs de validation
export const formatValidationError = (error: z.ZodError): string[] => {
  return error.errors.map(err => {
    const path = err.path.join('.');
    return `${path}: ${err.message}`;
  });
};

export const isValidationError = (error: unknown): error is z.ZodError => {
  return error instanceof z.ZodError;
};
