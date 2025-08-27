import Constants from 'expo-constants';

export const config = {
  app: {
    name: 'Kookt - Cuisine IA',
    version: '1.0.0',
    environment: Constants.expoConfig?.extra?.environment || 'development',
  },
  
  api: {
    baseUrl: Constants.expoConfig?.extra?.apiBaseUrl || 'https://api.kookt.com',
    timeout: 30000,
  },
  
  ai: {
    openaiApiKey: Constants.expoConfig?.extra?.openaiApiKey || process.env.OPENAI_API_KEY || '',
    claudeApiKey: Constants.expoConfig?.extra?.claudeApiKey || process.env.CLAUDE_API_KEY || '',
    maxTokens: 4000,
    temperature: 0.7,
  },
  
  features: {
    enableImageGeneration: false,
    enableVoiceInput: false,
    enableNutritionTracking: true,
    enableShoppingListExport: true,
  },
  
  limits: {
    maxIngredientsPerRecipe: 20,
    maxRecipesPerGeneration: 3,
    maxShoppingListItems: 50,
    recipeGenerationTimeout: 30000,
  },
  
  storage: {
    keys: {
      userPreferences: '@kookt:userPreferences',
      savedRecipes: '@kookt:savedRecipes',
      shoppingList: '@kookt:shoppingList',
      onboardingCompleted: '@kookt:onboardingCompleted',
    },
  },
} as const;
