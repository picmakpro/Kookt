import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useIngredientStore, useRecipeStore, useUserStore } from '../../src/stores';
import { Button, LoadingSpinner, AILoadingSpinner } from '../../src/components/ui';
import { colors, typography } from '../../src/constants';
import { RecipeGenerationRequest } from '../../src/types/recipe';

export default function AddIngredientsScreen() {
  const router = useRouter();
  const {
    currentInput,
    setCurrentInput,
    suggestedIngredients,
    selectedIngredients,
    addSelectedIngredient,
    removeSelectedIngredient,
    clearSelectedIngredients,
    recentIngredients,
    loadRecentIngredients,
    isLoadingSuggestions,
  } = useIngredientStore();

  const {
    generateRecipes,
    isGenerating,
    generationError,
    clearError,
  } = useRecipeStore();

  const { profile, incrementRecipeGenerated } = useUserStore();

  const [step, setStep] = useState<'ingredients' | 'generating'>('ingredients');

  useEffect(() => {
    loadRecentIngredients();
  }, [loadRecentIngredients]);

  const handleAddIngredient = (ingredient: string) => {
    if (ingredient.trim() && !selectedIngredients.includes(ingredient.trim())) {
      addSelectedIngredient(ingredient.trim());
      setCurrentInput('');
    }
  };

  const handleRemoveIngredient = (ingredient: string) => {
    removeSelectedIngredient(ingredient);
  };

  const handleGenerateRecipes = async () => {
    if (selectedIngredients.length === 0) {
      Alert.alert(
        'Ingrédients manquants',
        'Veuillez ajouter au moins un ingrédient pour générer une recette.'
      );
      return;
    }

    setStep('generating');
    clearError();

    const request: RecipeGenerationRequest = {
      ingredients: selectedIngredients,
      dietaryRestrictions: profile?.preferences.dietaryRestrictions || [],
      allergens: profile?.preferences.allergens || [],
      maxTime: profile?.preferences.availableCookingTime === '15min' ? 15 :
                profile?.preferences.availableCookingTime === '30min' ? 30 :
                profile?.preferences.availableCookingTime === '1h' ? 60 :
                profile?.preferences.availableCookingTime === '2h+' ? 120 : undefined,
      servings: profile?.preferences.preferredServings || 2,
      budgetLevel: profile?.preferences.budgetPreference || 'moyen',
      goals: ['savoureux', 'équilibré'],
    };

    try {
      const recipe = await generateRecipes(request);
      
      if (recipe) {
        await incrementRecipeGenerated();
        clearSelectedIngredients();
        
        // Naviguer vers la recette générée
        router.dismiss();
        router.push(`/recipes/${recipe.id}`);
      } else {
        setStep('ingredients');
        Alert.alert(
          'Erreur de génération',
          generationError || 'Impossible de générer une recette. Veuillez réessayer.'
        );
      }
    } catch (error) {
      setStep('ingredients');
      Alert.alert(
        'Erreur',
        'Une erreur est survenue lors de la génération. Veuillez réessayer.'
      );
    }
  };

  const renderSuggestionItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handleAddIngredient(item)}
    >
      <Text style={styles.suggestionText}>{item}</Text>
      <Ionicons name="add-circle-outline" size={20} color={colors.primary[500]} />
    </TouchableOpacity>
  );

  const renderSelectedIngredient = ({ item }: { item: string }) => (
    <View style={styles.selectedIngredient}>
      <Text style={styles.selectedIngredientText}>{item}</Text>
      <TouchableOpacity onPress={() => handleRemoveIngredient(item)}>
        <Ionicons name="close-circle" size={20} color={colors.gray[400]} />
      </TouchableOpacity>
    </View>
  );

  const renderRecentIngredient = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.recentItem}
      onPress={() => handleAddIngredient(item)}
    >
      <Ionicons name="time-outline" size={16} color={colors.gray[400]} />
      <Text style={styles.recentText}>{item}</Text>
    </TouchableOpacity>
  );

  if (step === 'generating') {
    return (
      <AILoadingSpinner message="Génération de votre recette personnalisée..." />
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* En-tête */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.dismiss()}
          style={styles.closeButton}
        >
          <Ionicons name="close" size={24} color={colors.gray[600]} />
        </TouchableOpacity>
        
        <Text style={styles.title}>Ajouter des ingrédients</Text>
        
        <View style={styles.headerSpacer} />
      </View>

      {/* Zone de saisie */}
      <View style={styles.inputSection}>
        <View style={styles.inputContainer}>
          <Ionicons name="search" size={20} color={colors.gray[400]} />
          <TextInput
            style={styles.input}
            placeholder="Tapez un ingrédient..."
            value={currentInput}
            onChangeText={setCurrentInput}
            onSubmitEditing={() => handleAddIngredient(currentInput)}
            autoFocus
            returnKeyType="done"
            placeholderTextColor={colors.gray[400]}
          />
          
          {currentInput.length > 0 && (
            <TouchableOpacity onPress={() => handleAddIngredient(currentInput)}>
              <Ionicons name="add-circle" size={24} color={colors.primary[500]} />
            </TouchableOpacity>
          )}
        </View>

        {/* Suggestions de l'IA */}
        {(suggestedIngredients.length > 0 || isLoadingSuggestions) && (
          <View style={styles.suggestionsContainer}>
            {isLoadingSuggestions ? (
              <View style={styles.loadingContainer}>
                <LoadingSpinner size="small" />
                <Text style={styles.loadingText}>Suggestions IA...</Text>
              </View>
            ) : (
              <FlatList
                data={suggestedIngredients}
                renderItem={renderSuggestionItem}
                keyExtractor={(item) => item}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.suggestionsList}
              />
            )}
          </View>
        )}
      </View>

      {/* Ingrédients sélectionnés */}
      {selectedIngredients.length > 0 && (
        <View style={styles.selectedSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Ingrédients sélectionnés ({selectedIngredients.length})
            </Text>
            <TouchableOpacity onPress={clearSelectedIngredients}>
              <Text style={styles.clearButton}>Tout effacer</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={selectedIngredients}
            renderItem={renderSelectedIngredient}
            keyExtractor={(item) => item}
            numColumns={2}
            contentContainerStyle={styles.selectedList}
          />
        </View>
      )}

      {/* Ingrédients récents */}
      {recentIngredients.length > 0 && selectedIngredients.length === 0 && (
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Récemment utilisés</Text>
          <FlatList
            data={recentIngredients.slice(0, 6)}
            renderItem={renderRecentIngredient}
            keyExtractor={(item) => item}
            numColumns={2}
            contentContainerStyle={styles.recentList}
          />
        </View>
      )}

      {/* Message d'aide */}
      {selectedIngredients.length === 0 && recentIngredients.length === 0 && (
        <View style={styles.helpSection}>
          <Ionicons name="bulb-outline" size={48} color={colors.gray[400]} />
          <Text style={styles.helpTitle}>Ajoutez vos ingrédients</Text>
          <Text style={styles.helpText}>
            Saisissez les ingrédients que vous avez à disposition. 
            L'IA vous proposera des recettes personnalisées !
          </Text>
        </View>
      )}

      {/* Bouton de génération */}
      <View style={styles.footer}>
        <Button
          title={`Générer une recette${selectedIngredients.length > 0 ? ` (${selectedIngredients.length})` : ''}`}
          onPress={handleGenerateRecipes}
          disabled={selectedIngredients.length === 0 || isGenerating}
          loading={isGenerating}
          fullWidth
          style={styles.generateButton}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  
  closeButton: {
    padding: 4,
  },
  
  title: {
    flex: 1,
    fontSize: typography.sizes.lg,
    fontWeight: 'bold',
    color: colors.gray[900],
    textAlign: 'center',
    marginHorizontal: 16,
  },
  
  headerSpacer: {
    width: 32,
  },
  
  inputSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[50],
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  
  input: {
    flex: 1,
    fontSize: typography.sizes.base,
    color: colors.gray[900],
  },
  
  suggestionsContainer: {
    marginTop: 16,
  },
  
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  
  loadingText: {
    fontSize: typography.sizes.sm,
    color: colors.gray[500],
  },
  
  suggestionsList: {
    paddingVertical: 8,
  },
  
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary[50],
    borderWidth: 1,
    borderColor: colors.primary[200],
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    gap: 6,
  },
  
  suggestionText: {
    fontSize: typography.sizes.sm,
    color: colors.primary[700],
    fontWeight: '500',
  },
  
  selectedSection: {
    flex: 1,
    padding: 20,
  },
  
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: 'bold',
    color: colors.gray[900],
  },
  
  clearButton: {
    fontSize: typography.sizes.sm,
    color: colors.accent.red[500],
    fontWeight: '600',
  },
  
  selectedList: {
    gap: 8,
  },
  
  selectedIngredient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primary[50],
    borderWidth: 1,
    borderColor: colors.primary[200],
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    margin: 4,
  },
  
  selectedIngredientText: {
    flex: 1,
    fontSize: typography.sizes.sm,
    color: colors.primary[700],
    fontWeight: '500',
    marginRight: 8,
  },
  
  recentSection: {
    flex: 1,
    padding: 20,
  },
  
  recentList: {
    gap: 8,
    marginTop: 16,
  },
  
  recentItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[50],
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    margin: 4,
    gap: 8,
  },
  
  recentText: {
    flex: 1,
    fontSize: typography.sizes.sm,
    color: colors.gray[700],
    fontWeight: '500',
  },
  
  helpSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  
  helpTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: 'bold',
    color: colors.gray[700],
    marginTop: 16,
    marginBottom: 8,
  },
  
  helpText: {
    fontSize: typography.sizes.base,
    color: colors.gray[500],
    textAlign: 'center',
    lineHeight: 22,
  },
  
  footer: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
  },
  
  generateButton: {
    paddingVertical: 16,
  },
});
