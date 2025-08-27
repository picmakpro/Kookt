import { create } from 'zustand';
import { UserProfile, UserPreferences, OnboardingData } from '../types/user';
import { storageService } from '../services/storage';

interface UserState {
  // État
  profile: UserProfile | null;
  isLoading: boolean;
  isOnboardingCompleted: boolean;
  currentOnboardingStep: number;
  onboardingData: Partial<UserPreferences>;

  // Actions de base
  setProfile: (profile: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  clearProfile: () => Promise<void>;
  
  // Gestion de l'onboarding
  setOnboardingStep: (step: number) => void;
  updateOnboardingData: (data: Partial<UserPreferences>) => void;
  completeOnboarding: () => Promise<void>;
  skipOnboarding: () => Promise<void>;
  
  // Préférences
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
  addDietaryRestriction: (restriction: string) => Promise<void>;
  removeDietaryRestriction: (restriction: string) => Promise<void>;
  addAllergen: (allergen: string) => Promise<void>;
  removeAllergen: (allergen: string) => Promise<void>;
  
  // Statistiques
  incrementRecipeGenerated: () => Promise<void>;
  incrementRecipeCooked: () => Promise<void>;
  addCookingTime: (minutes: number) => Promise<void>;
  
  // Initialisation
  initializeUser: () => Promise<void>;
  loadUserProfile: () => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  // État initial
  profile: null,
  isLoading: false,
  isOnboardingCompleted: false,
  currentOnboardingStep: 0,
  onboardingData: {
    dietaryRestrictions: [],
    allergens: [],
    cookingExperience: 'beginner',
    availableCookingTime: '30min',
    kitchenEquipment: [],
    budget: 'medium',
    goals: [],
  },

  // Actions de base
  setProfile: (profile) => {
    set({ profile });
  },

  updateProfile: async (updates) => {
    const { profile } = get();
    if (!profile) return;

    const updatedProfile = {
      ...profile,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    set({ profile: updatedProfile });
    await storageService.saveUserProfile(updatedProfile);
  },

  clearProfile: async () => {
    set({ 
      profile: null, 
      isOnboardingCompleted: false,
      currentOnboardingStep: 0,
      onboardingData: {}
    });
    await storageService.clearUserProfile();
  },

  // Gestion de l'onboarding
  setOnboardingStep: (step) => {
    set({ currentOnboardingStep: step });
  },

  updateOnboardingData: (data) => {
    const { onboardingData } = get();
    set({ 
      onboardingData: { 
        ...onboardingData, 
        ...data 
      } 
    });
  },

  completeOnboarding: async () => {
    const { onboardingData } = get();
    const now = new Date().toISOString();
    
    const newProfile: UserProfile = {
      id: `user_${Date.now()}`,
      preferences: {
        dietaryRestrictions: onboardingData.dietaryRestrictions || [],
        allergens: onboardingData.allergens || [],
        dislikedIngredients: onboardingData.dislikedIngredients || [],
        preferredCuisines: onboardingData.preferredCuisines || [],
        cookingSkillLevel: onboardingData.cookingSkillLevel || 'intermediaire',
        availableCookingTime: onboardingData.availableCookingTime || '30min',
        budgetPreference: onboardingData.budgetPreference || 'moyen',
        preferredServings: onboardingData.preferredServings || 2,
        kitchenEquipment: onboardingData.kitchenEquipment || [],
        notificationsEnabled: onboardingData.notificationsEnabled ?? true,
        shareDataForImprovement: onboardingData.shareDataForImprovement ?? false,
      },
      stats: {
        recipesGenerated: 0,
        recipesCooked: 0,
        favoriteRecipes: 0,
        totalCookingTime: 0,
        ingredientsSaved: 0,
      },
      createdAt: now,
      updatedAt: now,
      onboardingCompleted: true,
    };

    set({ 
      profile: newProfile, 
      isOnboardingCompleted: true,
      currentOnboardingStep: 0,
      onboardingData: {}
    });
    
    await storageService.saveUserProfile(newProfile);
    await storageService.setOnboardingCompleted(true);
  },

  skipOnboarding: async () => {
    set({ 
      isOnboardingCompleted: true,
      currentOnboardingStep: 0,
      onboardingData: {}
    });
    await storageService.setOnboardingCompleted(true);
  },

  // Préférences
  updatePreferences: async (preferences) => {
    const { profile, updateProfile } = get();
    if (!profile) return;

    await updateProfile({
      preferences: {
        ...profile.preferences,
        ...preferences,
      }
    });
  },

  addDietaryRestriction: async (restriction) => {
    const { profile, updatePreferences } = get();
    if (!profile) return;

    const currentRestrictions = profile.preferences.dietaryRestrictions;
    if (!currentRestrictions.includes(restriction as any)) {
      await updatePreferences({
        dietaryRestrictions: [...currentRestrictions, restriction as any]
      });
    }
  },

  removeDietaryRestriction: async (restriction) => {
    const { profile, updatePreferences } = get();
    if (!profile) return;

    await updatePreferences({
      dietaryRestrictions: profile.preferences.dietaryRestrictions.filter(
        r => r !== restriction
      )
    });
  },

  addAllergen: async (allergen) => {
    const { profile, updatePreferences } = get();
    if (!profile) return;

    const currentAllergens = profile.preferences.allergens;
    if (!currentAllergens.includes(allergen)) {
      await updatePreferences({
        allergens: [...currentAllergens, allergen]
      });
    }
  },

  removeAllergen: async (allergen) => {
    const { profile, updatePreferences } = get();
    if (!profile) return;

    await updatePreferences({
      allergens: profile.preferences.allergens.filter(a => a !== allergen)
    });
  },

  // Statistiques
  incrementRecipeGenerated: async () => {
    const { profile, updateProfile } = get();
    if (!profile) return;

    await updateProfile({
      stats: {
        ...profile.stats,
        recipesGenerated: profile.stats.recipesGenerated + 1,
        lastActiveAt: new Date().toISOString(),
      }
    });
  },

  incrementRecipeCooked: async () => {
    const { profile, updateProfile } = get();
    if (!profile) return;

    await updateProfile({
      stats: {
        ...profile.stats,
        recipesCooked: profile.stats.recipesCooked + 1,
        lastActiveAt: new Date().toISOString(),
      }
    });
  },

  addCookingTime: async (minutes) => {
    const { profile, updateProfile } = get();
    if (!profile) return;

    await updateProfile({
      stats: {
        ...profile.stats,
        totalCookingTime: profile.stats.totalCookingTime + minutes,
      }
    });
  },

  // Initialisation
  initializeUser: async () => {
    set({ isLoading: true });
    
    try {
      const [profile, onboardingCompleted] = await Promise.all([
        storageService.getUserProfile(),
        storageService.isOnboardingCompleted(),
      ]);

      set({ 
        profile,
        isOnboardingCompleted: onboardingCompleted,
        isLoading: false,
      });
    } catch (error) {
      console.error('Erreur initialisation utilisateur:', error);
      set({ isLoading: false });
    }
  },

  loadUserProfile: async () => {
    try {
      const profile = await storageService.getUserProfile();
      set({ profile });
    } catch (error) {
      console.error('Erreur chargement profil:', error);
    }
  },
}));
