import { create } from 'zustand';
import { ShoppingList, ShoppingListItem, ShoppingListByCategory } from '../types/shopping';
import { Recipe } from '../types/recipe';
import { storageService } from '../services/storage';
import { formatShoppingListText, formatShoppingListWhatsApp } from '../utils/formatters';
import { ingredientCategories } from '../types/ingredient';
import * as Sharing from 'expo-sharing';

interface ShoppingState {
  // État de la liste
  currentList: ShoppingList | null;
  isLoading: boolean;
  
  // Gestion des items
  addItemToList: (item: Omit<ShoppingListItem, 'id' | 'addedAt'>) => Promise<void>;
  removeItemFromList: (itemId: string) => Promise<void>;
  toggleItemChecked: (itemId: string) => Promise<void>;
  updateItemQuantity: (itemId: string, quantity: number, unit: string) => Promise<void>;
  clearCheckedItems: () => Promise<void>;
  
  // Génération automatique depuis recettes
  generateFromRecipe: (recipe: Recipe) => Promise<void>;
  generateFromRecipes: (recipes: Recipe[]) => Promise<void>;
  
  // Organisation par catégories
  getItemsByCategory: () => ShoppingListByCategory[];
  moveItemToCategory: (itemId: string, newCategory: string) => Promise<void>;
  
  // Export et partage
  exportAsText: () => string;
  exportForWhatsApp: () => string;
  shareList: (format: 'text' | 'whatsapp') => Promise<void>;
  
  // Gestion des listes
  createNewList: (name?: string) => Promise<void>;
  saveCurrentList: () => Promise<void>;
  loadShoppingList: () => Promise<void>;
  clearList: () => Promise<void>;
  
  // Statistiques
  getTotalItems: () => number;
  getCheckedCount: () => number;
  getTotalEstimatedPrice: () => number;
  getCompletionPercentage: () => number;
  
  // Suggestions intelligentes
  getSuggestedItems: () => ShoppingListItem[];
  addSuggestedItem: (suggestion: ShoppingListItem) => Promise<void>;
  
  // Utilitaires
  findDuplicateItems: () => ShoppingListItem[];
  mergeDuplicateItems: () => Promise<void>;
  sortItemsByCategory: () => Promise<void>;
}

export const useShoppingStore = create<ShoppingState>((set, get) => ({
  // État initial
  currentList: null,
  isLoading: false,

  // Gestion des items
  addItemToList: async (itemData) => {
    const { currentList } = get();
    
    if (!currentList) {
      await get().createNewList();
    }
    
    const list = get().currentList!;
    const now = new Date().toISOString();
    
    const newItem: ShoppingListItem = {
      ...itemData,
      id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      addedAt: now,
    };
    
    const updatedList: ShoppingList = {
      ...list,
      items: [...list.items, newItem],
      updatedAt: now,
    };
    
    set({ currentList: updatedList });
    await storageService.saveShoppingList(updatedList);
  },

  removeItemFromList: async (itemId) => {
    const { currentList } = get();
    if (!currentList) return;
    
    const updatedList: ShoppingList = {
      ...currentList,
      items: currentList.items.filter(item => item.id !== itemId),
      updatedAt: new Date().toISOString(),
    };
    
    set({ currentList: updatedList });
    await storageService.saveShoppingList(updatedList);
  },

  toggleItemChecked: async (itemId) => {
    const { currentList } = get();
    if (!currentList) return;
    
    const updatedList: ShoppingList = {
      ...currentList,
      items: currentList.items.map(item =>
        item.id === itemId 
          ? { ...item, isChecked: !item.isChecked }
          : item
      ),
      updatedAt: new Date().toISOString(),
    };
    
    set({ currentList: updatedList });
    await storageService.saveShoppingList(updatedList);
  },

  updateItemQuantity: async (itemId, quantity, unit) => {
    const { currentList } = get();
    if (!currentList) return;
    
    const updatedList: ShoppingList = {
      ...currentList,
      items: currentList.items.map(item =>
        item.id === itemId 
          ? { ...item, quantity, unit }
          : item
      ),
      updatedAt: new Date().toISOString(),
    };
    
    set({ currentList: updatedList });
    await storageService.saveShoppingList(updatedList);
  },

  clearCheckedItems: async () => {
    const { currentList } = get();
    if (!currentList) return;
    
    const updatedList: ShoppingList = {
      ...currentList,
      items: currentList.items.filter(item => !item.isChecked),
      updatedAt: new Date().toISOString(),
    };
    
    set({ currentList: updatedList });
    await storageService.saveShoppingList(updatedList);
  },

  // Génération automatique
  generateFromRecipe: async (recipe) => {
    const { currentList } = get();
    
    // Créer une nouvelle liste si nécessaire
    if (!currentList) {
      await get().createNewList(`Courses pour ${recipe.title}`);
    }
    
    // Convertir les ingrédients en items de courses
    const items = recipe.ingredients.map(ingredient => ({
      name: ingredient.name,
      quantity: ingredient.quantity,
      unit: ingredient.unit,
      category: ingredient.category || 'autres',
      recipeId: recipe.id,
      recipeName: recipe.title,
      isOptional: false,
      estimatedPrice: ingredient.estimatedPrice,
    }));
    
    // Ajouter tous les items
    for (const item of items) {
      await get().addItemToList(item);
    }
  },

  generateFromRecipes: async (recipes) => {
    if (recipes.length === 0) return;
    
    const recipeTitles = recipes.map(r => r.title).join(', ');
    await get().createNewList(`Courses pour ${recipeTitles}`);
    
    // Collecter tous les ingrédients et fusionner les doublons
    const ingredientMap = new Map<string, {
      name: string;
      totalQuantity: number;
      unit: string;
      category: string;
      recipes: string[];
      estimatedPrice?: number;
    }>();
    
    recipes.forEach(recipe => {
      recipe.ingredients.forEach(ingredient => {
        const key = ingredient.name.toLowerCase();
        
        if (ingredientMap.has(key)) {
          const existing = ingredientMap.get(key)!;
          // Additionner les quantités si même unité
          if (existing.unit === ingredient.unit) {
            existing.totalQuantity += ingredient.quantity;
          }
          existing.recipes.push(recipe.title);
        } else {
          ingredientMap.set(key, {
            name: ingredient.name,
            totalQuantity: ingredient.quantity,
            unit: ingredient.unit,
            category: ingredient.category || 'autres',
            recipes: [recipe.title],
            estimatedPrice: ingredient.estimatedPrice,
          });
        }
      });
    });
    
    // Ajouter les items fusionnés
    for (const ingredient of ingredientMap.values()) {
      await get().addItemToList({
        name: ingredient.name,
        quantity: ingredient.totalQuantity,
        unit: ingredient.unit,
        category: ingredient.category as any,
        estimatedPrice: ingredient.estimatedPrice,
        notes: `Pour: ${ingredient.recipes.join(', ')}`,
      });
    }
  },

  // Organisation par catégories
  getItemsByCategory: () => {
    const { currentList } = get();
    if (!currentList) return [];
    
    const grouped = currentList.items.reduce((acc, item) => {
      const category = item.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {} as Record<string, ShoppingListItem[]>);
    
    return Object.entries(grouped).map(([category, items]) => ({
      category: ingredientCategories[category as keyof typeof ingredientCategories] || category,
      items,
      totalPrice: items.reduce((sum, item) => sum + (item.estimatedPrice || 0), 0),
      checkedCount: items.filter(item => item.isChecked).length,
      totalCount: items.length,
    }));
  },

  moveItemToCategory: async (itemId, newCategory) => {
    const { currentList } = get();
    if (!currentList) return;
    
    const updatedList: ShoppingList = {
      ...currentList,
      items: currentList.items.map(item =>
        item.id === itemId 
          ? { ...item, category: newCategory as any }
          : item
      ),
      updatedAt: new Date().toISOString(),
    };
    
    set({ currentList: updatedList });
    await storageService.saveShoppingList(updatedList);
  },

  // Export et partage
  exportAsText: () => {
    const { currentList } = get();
    if (!currentList) return '';
    
    return formatShoppingListText(currentList.items);
  },

  exportForWhatsApp: () => {
    const { currentList } = get();
    if (!currentList) return '';
    
    return formatShoppingListWhatsApp(currentList.items);
  },

  shareList: async (format) => {
    const { currentList } = get();
    if (!currentList) return;
    
    try {
      const content = format === 'whatsapp' 
        ? get().exportForWhatsApp()
        : get().exportAsText();
      
      const isAvailable = await Sharing.isAvailableAsync();
      
      if (isAvailable) {
        // Créer un fichier temporaire avec le contenu
        const fileName = `kookt-liste-courses-${Date.now()}.txt`;
        
        // Pour React Native, nous devons créer un blob/fichier temporaire
        const blob = new Blob([content], { type: 'text/plain' });
        const fileUri = URL.createObjectURL(blob);
        
        try {
          await Sharing.shareAsync(fileUri, {
            mimeType: 'text/plain',
            dialogTitle: 'Partager la liste de courses',
            UTI: 'public.plain-text',
          });
        } finally {
          URL.revokeObjectURL(fileUri);
        }
      } else {
        // Fallback: utiliser le partage natif du système si disponible
        if (typeof window !== 'undefined' && navigator.share) {
          try {
            await navigator.share({
              title: 'Ma liste de courses Kookt',
              text: content,
            });
          } catch (error) {
            console.error('Erreur partage web:', error);
            // Log pour debug
            console.log('Contenu à partager:', content);
          }
        } else {
          console.log('Partage non disponible, contenu:', content);
        }
      }
    } catch (error) {
      console.error('Erreur partage liste:', error);
    }
  },

  // Gestion des listes
  createNewList: async (name = 'Ma liste de courses') => {
    const now = new Date().toISOString();
    
    const newList: ShoppingList = {
      id: `list_${Date.now()}`,
      name,
      items: [],
      totalEstimatedPrice: 0,
      createdAt: now,
      updatedAt: now,
      isArchived: false,
    };
    
    set({ currentList: newList });
    await storageService.saveShoppingList(newList);
  },

  saveCurrentList: async () => {
    const { currentList } = get();
    if (!currentList) return;
    
    // Recalculer le prix total
    const totalPrice = currentList.items.reduce(
      (sum, item) => sum + (item.estimatedPrice || 0), 
      0
    );
    
    const updatedList: ShoppingList = {
      ...currentList,
      totalEstimatedPrice: totalPrice,
      updatedAt: new Date().toISOString(),
    };
    
    set({ currentList: updatedList });
    await storageService.saveShoppingList(updatedList);
  },

  loadShoppingList: async () => {
    set({ isLoading: true });
    
    try {
      const list = await storageService.getShoppingList();
      set({ currentList: list, isLoading: false });
    } catch (error) {
      console.error('Erreur chargement liste:', error);
      set({ isLoading: false });
    }
  },

  clearList: async () => {
    const { currentList } = get();
    if (!currentList) return;
    
    const clearedList: ShoppingList = {
      ...currentList,
      items: [],
      totalEstimatedPrice: 0,
      updatedAt: new Date().toISOString(),
    };
    
    set({ currentList: clearedList });
    await storageService.saveShoppingList(clearedList);
  },

  // Statistiques
  getTotalItems: () => {
    const { currentList } = get();
    return currentList?.items.length || 0;
  },

  getCheckedCount: () => {
    const { currentList } = get();
    return currentList?.items.filter(item => item.isChecked).length || 0;
  },

  getTotalEstimatedPrice: () => {
    const { currentList } = get();
    return currentList?.totalEstimatedPrice || 0;
  },

  getCompletionPercentage: () => {
    const total = get().getTotalItems();
    const checked = get().getCheckedCount();
    
    return total > 0 ? Math.round((checked / total) * 100) : 0;
  },

  // Suggestions intelligentes
  getSuggestedItems: () => {
    // Suggestions basées sur les ingrédients couramment oubliés
    const commonForgottenItems = [
      { name: 'Sel', category: 'condiments-epices', quantity: 1, unit: 'paquet' },
      { name: 'Poivre', category: 'condiments-epices', quantity: 1, unit: 'paquet' },
      { name: 'Huile d\'olive', category: 'huiles-graisses', quantity: 1, unit: 'bouteille' },
      { name: 'Beurre', category: 'produits-laitiers', quantity: 1, unit: 'plaquette' },
      { name: 'Œufs', category: 'produits-laitiers', quantity: 6, unit: 'pièces' },
    ];
    
    const { currentList } = get();
    if (!currentList) return [];
    
    // Filtrer les suggestions non présentes dans la liste actuelle
    const currentNames = currentList.items.map(item => item.name.toLowerCase());
    
    return commonForgottenItems
      .filter(item => !currentNames.includes(item.name.toLowerCase()))
      .map(item => ({
        ...item,
        id: `suggestion_${item.name}`,
        isChecked: false,
        addedAt: new Date().toISOString(),
      } as ShoppingListItem));
  },

  addSuggestedItem: async (suggestion) => {
    await get().addItemToList({
      name: suggestion.name,
      quantity: suggestion.quantity,
      unit: suggestion.unit,
      category: suggestion.category,
      estimatedPrice: suggestion.estimatedPrice,
    });
  },

  // Utilitaires
  findDuplicateItems: () => {
    const { currentList } = get();
    if (!currentList) return [];
    
    const nameMap = new Map<string, ShoppingListItem[]>();
    
    currentList.items.forEach(item => {
      const key = item.name.toLowerCase().trim();
      if (!nameMap.has(key)) {
        nameMap.set(key, []);
      }
      nameMap.get(key)!.push(item);
    });
    
    return Array.from(nameMap.values())
      .filter(items => items.length > 1)
      .flat();
  },

  mergeDuplicateItems: async () => {
    const { currentList } = get();
    if (!currentList) return;
    
    const nameMap = new Map<string, ShoppingListItem[]>();
    
    currentList.items.forEach(item => {
      const key = item.name.toLowerCase().trim();
      if (!nameMap.has(key)) {
        nameMap.set(key, []);
      }
      nameMap.get(key)!.push(item);
    });
    
    const mergedItems: ShoppingListItem[] = [];
    
    nameMap.forEach(items => {
      if (items.length === 1) {
        mergedItems.push(items[0]);
      } else {
        // Fusionner les doublons
        const firstItem = items[0];
        const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
        const isChecked = items.some(item => item.isChecked);
        
        mergedItems.push({
          ...firstItem,
          quantity: totalQuantity,
          isChecked,
        });
      }
    });
    
    const updatedList: ShoppingList = {
      ...currentList,
      items: mergedItems,
      updatedAt: new Date().toISOString(),
    };
    
    set({ currentList: updatedList });
    await storageService.saveShoppingList(updatedList);
  },

  sortItemsByCategory: async () => {
    const { currentList } = get();
    if (!currentList) return;
    
    const sortedItems = [...currentList.items].sort((a, b) => {
      // Trier par catégorie puis par nom
      if (a.category !== b.category) {
        return a.category.localeCompare(b.category);
      }
      return a.name.localeCompare(b.name);
    });
    
    const updatedList: ShoppingList = {
      ...currentList,
      items: sortedItems,
      updatedAt: new Date().toISOString(),
    };
    
    set({ currentList: updatedList });
    await storageService.saveShoppingList(updatedList);
  },
}));
