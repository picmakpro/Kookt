import { Ingredient, Recipe, ShoppingListItem } from '../types';

// Formatage des temps
export const formatTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h${remainingMinutes}`;
};

// Formatage des quantités
export const formatQuantity = (quantity: number, unit: string): string => {
  // Arrondir à 2 décimales max
  const rounded = Math.round(quantity * 100) / 100;
  
  // Supprimer les zéros inutiles
  const quantityStr = rounded % 1 === 0 ? rounded.toString() : rounded.toFixed(2).replace(/\.?0+$/, '');
  
  return `${quantityStr} ${unit}`;
};

// Formatage des prix
export const formatPrice = (price: number, currency: string = 'EUR'): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

// Formatage des dates
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'À l\'instant';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `Il y a ${diffInMinutes} min`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `Il y a ${diffInHours}h`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `Il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
  }
  
  return formatDate(dateString);
};

// Formatage des ingrédients pour l'affichage
export const formatIngredientDisplay = (ingredient: Ingredient): string => {
  return `${formatQuantity(ingredient.quantity, ingredient.unit)} ${ingredient.name}`;
};

// Formatage des valeurs nutritionnelles
export const formatNutrition = (value: number, unit: string): string => {
  return `${Math.round(value)}${unit}`;
};

// Formatage pour liste de courses (export text)
export const formatShoppingListText = (items: ShoppingListItem[]): string => {
  const grouped = items.reduce((acc, item) => {
    const category = item.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, ShoppingListItem[]>);
  
  let text = '🛒 Ma liste de courses Kookt\n\n';
  
  Object.entries(grouped).forEach(([category, categoryItems]) => {
    text += `📦 ${category.toUpperCase()}\n`;
    categoryItems.forEach(item => {
      const checkbox = item.isChecked ? '✅' : '☐';
      text += `${checkbox} ${formatQuantity(item.quantity, item.unit)} ${item.name}\n`;
    });
    text += '\n';
  });
  
  text += '🍳 Générée avec Kookt - Cuisine IA';
  return text;
};

// Formatage pour WhatsApp
export const formatShoppingListWhatsApp = (items: ShoppingListItem[]): string => {
  const uncheckedItems = items.filter(item => !item.isChecked);
  
  let text = '🛒 *Ma liste de courses Kookt*\n\n';
  
  const grouped = uncheckedItems.reduce((acc, item) => {
    const category = item.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, ShoppingListItem[]>);
  
  Object.entries(grouped).forEach(([category, categoryItems]) => {
    text += `*${category.toUpperCase()}*\n`;
    categoryItems.forEach(item => {
      text += `• ${formatQuantity(item.quantity, item.unit)} ${item.name}\n`;
    });
    text += '\n';
  });
  
  text += '_Générée avec Kookt - Cuisine IA_ 🍳';
  return text;
};

// Formatage des étapes de recette
export const formatRecipeStep = (step: any, index: number): string => {
  let formatted = `${index + 1}. ${step.instruction}`;
  
  if (step.duration) {
    formatted += ` (${formatTime(step.duration)})`;
  }
  
  if (step.temperature) {
    formatted += ` - ${step.temperature}°C`;
  }
  
  if (step.tips) {
    formatted += `\n💡 ${step.tips}`;
  }
  
  return formatted;
};

// Formatage des tags
export const formatTags = (tags: string[]): string => {
  return tags.map(tag => `#${tag}`).join(' ');
};

// Capitalisation
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Formatage des titres
export const formatRecipeTitle = (title: string): string => {
  return title
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
};

// Formatage des portions
export const formatServings = (servings: number): string => {
  return `${servings} personne${servings > 1 ? 's' : ''}`;
};

// Formatage des difficultés avec emoji
export const formatDifficulty = (difficulty: string): string => {
  const difficultyMap = {
    'facile': '🟢 Facile',
    'moyen': '🟡 Moyen', 
    'difficile': '🔴 Difficile'
  };
  return difficultyMap[difficulty as keyof typeof difficultyMap] || difficulty;
};

// Formatage des régimes alimentaires avec emoji
export const formatDietaryRestriction = (restriction: string): string => {
  const dietaryMap = {
    'vegetarien': '🥬 Végétarien',
    'vegan': '🌱 Vegan',
    'sans-gluten': '🌾 Sans Gluten',
    'sans-lactose': '🥛 Sans Lactose',
    'halal': '☪️ Halal',
    'casher': '✡️ Casher',
    'paleo': '🦴 Paléo',
    'keto': '🥑 Kéto',
    'low-carb': '📉 Pauvre en Glucides',
    'high-protein': '💪 Riche en Protéines'
  };
  return dietaryMap[restriction as keyof typeof dietaryMap] || restriction;
};

// Génération d'URL de partage
export const generateShareableRecipeText = (recipe: Recipe): string => {
  let text = `🍳 *${recipe.title}*\n\n`;
  text += `${recipe.description}\n\n`;
  text += `⏱️ ${formatTime(recipe.totalTime)} | `;
  text += `👥 ${formatServings(recipe.servings)} | `;
  text += `${formatDifficulty(recipe.difficulty)}\n\n`;
  
  text += `*INGRÉDIENTS:*\n`;
  recipe.ingredients.forEach(ingredient => {
    text += `• ${formatIngredientDisplay(ingredient)}\n`;
  });
  
  text += `\n*PRÉPARATION:*\n`;
  recipe.steps.forEach((step, index) => {
    text += `${index + 1}. ${step.instruction}\n`;
  });
  
  text += `\n🤖 _Recette générée avec Kookt - Cuisine IA_`;
  
  return text;
};
