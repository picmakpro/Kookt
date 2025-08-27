import AsyncStorage from '@react-native-async-storage/async-storage';
import { config } from '../../constants/config';
import { Recipe, UserProfile, ShoppingList } from '../../types';

class StorageService {
  // Méthodes génériques
  private async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error(`Erreur sauvegarde ${key}:`, error);
      throw new Error(`Impossible de sauvegarder ${key}`);
    }
  }

  private async getItem<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error(`Erreur lecture ${key}:`, error);
      return null;
    }
  }

  private async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Erreur suppression ${key}:`, error);
    }
  }

  // Gestion du profil utilisateur
  async saveUserProfile(profile: UserProfile): Promise<void> {
    await this.setItem(config.storage.keys.userPreferences, profile);
  }

  async getUserProfile(): Promise<UserProfile | null> {
    return await this.getItem<UserProfile>(config.storage.keys.userPreferences);
  }

  async clearUserProfile(): Promise<void> {
    await this.removeItem(config.storage.keys.userPreferences);
  }

  // Gestion des recettes sauvegardées
  async saveRecipes(recipes: Recipe[]): Promise<void> {
    await this.setItem(config.storage.keys.savedRecipes, recipes);
  }

  async getSavedRecipes(): Promise<Recipe[]> {
    const recipes = await this.getItem<Recipe[]>(config.storage.keys.savedRecipes);
    return recipes || [];
  }

  async saveRecipe(recipe: Recipe): Promise<void> {
    const existingRecipes = await this.getSavedRecipes();
    const updatedRecipes = existingRecipes.filter(r => r.id !== recipe.id);
    updatedRecipes.push(recipe);
    await this.saveRecipes(updatedRecipes);
  }

  async deleteRecipe(recipeId: string): Promise<void> {
    const existingRecipes = await this.getSavedRecipes();
    const filteredRecipes = existingRecipes.filter(r => r.id !== recipeId);
    await this.saveRecipes(filteredRecipes);
  }

  async getRecipe(recipeId: string): Promise<Recipe | null> {
    const recipes = await this.getSavedRecipes();
    return recipes.find(r => r.id === recipeId) || null;
  }

  // Gestion des recettes favorites
  async getFavoriteRecipes(): Promise<Recipe[]> {
    const recipes = await this.getSavedRecipes();
    return recipes.filter(r => r.isFavorite);
  }

  async toggleRecipeFavorite(recipeId: string): Promise<void> {
    const recipes = await this.getSavedRecipes();
    const updatedRecipes = recipes.map(recipe => 
      recipe.id === recipeId 
        ? { ...recipe, isFavorite: !recipe.isFavorite, updatedAt: new Date().toISOString() }
        : recipe
    );
    await this.saveRecipes(updatedRecipes);
  }

  // Gestion des listes de courses
  async saveShoppingList(shoppingList: ShoppingList): Promise<void> {
    await this.setItem(config.storage.keys.shoppingList, shoppingList);
  }

  async getShoppingList(): Promise<ShoppingList | null> {
    return await this.getItem<ShoppingList>(config.storage.keys.shoppingList);
  }

  async clearShoppingList(): Promise<void> {
    await this.removeItem(config.storage.keys.shoppingList);
  }

  // Gestion de l'onboarding
  async setOnboardingCompleted(completed: boolean): Promise<void> {
    await this.setItem(config.storage.keys.onboardingCompleted, completed);
  }

  async isOnboardingCompleted(): Promise<boolean> {
    const completed = await this.getItem<boolean>(config.storage.keys.onboardingCompleted);
    return completed || false;
  }

  // Historique des recherches d'ingrédients
  async saveRecentIngredients(ingredients: string[]): Promise<void> {
    const key = '@kookt:recentIngredients';
    // Garder seulement les 20 derniers
    const recent = ingredients.slice(0, 20);
    await this.setItem(key, recent);
  }

  async getRecentIngredients(): Promise<string[]> {
    const key = '@kookt:recentIngredients';
    const recent = await this.getItem<string[]>(key);
    return recent || [];
  }

  async addRecentIngredient(ingredient: string): Promise<void> {
    const recent = await this.getRecentIngredients();
    // Supprimer l'ingrédient s'il existe déjà
    const filtered = recent.filter(i => i.toLowerCase() !== ingredient.toLowerCase());
    // Ajouter en première position
    const updated = [ingredient, ...filtered].slice(0, 20);
    await this.saveRecentIngredients(updated);
  }

  // Statistiques d'utilisation
  async updateRecipeStats(recipeId: string, action: 'viewed' | 'cooked' | 'rated'): Promise<void> {
    const recipes = await this.getSavedRecipes();
    const updatedRecipes = recipes.map(recipe => {
      if (recipe.id === recipeId) {
        const updates: Partial<Recipe> = { updatedAt: new Date().toISOString() };
        
        if (action === 'cooked') {
          updates.cookCount = (recipe.cookCount || 0) + 1;
          updates.lastCookedAt = new Date().toISOString();
        }
        
        return { ...recipe, ...updates };
      }
      return recipe;
    });
    
    await this.saveRecipes(updatedRecipes);
  }

  // Nettoyage des données
  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.clear();
      console.log('Toutes les données supprimées');
    } catch (error) {
      console.error('Erreur nettoyage données:', error);
      throw new Error('Impossible de supprimer les données');
    }
  }

  // Export des données
  async exportUserData(): Promise<{
    profile: UserProfile | null;
    recipes: Recipe[];
    shoppingList: ShoppingList | null;
    recentIngredients: string[];
  }> {
    return {
      profile: await this.getUserProfile(),
      recipes: await this.getSavedRecipes(),
      shoppingList: await this.getShoppingList(),
      recentIngredients: await this.getRecentIngredients(),
    };
  }

  // Import des données
  async importUserData(data: {
    profile?: UserProfile;
    recipes?: Recipe[];
    shoppingList?: ShoppingList;
    recentIngredients?: string[];
  }): Promise<void> {
    try {
      if (data.profile) {
        await this.saveUserProfile(data.profile);
      }
      if (data.recipes) {
        await this.saveRecipes(data.recipes);
      }
      if (data.shoppingList) {
        await this.saveShoppingList(data.shoppingList);
      }
      if (data.recentIngredients) {
        await this.saveRecentIngredients(data.recentIngredients);
      }
    } catch (error) {
      console.error('Erreur import données:', error);
      throw new Error('Impossible d\'importer les données');
    }
  }

  // Vérification de l'espace de stockage
  async getStorageInfo(): Promise<{ used: number; available: number }> {
    try {
      // Approximation basée sur les clés stockées
      const keys = await AsyncStorage.getAllKeys();
      let totalSize = 0;
      
      for (const key of keys) {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          totalSize += value.length;
        }
      }
      
      return {
        used: totalSize,
        available: 10 * 1024 * 1024 - totalSize, // Approximation 10MB max
      };
    } catch (error) {
      console.error('Erreur info stockage:', error);
      return { used: 0, available: 10 * 1024 * 1024 };
    }
  }
}

export const storageService = new StorageService();
