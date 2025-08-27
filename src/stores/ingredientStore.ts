import { create } from 'zustand';
import { Ingredient, IngredientCategory } from '../types/ingredient';
import { aiService } from '../services/ai';
import { storageService } from '../services/storage';

interface IngredientState {
  // État des ingrédients
  availableIngredients: Ingredient[];
  recentIngredients: string[];
  suggestedIngredients: string[];
  
  // État de l'input
  currentInput: string;
  isLoadingSuggestions: boolean;
  
  // Gestion des ingrédients sélectionnés
  selectedIngredients: string[];
  ingredientQuantities: Record<string, { quantity: number; unit: string }>;
  
  // Catégories et filtres
  selectedCategory: IngredientCategory | null;
  showOnlyAvailable: boolean;
  
  // Actions pour l'input
  setCurrentInput: (input: string) => void;
  loadSuggestions: (input: string) => Promise<void>;
  clearSuggestions: () => void;
  
  // Gestion des ingrédients disponibles
  addAvailableIngredient: (ingredient: Ingredient) => Promise<void>;
  removeAvailableIngredient: (ingredientId: string) => Promise<void>;
  updateIngredientQuantity: (ingredientId: string, quantity: number, unit: string) => Promise<void>;
  toggleIngredientAvailability: (ingredientId: string) => Promise<void>;
  
  // Gestion des ingrédients sélectionnés pour génération
  addSelectedIngredient: (ingredient: string, quantity?: number, unit?: string) => void;
  removeSelectedIngredient: (ingredient: string) => void;
  clearSelectedIngredients: () => void;
  updateSelectedIngredientQuantity: (ingredient: string, quantity: number, unit: string) => void;
  
  // Ingrédients récents
  addToRecentIngredients: (ingredient: string) => Promise<void>;
  loadRecentIngredients: () => Promise<void>;
  clearRecentIngredients: () => Promise<void>;
  
  // Catégories et filtres
  setSelectedCategory: (category: IngredientCategory | null) => void;
  setShowOnlyAvailable: (show: boolean) => void;
  
  // Utilitaires
  getIngredientsByCategory: (category: IngredientCategory) => Ingredient[];
  getAvailableIngredientsNames: () => string[];
  getSelectedIngredientsWithQuantities: () => Array<{ name: string; quantity: number; unit: string }>;
  
  // Suggestions intelligentes
  getSmartSuggestions: () => string[];
  getSimilarIngredients: (ingredient: string) => string[];
  
  // Chargement et persistance
  loadAvailableIngredients: () => Promise<void>;
  saveAvailableIngredients: () => Promise<void>;
  
  // Import/Export
  importIngredientsFromText: (text: string) => void;
  exportSelectedIngredients: () => string;
}

export const useIngredientStore = create<IngredientState>((set, get) => ({
  // État initial
  availableIngredients: [],
  recentIngredients: [],
  suggestedIngredients: [],
  
  currentInput: '',
  isLoadingSuggestions: false,
  
  selectedIngredients: [],
  ingredientQuantities: {},
  
  selectedCategory: null,
  showOnlyAvailable: true,

  // Actions pour l'input
  setCurrentInput: (input) => {
    set({ currentInput: input });
    
    // Charger des suggestions si l'input fait plus de 2 caractères
    if (input.length >= 2) {
      get().loadSuggestions(input);
    } else {
      set({ suggestedIngredients: [] });
    }
  },

  loadSuggestions: async (input) => {
    if (input.length < 2) return;
    
    set({ isLoadingSuggestions: true });
    
    try {
      // Combiner suggestions IA et suggestions locales
      const [aiSuggestions, localSuggestions] = await Promise.all([
        aiService.generateIngredientSuggestions(input),
        Promise.resolve(get().getSimilarIngredients(input))
      ]);
      
      // Fusionner et dédupliquer
      const allSuggestions = [...new Set([...aiSuggestions, ...localSuggestions])];
      
      set({ 
        suggestedIngredients: allSuggestions.slice(0, 8),
        isLoadingSuggestions: false 
      });
      
    } catch (error) {
      console.error('Erreur chargement suggestions:', error);
      
      // Fallback sur suggestions locales
      const localSuggestions = get().getSimilarIngredients(input);
      set({ 
        suggestedIngredients: localSuggestions.slice(0, 5),
        isLoadingSuggestions: false 
      });
    }
  },

  clearSuggestions: () => {
    set({ suggestedIngredients: [], currentInput: '' });
  },

  // Gestion des ingrédients disponibles
  addAvailableIngredient: async (ingredient) => {
    const { availableIngredients } = get();
    
    // Vérifier si l'ingrédient existe déjà
    const existingIndex = availableIngredients.findIndex(
      ing => ing.name.toLowerCase() === ingredient.name.toLowerCase()
    );
    
    if (existingIndex >= 0) {
      // Mettre à jour l'ingrédient existant
      const updated = [...availableIngredients];
      updated[existingIndex] = { ...updated[existingIndex], ...ingredient };
      set({ availableIngredients: updated });
    } else {
      // Ajouter le nouvel ingrédient
      set({ 
        availableIngredients: [...availableIngredients, ingredient] 
      });
    }
    
    await get().saveAvailableIngredients();
  },

  removeAvailableIngredient: async (ingredientId) => {
    const { availableIngredients } = get();
    const filtered = availableIngredients.filter(ing => ing.id !== ingredientId);
    
    set({ availableIngredients: filtered });
    await get().saveAvailableIngredients();
  },

  updateIngredientQuantity: async (ingredientId, quantity, unit) => {
    const { availableIngredients } = get();
    const updated = availableIngredients.map(ing =>
      ing.id === ingredientId 
        ? { ...ing, quantity, unit, lastUsed: new Date().toISOString() }
        : ing
    );
    
    set({ availableIngredients: updated });
    await get().saveAvailableIngredients();
  },

  toggleIngredientAvailability: async (ingredientId) => {
    const { availableIngredients } = get();
    const updated = availableIngredients.map(ing =>
      ing.id === ingredientId 
        ? { ...ing, available: !ing.available }
        : ing
    );
    
    set({ availableIngredients: updated });
    await get().saveAvailableIngredients();
  },

  // Gestion des ingrédients sélectionnés
  addSelectedIngredient: (ingredient, quantity = 1, unit = 'pièce') => {
    const { selectedIngredients, ingredientQuantities } = get();
    
    if (!selectedIngredients.includes(ingredient)) {
      set({ 
        selectedIngredients: [...selectedIngredients, ingredient],
        ingredientQuantities: {
          ...ingredientQuantities,
          [ingredient]: { quantity, unit }
        }
      });
      
      // Ajouter aux récents
      get().addToRecentIngredients(ingredient);
    }
  },

  removeSelectedIngredient: (ingredient) => {
    const { selectedIngredients, ingredientQuantities } = get();
    
    set({
      selectedIngredients: selectedIngredients.filter(ing => ing !== ingredient),
      ingredientQuantities: Object.fromEntries(
        Object.entries(ingredientQuantities).filter(([key]) => key !== ingredient)
      )
    });
  },

  clearSelectedIngredients: () => {
    set({ 
      selectedIngredients: [],
      ingredientQuantities: {}
    });
  },

  updateSelectedIngredientQuantity: (ingredient, quantity, unit) => {
    const { ingredientQuantities } = get();
    
    set({
      ingredientQuantities: {
        ...ingredientQuantities,
        [ingredient]: { quantity, unit }
      }
    });
  },

  // Ingrédients récents
  addToRecentIngredients: async (ingredient) => {
    await storageService.addRecentIngredient(ingredient);
    await get().loadRecentIngredients();
  },

  loadRecentIngredients: async () => {
    try {
      const recent = await storageService.getRecentIngredients();
      set({ recentIngredients: recent });
    } catch (error) {
      console.error('Erreur chargement ingrédients récents:', error);
    }
  },

  clearRecentIngredients: async () => {
    await storageService.saveRecentIngredients([]);
    set({ recentIngredients: [] });
  },

  // Catégories et filtres
  setSelectedCategory: (category) => {
    set({ selectedCategory: category });
  },

  setShowOnlyAvailable: (show) => {
    set({ showOnlyAvailable: show });
  },

  // Utilitaires
  getIngredientsByCategory: (category) => {
    const { availableIngredients, showOnlyAvailable } = get();
    
    return availableIngredients.filter(ingredient => 
      ingredient.category === category &&
      (!showOnlyAvailable || ingredient.available)
    );
  },

  getAvailableIngredientsNames: () => {
    const { availableIngredients } = get();
    return availableIngredients
      .filter(ing => ing.available)
      .map(ing => ing.name);
  },

  getSelectedIngredientsWithQuantities: () => {
    const { selectedIngredients, ingredientQuantities } = get();
    
    return selectedIngredients.map(ingredient => ({
      name: ingredient,
      quantity: ingredientQuantities[ingredient]?.quantity || 1,
      unit: ingredientQuantities[ingredient]?.unit || 'pièce'
    }));
  },

  // Suggestions intelligentes
  getSmartSuggestions: () => {
    const { recentIngredients, availableIngredients, selectedIngredients } = get();
    
    // Ingrédients récents non encore sélectionnés
    const recentNotSelected = recentIngredients.filter(
      ingredient => !selectedIngredients.includes(ingredient)
    );
    
    // Ingrédients disponibles populaires
    const availableNames = availableIngredients
      .filter(ing => ing.available)
      .map(ing => ing.name);
    
    // Combiner et limiter
    const suggestions = [...new Set([...recentNotSelected, ...availableNames])];
    return suggestions.slice(0, 10);
  },

  getSimilarIngredients: (ingredient) => {
    const commonIngredients = [
      'tomate', 'oignon', 'ail', 'carotte', 'pomme de terre',
      'courgette', 'aubergine', 'poivron', 'brocoli', 'épinards',
      'poulet', 'bœuf', 'porc', 'saumon', 'thon',
      'œuf', 'lait', 'beurre', 'fromage', 'yaourt',
      'riz', 'pâtes', 'pain', 'farine', 'quinoa',
      'huile d\'olive', 'sel', 'poivre', 'basilic', 'persil',
      'citron', 'pomme', 'banane', 'orange', 'fraise'
    ];
    
    const input = ingredient.toLowerCase();
    
    return commonIngredients.filter(ing => 
      ing.toLowerCase().includes(input) ||
      input.includes(ing.toLowerCase())
    );
  },

  // Chargement et persistance
  loadAvailableIngredients: async () => {
    // Pour l'instant, on utilise le stockage local
    // Dans le futur, on pourrait synchroniser avec un serveur
    try {
      const stored = await storageService.getItem<Ingredient[]>('@kookt:availableIngredients');
      if (stored) {
        set({ availableIngredients: stored });
      }
    } catch (error) {
      console.error('Erreur chargement ingrédients:', error);
    }
  },

  saveAvailableIngredients: async () => {
    const { availableIngredients } = get();
    try {
      await storageService.setItem('@kookt:availableIngredients', availableIngredients);
    } catch (error) {
      console.error('Erreur sauvegarde ingrédients:', error);
    }
  },

  // Import/Export
  importIngredientsFromText: (text) => {
    // Parser un texte pour extraire des ingrédients
    // Format: "2 tomates, 1 oignon, 500g de riz"
    const lines = text.split(/[,\n]/).filter(line => line.trim());
    
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed) {
        // Extraction simple: chercher nombre + unité + nom
        const match = trimmed.match(/(\d+\.?\d*)\s*([a-zA-Z]*)\s+(.+)/);
        
        if (match) {
          const [, quantity, unit, name] = match;
          get().addSelectedIngredient(
            name.trim(), 
            parseFloat(quantity), 
            unit || 'pièce'
          );
        } else {
          // Si pas de quantité détectée, ajouter avec quantité par défaut
          get().addSelectedIngredient(trimmed);
        }
      }
    });
  },

  exportSelectedIngredients: () => {
    const ingredients = get().getSelectedIngredientsWithQuantities();
    
    return ingredients
      .map(ing => `${ing.quantity} ${ing.unit} ${ing.name}`)
      .join(', ');
  },
}));
