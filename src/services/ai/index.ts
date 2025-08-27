import { openAIService } from './openai';
import { Recipe, RecipeGenerationRequest } from '../../types/recipe';

// Interface unifiée pour les services IA
export interface AIService {
  generateRecipe(request: RecipeGenerationRequest): Promise<Recipe>;
  generateIngredientSuggestions(partialInput: string): Promise<string[]>;
  improveRecipe(recipe: Recipe, feedback: string): Promise<Recipe>;
  isConfigured(): boolean;
}

// Service IA principal (peut basculer entre OpenAI et Claude)
class MainAIService implements AIService {
  private currentProvider: AIService;

  constructor() {
    // Utilise OpenAI par défaut, pourra être étendu avec Claude
    this.currentProvider = openAIService;
  }

  async generateRecipe(request: RecipeGenerationRequest): Promise<Recipe> {
    if (!this.currentProvider.isConfigured()) {
      throw new Error('Service IA non configuré. Veuillez ajouter votre clé API.');
    }

    const startTime = Date.now();
    
    try {
      const recipe = await this.currentProvider.generateRecipe(request);
      const processingTime = Date.now() - startTime;
      
      console.log(`Recette générée en ${processingTime}ms`);
      return recipe;
      
    } catch (error) {
      console.error('Erreur génération recette:', error);
      
      // Fallback vers recette exemple en cas d'erreur
      if (error instanceof Error && error.message.includes('API')) {
        throw new Error('Service IA temporairement indisponible. Veuillez réessayer.');
      }
      
      throw error;
    }
  }

  async generateIngredientSuggestions(partialInput: string): Promise<string[]> {
    if (!this.currentProvider.isConfigured()) {
      // Retourne des suggestions par défaut si l'IA n'est pas configurée
      return this.getFallbackSuggestions(partialInput);
    }

    try {
      return await this.currentProvider.generateIngredientSuggestions(partialInput);
    } catch (error) {
      console.error('Erreur suggestions IA:', error);
      return this.getFallbackSuggestions(partialInput);
    }
  }

  async improveRecipe(recipe: Recipe, feedback: string): Promise<Recipe> {
    if (!this.currentProvider.isConfigured()) {
      throw new Error('Service IA non configuré pour l\'amélioration de recettes.');
    }

    return await this.currentProvider.improveRecipe(recipe, feedback);
  }

  isConfigured(): boolean {
    return this.currentProvider.isConfigured();
  }

  // Suggestions de fallback sans IA
  private getFallbackSuggestions(partialInput: string): string[] {
    const commonIngredients = [
      'tomate', 'oignon', 'ail', 'carotte', 'pomme de terre',
      'courgette', 'aubergine', 'poivron', 'brocoli', 'épinards',
      'poulet', 'bœuf', 'porc', 'saumon', 'thon',
      'œuf', 'lait', 'beurre', 'fromage', 'yaourt',
      'riz', 'pâtes', 'pain', 'farine', 'quinoa',
      'huile d\'olive', 'sel', 'poivre', 'basilic', 'persil',
      'citron', 'pomme', 'banane', 'orange', 'fraise'
    ];

    const input = partialInput.toLowerCase().trim();
    
    return commonIngredients
      .filter(ingredient => ingredient.toLowerCase().startsWith(input))
      .slice(0, 5);
  }

  // Méthode pour changer de provider (future extension)
  switchProvider(provider: 'openai' | 'claude') {
    switch (provider) {
      case 'openai':
        this.currentProvider = openAIService;
        break;
      case 'claude':
        // TODO: Implémenter Claude
        throw new Error('Claude pas encore implémenté');
      default:
        throw new Error('Provider IA non supporté');
    }
  }
}

export const aiService = new MainAIService();
export { openAIService };
