import { create } from 'zustand';
import { Recipe, RecipeGenerationRequest } from '../types/recipe';
import { aiService } from '../services/ai';
import { storageService } from '../services/storage';

interface RecipeState {
  // État des recettes
  recipes: Recipe[];
  currentRecipe: Recipe | null;
  favoriteRecipes: Recipe[];
  recentRecipes: Recipe[];
  
  // État de génération IA
  isGenerating: boolean;
  isLoadingRecipes: boolean;
  generationError: string | null;
  lastGenerationRequest: RecipeGenerationRequest | null;
  
  // Filtres et recherche
  searchQuery: string;
  selectedDifficulty: string | null;
  selectedCuisine: string | null;
  selectedDietaryFilters: string[];
  
  // Actions de base
  setCurrentRecipe: (recipe: Recipe | null) => void;
  addRecipe: (recipe: Recipe) => Promise<void>;
  updateRecipe: (id: string, updates: Partial<Recipe>) => Promise<void>;
  deleteRecipe: (id: string) => Promise<void>;
  
  // Génération IA
  generateRecipes: (request: RecipeGenerationRequest) => Promise<Recipe | null>;
  regenerateRecipe: () => Promise<Recipe | null>;
  improveRecipe: (recipe: Recipe, feedback: string) => Promise<Recipe | null>;
  
  // Favoris
  toggleFavorite: (recipeId: string) => Promise<void>;
  loadFavorites: () => Promise<void>;
  
  // Interactions
  rateRecipe: (recipeId: string, rating: number) => Promise<void>;
  addUserNotes: (recipeId: string, notes: string) => Promise<void>;
  markAsCooked: (recipeId: string) => Promise<void>;
  
  // Recherche et filtres
  setSearchQuery: (query: string) => void;
  setDifficultyFilter: (difficulty: string | null) => void;
  setCuisineFilter: (cuisine: string | null) => void;
  setDietaryFilters: (filters: string[]) => void;
  clearFilters: () => void;
  
  // Utilitaires
  getFilteredRecipes: () => Recipe[];
  getRecipeById: (id: string) => Recipe | null;
  getRecipesByTag: (tag: string) => Recipe[];
  
  // Chargement
  loadRecipes: () => Promise<void>;
  loadRecentRecipes: () => Promise<void>;
  
  // Reset
  clearError: () => void;
  resetGenerationState: () => void;
}

export const useRecipeStore = create<RecipeState>((set, get) => ({
  // État initial
  recipes: [],
  currentRecipe: null,
  favoriteRecipes: [],
  recentRecipes: [],
  
  isGenerating: false,
  isLoadingRecipes: false,
  generationError: null,
  lastGenerationRequest: null,
  
  searchQuery: '',
  selectedDifficulty: null,
  selectedCuisine: null,
  selectedDietaryFilters: [],

  // Actions de base
  setCurrentRecipe: (recipe) => {
    set({ currentRecipe: recipe });
  },

  addRecipe: async (recipe) => {
    const { recipes } = get();
    const updatedRecipes = [recipe, ...recipes];
    
    set({ recipes: updatedRecipes });
    await storageService.saveRecipe(recipe);
  },

  updateRecipe: async (id, updates) => {
    const { recipes } = get();
    const updatedRecipes = recipes.map(recipe =>
      recipe.id === id 
        ? { ...recipe, ...updates, updatedAt: new Date().toISOString() }
        : recipe
    );
    
    set({ recipes: updatedRecipes });
    
    const updatedRecipe = updatedRecipes.find(r => r.id === id);
    if (updatedRecipe) {
      await storageService.saveRecipe(updatedRecipe);
    }
  },

  deleteRecipe: async (id) => {
    const { recipes, currentRecipe } = get();
    const filteredRecipes = recipes.filter(recipe => recipe.id !== id);
    
    set({ 
      recipes: filteredRecipes,
      currentRecipe: currentRecipe?.id === id ? null : currentRecipe
    });
    
    await storageService.deleteRecipe(id);
  },

  // Génération IA
  generateRecipes: async (request) => {
    set({ 
      isGenerating: true, 
      generationError: null,
      lastGenerationRequest: request
    });

    try {
      const recipe = await aiService.generateRecipe(request);
      
      // Ajouter la recette aux recettes existantes
      await get().addRecipe(recipe);
      
      set({ 
        isGenerating: false,
        currentRecipe: recipe
      });
      
      return recipe;
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur de génération inconnue';
      
      set({ 
        isGenerating: false,
        generationError: errorMessage
      });
      
      console.error('Erreur génération recette:', error);
      return null;
    }
  },

  regenerateRecipe: async () => {
    const { lastGenerationRequest } = get();
    if (!lastGenerationRequest) {
      set({ generationError: 'Aucune demande précédente trouvée' });
      return null;
    }
    
    return await get().generateRecipes(lastGenerationRequest);
  },

  improveRecipe: async (recipe, feedback) => {
    set({ isGenerating: true, generationError: null });

    try {
      const improvedRecipe = await aiService.improveRecipe(recipe, feedback);
      
      // Remplacer la recette existante
      await get().updateRecipe(recipe.id, improvedRecipe);
      
      set({ 
        isGenerating: false,
        currentRecipe: improvedRecipe
      });
      
      return improvedRecipe;
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur d\'amélioration';
      
      set({ 
        isGenerating: false,
        generationError: errorMessage
      });
      
      return null;
    }
  },

  // Favoris
  toggleFavorite: async (recipeId) => {
    const { recipes } = get();
    const recipe = recipes.find(r => r.id === recipeId);
    
    if (recipe) {
      await get().updateRecipe(recipeId, { 
        isFavorite: !recipe.isFavorite 
      });
      
      // Mettre à jour la liste des favoris
      await get().loadFavorites();
    }
  },

  loadFavorites: async () => {
    try {
      const favorites = await storageService.getFavoriteRecipes();
      set({ favoriteRecipes: favorites });
    } catch (error) {
      console.error('Erreur chargement favoris:', error);
    }
  },

  // Interactions
  rateRecipe: async (recipeId, rating) => {
    await get().updateRecipe(recipeId, { rating });
    await storageService.updateRecipeStats(recipeId, 'rated');
  },

  addUserNotes: async (recipeId, notes) => {
    await get().updateRecipe(recipeId, { userNotes: notes });
  },

  markAsCooked: async (recipeId) => {
    const { recipes } = get();
    const recipe = recipes.find(r => r.id === recipeId);
    
    if (recipe) {
      await get().updateRecipe(recipeId, {
        cookCount: (recipe.cookCount || 0) + 1,
        lastCookedAt: new Date().toISOString()
      });
      
      await storageService.updateRecipeStats(recipeId, 'cooked');
    }
  },

  // Recherche et filtres
  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },

  setDifficultyFilter: (difficulty) => {
    set({ selectedDifficulty: difficulty });
  },

  setCuisineFilter: (cuisine) => {
    set({ selectedCuisine: cuisine });
  },

  setDietaryFilters: (filters) => {
    set({ selectedDietaryFilters: filters });
  },

  clearFilters: () => {
    set({
      searchQuery: '',
      selectedDifficulty: null,
      selectedCuisine: null,
      selectedDietaryFilters: [],
    });
  },

  // Utilitaires
  getFilteredRecipes: () => {
    const { 
      recipes, 
      searchQuery, 
      selectedDifficulty, 
      selectedCuisine, 
      selectedDietaryFilters 
    } = get();

    return recipes.filter(recipe => {
      // Filtre par recherche
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = recipe.title.toLowerCase().includes(query);
        const matchesDescription = recipe.description.toLowerCase().includes(query);
        const matchesIngredients = recipe.ingredients.some(ing => 
          ing.name.toLowerCase().includes(query)
        );
        const matchesTags = recipe.tags.some(tag => 
          tag.toLowerCase().includes(query)
        );
        
        if (!matchesTitle && !matchesDescription && !matchesIngredients && !matchesTags) {
          return false;
        }
      }

      // Filtre par difficulté
      if (selectedDifficulty && recipe.difficulty !== selectedDifficulty) {
        return false;
      }

      // Filtre par cuisine
      if (selectedCuisine && recipe.cuisine !== selectedCuisine) {
        return false;
      }

      // Filtre par régimes alimentaires
      if (selectedDietaryFilters.length > 0) {
        const hasAllDietaryRestrictions = selectedDietaryFilters.every(filter =>
          recipe.dietary.includes(filter as any)
        );
        if (!hasAllDietaryRestrictions) {
          return false;
        }
      }

      return true;
    });
  },

  getRecipeById: (id) => {
    const { recipes } = get();
    return recipes.find(recipe => recipe.id === id) || null;
  },

  getRecipesByTag: (tag) => {
    const { recipes } = get();
    return recipes.filter(recipe => 
      recipe.tags.some(t => t.toLowerCase() === tag.toLowerCase())
    );
  },

  // Chargement
  loadRecipes: async () => {
    set({ isLoadingRecipes: true });
    
    try {
      const recipes = await storageService.getSavedRecipes();
      set({ 
        recipes: recipes.sort((a, b) => 
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        ),
        isLoadingRecipes: false 
      });
    } catch (error) {
      console.error('Erreur chargement recettes:', error);
      set({ isLoadingRecipes: false });
    }
  },

  loadRecentRecipes: async () => {
    const { recipes } = get();
    const recent = recipes
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 10);
    
    set({ recentRecipes: recent });
  },

  // Reset
  clearError: () => {
    set({ generationError: null });
  },

  resetGenerationState: () => {
    set({
      isGenerating: false,
      generationError: null,
      lastGenerationRequest: null
    });
  },
}));
