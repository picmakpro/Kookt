import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Share,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useRecipeStore, useShoppingStore } from '../../src/stores';
import { 
  Button, 
  LoadingSpinner, 
  Badge, 
  DifficultyBadge, 
  AIBadge,
  DietaryBadge 
} from '../../src/components/ui';
import { colors, typography } from '../../src/constants';
import { 
  formatTime, 
  formatQuantity, 
  formatServings,
  generateShareableRecipeText 
} from '../../src/utils/formatters';

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { 
    getRecipeById, 
    toggleFavorite, 
    markAsCooked,
    rateRecipe,
    currentRecipe,
    setCurrentRecipe 
  } = useRecipeStore();
  
  const { generateFromRecipe } = useShoppingStore();
  
  const [recipe, setRecipe] = useState(getRecipeById(id || ''));
  const [selectedSteps, setSelectedSteps] = useState<Set<string>>(new Set());
  const [cookingMode, setCookingMode] = useState(false);

  useEffect(() => {
    if (id) {
      const foundRecipe = getRecipeById(id);
      if (foundRecipe) {
        setRecipe(foundRecipe);
        setCurrentRecipe(foundRecipe);
      }
    }
  }, [id, getRecipeById, setCurrentRecipe]);

  if (!recipe) {
    return (
      <View style={styles.container}>
        <LoadingSpinner fullScreen message="Chargement de la recette..." />
      </View>
    );
  }

  const handleToggleFavorite = () => {
    toggleFavorite(recipe.id);
    setRecipe(prev => prev ? { ...prev, isFavorite: !prev.isFavorite } : null);
  };

  const handleMarkAsCooked = () => {
    Alert.alert(
      'Recette cuisinée',
      'Félicitations ! Cette recette a été ajoutée à votre historique.',
      [
        { text: 'OK', onPress: () => markAsCooked(recipe.id) }
      ]
    );
  };

  const handleAddToShoppingList = () => {
    Alert.alert(
      'Ajouter à la liste de courses',
      'Voulez-vous ajouter tous les ingrédients de cette recette à votre liste de courses ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Ajouter', 
          onPress: async () => {
            await generateFromRecipe(recipe);
            Alert.alert(
              'Ajouté !',
              'Les ingrédients ont été ajoutés à votre liste de courses.',
              [
                { 
                  text: 'Voir la liste', 
                  onPress: () => router.push('/(tabs)/shopping')
                },
                { text: 'OK' }
              ]
            );
          }
        },
      ]
    );
  };

  const handleShareRecipe = async () => {
    try {
      const shareContent = generateShareableRecipeText(recipe);
      await Share.share({
        message: shareContent,
        title: recipe.title,
      });
    } catch (error) {
      console.error('Erreur partage:', error);
    }
  };

  const toggleStepCompleted = (stepId: string) => {
    setSelectedSteps(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stepId)) {
        newSet.delete(stepId);
      } else {
        newSet.add(stepId);
      }
      return newSet;
    });
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <Text style={styles.recipeTitle}>{recipe.title}</Text>
        <Text style={styles.recipeDescription}>{recipe.description}</Text>
        
        <View style={styles.recipeInfo}>
          <View style={styles.infoItem}>
            <Ionicons name="time-outline" size={20} color={colors.gray[600]} />
            <Text style={styles.infoText}>{formatTime(recipe.totalTime)}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Ionicons name="people-outline" size={20} color={colors.gray[600]} />
            <Text style={styles.infoText}>{formatServings(recipe.servings)}</Text>
          </View>
          
          <DifficultyBadge difficulty={recipe.difficulty} />
        </View>
        
        <View style={styles.badgesContainer}>
          {recipe.aiGenerated && <AIBadge style={styles.badge} />}
          
          {recipe.dietary.slice(0, 3).map((diet) => (
            <DietaryBadge key={diet} dietary={diet} style={styles.badge} />
          ))}
          
          {recipe.dietary.length > 3 && (
            <Badge
              text={`+${recipe.dietary.length - 3}`}
              variant="secondary"
              size="sm"
              style={styles.badge}
            />
          )}
        </View>
      </View>
      
      <View style={styles.headerActions}>
        <TouchableOpacity
          style={[styles.actionButton, recipe.isFavorite && styles.favoriteActive]}
          onPress={handleToggleFavorite}
        >
          <Ionicons 
            name={recipe.isFavorite ? "heart" : "heart-outline"} 
            size={24} 
            color={recipe.isFavorite ? colors.accent.red[500] : colors.gray[600]} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleShareRecipe}
        >
          <Ionicons name="share-outline" size={24} color={colors.gray[600]} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderIngredients = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Ingrédients</Text>
        <TouchableOpacity onPress={handleAddToShoppingList}>
          <Text style={styles.addToListText}>Ajouter à la liste</Text>
        </TouchableOpacity>
      </View>
      
      {recipe.ingredients.map((ingredient, index) => (
        <View key={index} style={styles.ingredientItem}>
          <View style={styles.ingredientQuantity}>
            <Text style={styles.quantityText}>
              {formatQuantity(ingredient.quantity, ingredient.unit)}
            </Text>
          </View>
          <Text style={styles.ingredientName}>{ingredient.name}</Text>
          {!ingredient.available && (
            <View style={styles.missingBadge}>
              <Text style={styles.missingBadgeText}>Manquant</Text>
            </View>
          )}
        </View>
      ))}
    </View>
  );

  const renderSteps = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Préparation</Text>
        <TouchableOpacity 
          onPress={() => setCookingMode(!cookingMode)}
          style={styles.cookingModeButton}
        >
          <Ionicons 
            name={cookingMode ? "checkmark-circle" : "play-circle-outline"} 
            size={20} 
            color={colors.primary[600]} 
          />
          <Text style={styles.cookingModeText}>
            {cookingMode ? "Mode cuisine" : "Activer"}
          </Text>
        </TouchableOpacity>
      </View>
      
      {recipe.steps.map((step, index) => {
        const isCompleted = selectedSteps.has(step.id);
        
        return (
          <TouchableOpacity
            key={step.id}
            style={[styles.stepItem, isCompleted && styles.stepCompleted]}
            onPress={() => cookingMode && toggleStepCompleted(step.id)}
            activeOpacity={cookingMode ? 0.7 : 1}
          >
            <View style={styles.stepHeader}>
              <View style={styles.stepNumber}>
                {cookingMode ? (
                  <Ionicons
                    name={isCompleted ? "checkmark-circle" : "ellipse-outline"}
                    size={24}
                    color={isCompleted ? colors.primary[500] : colors.gray[300]}
                  />
                ) : (
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                )}
              </View>
              
              <View style={styles.stepContent}>
                <Text style={[
                  styles.stepInstruction,
                  isCompleted && styles.stepInstructionCompleted
                ]}>
                  {step.instruction}
                </Text>
                
                {step.duration && (
                  <View style={styles.stepMeta}>
                    <Ionicons name="time-outline" size={16} color={colors.gray[500]} />
                    <Text style={styles.stepMetaText}>
                      {formatTime(step.duration)}
                    </Text>
                  </View>
                )}
                
                {step.temperature && (
                  <View style={styles.stepMeta}>
                    <Ionicons name="thermometer-outline" size={16} color={colors.gray[500]} />
                    <Text style={styles.stepMetaText}>
                      {step.temperature}°C
                    </Text>
                  </View>
                )}
                
                {step.tips && (
                  <View style={styles.tipContainer}>
                    <Ionicons name="bulb-outline" size={16} color={colors.accent.yellow[600]} />
                    <Text style={styles.tipText}>{step.tips}</Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderNutrition = () => {
    if (!recipe.nutrition) return null;
    
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informations nutritionnelles</Text>
        <Text style={styles.nutritionSubtitle}>Par portion</Text>
        
        <View style={styles.nutritionGrid}>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>{Math.round(recipe.nutrition.calories)}</Text>
            <Text style={styles.nutritionLabel}>Calories</Text>
          </View>
          
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>{Math.round(recipe.nutrition.proteins)}g</Text>
            <Text style={styles.nutritionLabel}>Protéines</Text>
          </View>
          
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>{Math.round(recipe.nutrition.carbs)}g</Text>
            <Text style={styles.nutritionLabel}>Glucides</Text>
          </View>
          
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>{Math.round(recipe.nutrition.fats)}g</Text>
            <Text style={styles.nutritionLabel}>Lipides</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderHeader()}
        {renderIngredients()}
        {renderSteps()}
        {renderNutrition()}
      </ScrollView>
      
      <View style={styles.footer}>
        <Button
          title="J'ai cuisiné cette recette !"
          onPress={handleMarkAsCooked}
          fullWidth
          style={styles.cookedButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  
  scrollView: {
    flex: 1,
  },
  
  header: {
    backgroundColor: colors.white,
    padding: 20,
    paddingTop: 16,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  
  headerContent: {
    flex: 1,
    marginRight: 16,
  },
  
  recipeTitle: {
    fontSize: typography.sizes['2xl'],
    fontWeight: 'bold',
    color: colors.gray[900],
    marginBottom: 8,
  },
  
  recipeDescription: {
    fontSize: typography.sizes.base,
    color: colors.gray[600],
    lineHeight: 22,
    marginBottom: 16,
  },
  
  recipeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  
  infoText: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
    fontWeight: '500',
  },
  
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  
  badge: {
    marginBottom: 4,
  },
  
  headerActions: {
    gap: 8,
  },
  
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  favoriteActive: {
    backgroundColor: colors.accent.red[50],
  },
  
  section: {
    backgroundColor: colors.white,
    marginTop: 16,
    padding: 20,
  },
  
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  
  sectionTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: 'bold',
    color: colors.gray[900],
  },
  
  addToListText: {
    fontSize: typography.sizes.sm,
    color: colors.primary[600],
    fontWeight: '600',
  },
  
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  
  ingredientQuantity: {
    width: 80,
    marginRight: 16,
  },
  
  quantityText: {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
    color: colors.primary[600],
  },
  
  ingredientName: {
    flex: 1,
    fontSize: typography.sizes.base,
    color: colors.gray[900],
  },
  
  missingBadge: {
    backgroundColor: colors.accent.red[100],
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  
  missingBadgeText: {
    fontSize: typography.sizes.xs,
    color: colors.accent.red[700],
    fontWeight: '600',
  },
  
  cookingModeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  
  cookingModeText: {
    fontSize: typography.sizes.sm,
    color: colors.primary[600],
    fontWeight: '600',
  },
  
  stepItem: {
    marginBottom: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: colors.gray[50],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  
  stepCompleted: {
    backgroundColor: colors.primary[50],
    borderColor: colors.primary[200],
  },
  
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  
  stepNumberText: {
    fontSize: typography.sizes.sm,
    fontWeight: 'bold',
    color: colors.white,
  },
  
  stepContent: {
    flex: 1,
  },
  
  stepInstruction: {
    fontSize: typography.sizes.base,
    color: colors.gray[900],
    lineHeight: 22,
    marginBottom: 8,
  },
  
  stepInstructionCompleted: {
    textDecorationLine: 'line-through',
    color: colors.gray[500],
  },
  
  stepMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  
  stepMetaText: {
    fontSize: typography.sizes.sm,
    color: colors.gray[500],
    fontWeight: '500',
  },
  
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: colors.accent.yellow[50],
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  
  tipText: {
    flex: 1,
    fontSize: typography.sizes.sm,
    color: colors.accent.yellow[800],
    fontStyle: 'italic',
  },
  
  nutritionSubtitle: {
    fontSize: typography.sizes.sm,
    color: colors.gray[500],
    marginBottom: 16,
  },
  
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
  nutritionItem: {
    alignItems: 'center',
    flex: 1,
  },
  
  nutritionValue: {
    fontSize: typography.sizes.lg,
    fontWeight: 'bold',
    color: colors.gray[900],
    marginBottom: 4,
  },
  
  nutritionLabel: {
    fontSize: typography.sizes.xs,
    color: colors.gray[500],
    textAlign: 'center',
  },
  
  footer: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
  },
  
  cookedButton: {
    paddingVertical: 16,
  },
});
