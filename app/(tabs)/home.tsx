import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useRecipeStore, useUserStore } from '../../src/stores';
import { Button, LoadingSpinner } from '../../src/components/ui';
import { colors, typography } from '../../src/constants';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { profile } = useUserStore();
  const { 
    recentRecipes, 
    isLoadingRecipes, 
    loadRecipes, 
    loadRecentRecipes 
  } = useRecipeStore();

  useEffect(() => {
    loadRecipes();
    loadRecentRecipes();
  }, [loadRecipes, loadRecentRecipes]);

  const handleAddIngredients = () => {
    router.push('/ingredients/add');
  };

  const handleViewRecipe = (recipeId: string) => {
    router.push(`/recipes/${recipeId}`);
  };

  const handleViewAllRecipes = () => {
    router.push('/(tabs)/recipes');
  };

  if (isLoadingRecipes) {
    return <LoadingSpinner fullScreen message="Chargement..." />;
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header de bienvenue */}
      <View style={styles.header}>
        <Text style={styles.greeting}>
          Bonjour {profile?.name || 'Chef'} ! 👋
        </Text>
        <Text style={styles.subtitle}>
          Que souhaitez-vous cuisiner aujourd'hui ?
        </Text>
      </View>

      {/* Bouton principal d'ajout d'ingrédients */}
      <TouchableOpacity 
        style={styles.mainActionCard}
        onPress={handleAddIngredients}
        activeOpacity={0.9}
      >
        <View style={styles.mainActionContent}>
          <View style={styles.mainActionIcon}>
            <Ionicons name="add-circle" size={32} color={colors.white} />
          </View>
          <View style={styles.mainActionText}>
            <Text style={styles.mainActionTitle}>
              Générer une recette
            </Text>
            <Text style={styles.mainActionSubtitle}>
              Saisissez vos ingrédients et laissez l'IA créer votre recette
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={colors.white} />
        </View>
      </TouchableOpacity>

      {/* Section des recettes récentes */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recettes récentes</Text>
          {recentRecipes.length > 0 && (
            <TouchableOpacity onPress={handleViewAllRecipes}>
              <Text style={styles.seeAllText}>Voir tout</Text>
            </TouchableOpacity>
          )}
        </View>

        {recentRecipes.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons 
              name="restaurant-outline" 
              size={48} 
              color={colors.gray[400]} 
            />
            <Text style={styles.emptyStateTitle}>
              Aucune recette pour le moment
            </Text>
            <Text style={styles.emptyStateSubtitle}>
              Commencez par générer votre première recette !
            </Text>
            <Button
              title="Générer une recette"
              onPress={handleAddIngredients}
              style={styles.emptyStateButton}
            />
          </View>
        ) : (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recipesScrollContainer}
          >
            {recentRecipes.map((recipe) => (
              <TouchableOpacity
                key={recipe.id}
                style={styles.recipeCard}
                onPress={() => handleViewRecipe(recipe.id)}
                activeOpacity={0.8}
              >
                <View style={styles.recipeImagePlaceholder}>
                  <Ionicons 
                    name="image-outline" 
                    size={32} 
                    color={colors.gray[400]} 
                  />
                </View>
                
                <View style={styles.recipeCardContent}>
                  <Text style={styles.recipeTitle} numberOfLines={2}>
                    {recipe.title}
                  </Text>
                  
                  <View style={styles.recipeInfo}>
                    <View style={styles.recipeInfoItem}>
                      <Ionicons 
                        name="time-outline" 
                        size={14} 
                        color={colors.gray[500]} 
                      />
                      <Text style={styles.recipeInfoText}>
                        {recipe.totalTime} min
                      </Text>
                    </View>
                    
                    <View style={styles.recipeInfoItem}>
                      <Ionicons 
                        name="people-outline" 
                        size={14} 
                        color={colors.gray[500]} 
                      />
                      <Text style={styles.recipeInfoText}>
                        {recipe.servings}
                      </Text>
                    </View>
                  </View>
                  
                  {recipe.aiGenerated && (
                    <View style={styles.aiBadge}>
                      <Text style={styles.aiBadgeText}>🤖 IA</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Actions rapides */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions rapides</Text>
        
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => router.push('/(tabs)/shopping')}
          >
            <Ionicons 
              name="list-outline" 
              size={24} 
              color={colors.primary[600]} 
            />
            <Text style={styles.quickActionText}>Liste de courses</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => router.push('/(tabs)/recipes')}
          >
            <Ionicons 
              name="heart-outline" 
              size={24} 
              color={colors.primary[600]} 
            />
            <Text style={styles.quickActionText}>Favoris</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => router.push('/(tabs)/profile')}
          >
            <Ionicons 
              name="settings-outline" 
              size={24} 
              color={colors.primary[600]} 
            />
            <Text style={styles.quickActionText}>Préférences</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  
  greeting: {
    fontSize: typography.sizes['2xl'],
    fontWeight: 'bold',
    color: colors.gray[900],
    marginBottom: 4,
  },
  
  subtitle: {
    fontSize: typography.sizes.base,
    color: colors.gray[600],
  },
  
  mainActionCard: {
    marginHorizontal: 20,
    marginBottom: 32,
    borderRadius: 16,
    backgroundColor: colors.primary[500],
    shadowColor: colors.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  
  mainActionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  
  mainActionIcon: {
    marginRight: 16,
  },
  
  mainActionText: {
    flex: 1,
  },
  
  mainActionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 4,
  },
  
  mainActionSubtitle: {
    fontSize: typography.sizes.sm,
    color: colors.primary[100],
  },
  
  section: {
    marginBottom: 32,
  },
  
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  
  sectionTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: 'bold',
    color: colors.gray[900],
  },
  
  seeAllText: {
    fontSize: typography.sizes.sm,
    color: colors.primary[600],
    fontWeight: '600',
  },
  
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  
  emptyStateTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: '600',
    color: colors.gray[700],
    marginTop: 16,
    marginBottom: 8,
  },
  
  emptyStateSubtitle: {
    fontSize: typography.sizes.base,
    color: colors.gray[500],
    textAlign: 'center',
    marginBottom: 24,
  },
  
  emptyStateButton: {
    paddingHorizontal: 32,
  },
  
  recipesScrollContainer: {
    paddingLeft: 20,
  },
  
  recipeCard: {
    width: width * 0.7,
    backgroundColor: colors.white,
    borderRadius: 12,
    marginRight: 16,
    shadowColor: colors.gray[300],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  recipeImagePlaceholder: {
    height: 120,
    backgroundColor: colors.gray[100],
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  recipeCardContent: {
    padding: 16,
  },
  
  recipeTitle: {
    fontSize: typography.sizes.base,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: 8,
    lineHeight: 20,
  },
  
  recipeInfo: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  
  recipeInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  
  recipeInfoText: {
    fontSize: typography.sizes.xs,
    color: colors.gray[500],
  },
  
  aiBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: colors.primary[50],
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary[200],
  },
  
  aiBadgeText: {
    fontSize: typography.sizes.xs,
    color: colors.primary[700],
    fontWeight: '600',
  },
  
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  
  quickActionCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: colors.gray[300],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  
  quickActionText: {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
    color: colors.gray[700],
    marginTop: 8,
    textAlign: 'center',
  },
});
