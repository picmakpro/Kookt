import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUserStore } from '../../src/stores';
import { Button } from '../../src/components/ui';
import { colors, typography } from '../../src/constants';
import { 
  CookingSkillLevel, 
  BudgetPreference,
  cookingSkillLabels,
  budgetLabels,
  cookingTimeLabels,
  kitchenEquipmentLabels,
} from '../../src/types/user';
import { DietaryRestriction, dietaryLabels } from '../../src/types/recipe';

const { width, height } = Dimensions.get('window');

interface OnboardingStep {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  content: React.ReactNode;
}

export default function OnboardingScreen() {
  const router = useRouter();

  const { 
    currentOnboardingStep, 
    setOnboardingStep,
    updateOnboardingData,
    onboardingData,
    completeOnboarding,
    skipOnboarding 
  } = useUserStore();

  const [selectedDietaryRestrictions, setSelectedDietaryRestrictions] = useState<DietaryRestriction[]>(
    onboardingData.dietaryRestrictions || []
  );
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>(
    onboardingData.allergens || []
  );
  const [selectedSkillLevel, setSelectedSkillLevel] = useState<CookingSkillLevel>(
    onboardingData.cookingSkillLevel || 'intermediaire'
  );
  const [selectedBudget, setSelectedBudget] = useState<BudgetPreference>(
    onboardingData.budgetPreference || 'moyen'
  );
  const [selectedCookingTime, setSelectedCookingTime] = useState(
    onboardingData.availableCookingTime || '30min'
  );
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>(
    onboardingData.kitchenEquipment || []
  );

  const dietaryOptions: DietaryRestriction[] = [
    'vegetarien', 'vegan', 'sans-gluten', 'sans-lactose', 
    'halal', 'casher', 'paleo', 'keto'
  ];

  const allergenOptions = [
    'Gluten', 'Lactose', 'Œufs', 'Noix', 'Arachides', 
    'Poisson', 'Crustacés', 'Soja', 'Sésame'
  ];

  const equipmentOptions = [
    'four', 'micro-ondes', 'plaque-cuisson', 'friteuse',
    'robot-cuisine', 'mixeur', 'autocuiseur', 'wok'
  ];

  const cookingTimeOptions = [
    { key: '15min', label: '15 minutes max' },
    { key: '30min', label: '30 minutes max' },
    { key: '1h', label: '1 heure max' },
    { key: '2h+', label: '2 heures ou plus' },
    { key: 'pas-de-limite', label: 'Pas de limite' },
  ];

  const handleNext = () => {
    if (currentOnboardingStep < steps.length - 1) {
      const nextStep = currentOnboardingStep + 1;
      setOnboardingStep(nextStep);
      
      // Sauvegarder les données de l'étape actuelle
      saveCurrentStepData();
    } else {
      // Dernière étape, compléter l'onboarding
      saveCurrentStepData();
      completeOnboarding().then(() => {
        router.replace('/(tabs)');
      });
    }
  };

  const handlePrevious = () => {
    if (currentOnboardingStep > 0) {
      const prevStep = currentOnboardingStep - 1;
      setOnboardingStep(prevStep);
    }
  };

  const handleSkip = () => {
    skipOnboarding().then(() => {
      router.replace('/(tabs)');
    });
  };

  const saveCurrentStepData = () => {
    const data = {
      dietaryRestrictions: selectedDietaryRestrictions,
      allergens: selectedAllergens,
      cookingSkillLevel: selectedSkillLevel,
      budgetPreference: selectedBudget,
      availableCookingTime: selectedCookingTime as any,
      kitchenEquipment: selectedEquipment as any,
    };
    updateOnboardingData(data);
  };

  const toggleDietaryRestriction = (restriction: DietaryRestriction) => {
    setSelectedDietaryRestrictions(prev => 
      prev.includes(restriction)
        ? prev.filter(r => r !== restriction)
        : [...prev, restriction]
    );
  };

  const toggleAllergen = (allergen: string) => {
    setSelectedAllergens(prev => 
      prev.includes(allergen)
        ? prev.filter(a => a !== allergen)
        : [...prev, allergen]
    );
  };

  const toggleEquipment = (equipment: string) => {
    setSelectedEquipment(prev => 
      prev.includes(equipment)
        ? prev.filter(e => e !== equipment)
        : [...prev, equipment]
    );
  };

  const steps: OnboardingStep[] = [
    {
      id: 0,
      title: "Bienvenue dans Kookt ! 🍳",
      subtitle: "Votre assistant de cuisine intelligent",
      icon: "restaurant",
      content: (
        <View style={styles.welcomeContent}>
          <View style={styles.iconContainer}>
            <Ionicons name="restaurant" size={64} color={colors.primary[500]} />
          </View>
          
          <Text style={styles.welcomeTitle}>
            Cuisinez sans effort avec l'IA
          </Text>
          
          <Text style={styles.welcomeDescription}>
            Kookt transforme vos ingrédients en recettes délicieuses et personnalisées. 
            Laissez l'IA vous guider vers de nouvelles saveurs !
          </Text>
          
          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <Ionicons name="bulb" size={20} color={colors.primary[500]} />
              <Text style={styles.featureText}>Recettes générées par IA</Text>
            </View>
            
            <View style={styles.featureItem}>
              <Ionicons name="heart" size={20} color={colors.primary[500]} />
              <Text style={styles.featureText}>Adaptées à vos goûts</Text>
            </View>
            
            <View style={styles.featureItem}>
              <Ionicons name="list" size={20} color={colors.primary[500]} />
              <Text style={styles.featureText}>Liste de courses automatique</Text>
            </View>
          </View>
        </View>
      )
    },
    {
      id: 1,
      title: "Vos préférences alimentaires",
      subtitle: "Personnalisez votre expérience culinaire",
      icon: "leaf",
      content: (
        <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.stepDescription}>
            Sélectionnez vos régimes alimentaires et allergies pour des recettes adaptées
          </Text>
          
          <View style={styles.subsection}>
            <Text style={styles.subsectionTitle}>Régimes alimentaires</Text>
            <View style={styles.optionsGrid}>
              {dietaryOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionCard,
                    selectedDietaryRestrictions.includes(option) && styles.optionCardSelected
                  ]}
                  onPress={() => toggleDietaryRestriction(option)}
                >
                  <Text style={[
                    styles.optionText,
                    selectedDietaryRestrictions.includes(option) && styles.optionTextSelected
                  ]}>
                    {dietaryLabels[option] || option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.subsection}>
            <Text style={styles.subsectionTitle}>Allergies et intolérances</Text>
            <View style={styles.optionsGrid}>
              {allergenOptions.map((allergen) => (
                <TouchableOpacity
                  key={allergen}
                  style={[
                    styles.optionCard,
                    styles.allergenCard,
                    selectedAllergens.includes(allergen) && styles.allergenCardSelected
                  ]}
                  onPress={() => toggleAllergen(allergen)}
                >
                  <Text style={[
                    styles.optionText,
                    selectedAllergens.includes(allergen) && styles.allergenTextSelected
                  ]}>
                    {allergen}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      )
    },
    {
      id: 2,
      title: "Votre profil de chef",
      subtitle: "Aidez-nous à adapter les recettes",
      icon: "person",
      content: (
        <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
          <View style={styles.subsection}>
            <Text style={styles.subsectionTitle}>Niveau de cuisine</Text>
            <View style={styles.optionsColumn}>
              {(['debutant', 'intermediaire', 'avance'] as CookingSkillLevel[]).map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.optionRow,
                    selectedSkillLevel === level && styles.optionRowSelected
                  ]}
                  onPress={() => setSelectedSkillLevel(level)}
                >
                  <View style={[
                    styles.radio,
                    selectedSkillLevel === level && styles.radioSelected
                  ]} />
                  <Text style={[
                    styles.optionRowText,
                    selectedSkillLevel === level && styles.optionRowTextSelected
                  ]}>
                    {cookingSkillLabels[level]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.subsection}>
            <Text style={styles.subsectionTitle}>Budget préféré</Text>
            <View style={styles.optionsColumn}>
              {(['economique', 'moyen', 'premium'] as BudgetPreference[]).map((budget) => (
                <TouchableOpacity
                  key={budget}
                  style={[
                    styles.optionRow,
                    selectedBudget === budget && styles.optionRowSelected
                  ]}
                  onPress={() => setSelectedBudget(budget)}
                >
                  <View style={[
                    styles.radio,
                    selectedBudget === budget && styles.radioSelected
                  ]} />
                  <Text style={[
                    styles.optionRowText,
                    selectedBudget === budget && styles.optionRowTextSelected
                  ]}>
                    {budgetLabels[budget]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.subsection}>
            <Text style={styles.subsectionTitle}>Temps disponible pour cuisiner</Text>
            <View style={styles.optionsColumn}>
              {cookingTimeOptions.map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.optionRow,
                    selectedCookingTime === option.key && styles.optionRowSelected
                  ]}
                  onPress={() => setSelectedCookingTime(option.key as any)}
                >
                  <View style={[
                    styles.radio,
                    selectedCookingTime === option.key && styles.radioSelected
                  ]} />
                  <Text style={[
                    styles.optionRowText,
                    selectedCookingTime === option.key && styles.optionRowTextSelected
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.subsection}>
            <Text style={styles.subsectionTitle}>Équipement de cuisine disponible</Text>
            <View style={styles.optionsGrid}>
              {equipmentOptions.map((equipment) => (
                <TouchableOpacity
                  key={equipment}
                  style={[
                    styles.optionCard,
                    selectedEquipment.includes(equipment) && styles.optionCardSelected
                  ]}
                  onPress={() => toggleEquipment(equipment)}
                >
                  <Text style={[
                    styles.optionText,
                    selectedEquipment.includes(equipment) && styles.optionTextSelected
                  ]}>
                    {kitchenEquipmentLabels[equipment as keyof typeof kitchenEquipmentLabels]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      )
    }
  ];

  const renderStep = ({ item, index }: { item: OnboardingStep; index: number }) => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>{item.title}</Text>
        <Text style={styles.stepSubtitle}>{item.subtitle}</Text>
      </View>
      
      <View style={styles.stepBody}>
        {item.content}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* En-tête avec progression */}
      <View style={styles.header}>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${((currentOnboardingStep + 1) / steps.length) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {currentOnboardingStep + 1} / {steps.length}
          </Text>
        </View>
        
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Passer</Text>
        </TouchableOpacity>
      </View>

      {/* Contenu des étapes */}
      <View style={styles.stepsContainer}>
        {renderStep({ item: steps[currentOnboardingStep], index: currentOnboardingStep })}
      </View>

      {/* Navigation */}
      <View style={styles.navigation}>
        {currentOnboardingStep > 0 && (
          <Button
            title="Précédent"
            onPress={handlePrevious}
            variant="outline"
            style={styles.navButton}
          />
        )}
        
        <View style={styles.navSpacer} />
        
        <Button
          title={currentOnboardingStep === steps.length - 1 ? "Commencer !" : "Suivant"}
          onPress={handleNext}
          style={styles.navButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  
  progressContainer: {
    flex: 1,
    marginRight: 20,
  },
  
  progressBar: {
    height: 4,
    backgroundColor: colors.gray[200],
    borderRadius: 2,
    marginBottom: 8,
  },
  
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary[500],
    borderRadius: 2,
  },
  
  progressText: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
    fontWeight: '500',
  },
  
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  
  skipText: {
    fontSize: typography.sizes.base,
    color: colors.gray[500],
    fontWeight: '600',
  },
  
  stepsContainer: {
    flex: 1,
  },
  
  stepContainer: {
    width: width,
    flex: 1,
    paddingHorizontal: 20,
  },
  
  stepHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  
  stepTitle: {
    fontSize: typography.sizes['3xl'],
    fontWeight: 'bold',
    color: colors.gray[900],
    textAlign: 'center',
    marginBottom: 8,
  },
  
  stepSubtitle: {
    fontSize: typography.sizes.lg,
    color: colors.gray[600],
    textAlign: 'center',
  },
  
  stepBody: {
    flex: 1,
  },
  
  stepContent: {
    flex: 1,
  },
  
  stepDescription: {
    fontSize: typography.sizes.base,
    color: colors.gray[700],
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  
  welcomeContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  
  welcomeTitle: {
    fontSize: typography.sizes['2xl'],
    fontWeight: 'bold',
    color: colors.gray[900],
    textAlign: 'center',
    marginBottom: 16,
  },
  
  welcomeDescription: {
    fontSize: typography.sizes.base,
    color: colors.gray[600],
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  
  featureList: {
    gap: 16,
  },
  
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  
  featureText: {
    fontSize: typography.sizes.base,
    color: colors.gray[700],
    fontWeight: '500',
  },
  
  subsection: {
    marginBottom: 32,
  },
  
  subsectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: 'bold',
    color: colors.gray[900],
    marginBottom: 16,
  },
  
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  
  optionsColumn: {
    gap: 12,
  },
  
  optionCard: {
    backgroundColor: colors.gray[50],
    borderWidth: 2,
    borderColor: colors.gray[200],
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minWidth: '45%',
    alignItems: 'center',
  },
  
  optionCardSelected: {
    backgroundColor: colors.primary[50],
    borderColor: colors.primary[500],
  },
  
  allergenCard: {
    backgroundColor: colors.accent.red[25] || colors.gray[50],
    borderColor: colors.accent.red[200],
  },
  
  allergenCardSelected: {
    backgroundColor: colors.accent.red[50],
    borderColor: colors.accent.red[500],
  },
  
  optionText: {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
    color: colors.gray[700],
    textAlign: 'center',
  },
  
  optionTextSelected: {
    color: colors.primary[700],
  },
  
  allergenTextSelected: {
    color: colors.accent.red[700],
  },
  
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[50],
    borderWidth: 2,
    borderColor: colors.gray[200],
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  
  optionRowSelected: {
    backgroundColor: colors.primary[50],
    borderColor: colors.primary[500],
  },
  
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.gray[300],
  },
  
  radioSelected: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[500],
  },
  
  optionRowText: {
    flex: 1,
    fontSize: typography.sizes.base,
    fontWeight: '500',
    color: colors.gray[700],
  },
  
  optionRowTextSelected: {
    color: colors.primary[700],
  },
  
  navigation: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 32,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
  },
  
  navSpacer: {
    flex: 1,
  },
  
  navButton: {
    minWidth: 100,
  },
});
