import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useRecipeStore } from '../../src/stores';
import { LoadingSpinner, Button, Badge, DifficultyBadge, AIBadge } from '../../src/components/ui';
import { colors, typography } from '../../src/constants';
import { Recipe } from '../../src/types';
import { formatTime } from '../../src/utils/formatters';

export default function RecipesScreen() {
  const router = useRouter();
  const {
    recipes,
    isLoadingRecipes,
    loadRecipes,
    searchQuery,
    setSearchQuery,
    getFilteredRecipes,
    clearFilters,
  } = useRecipeStore();

  const [showFilters, setShowFilters] = useState(false);
  const filteredRecipes = getFilteredRecipes();

  useEffect(() => {
    loadRecipes();
  }, [loadRecipes]);

  const handleRecipePress = (recipeId: string) => {
    router.push(`/recipes/${recipeId}`);
  };

  const handleAddRecipe = () => {
    router.push('/ingredients/add');
  };

  const renderRecipeItem = ({ item }: { item: Recipe }) => (
    <TouchableOpacity
      style={styles.recipeCard}
      onPress={() => handleRecipePress(item.id)}
      activeOpacity={0.8}
    >
      <View style={styles.recipeImagePlaceholder}>
        <Ionicons name="image-outline" size={32} color={colors.gray[400]} />
      </View>
      
      <View style={styles.recipeContent}>
        <View style={styles.recipeHeader}>
          <Text style={styles.recipeTitle} numberOfLines={2}>
            {item.title}
          </Text>
          
          {item.isFavorite && (
            <Ionicons name="heart" size={20} color={colors.accent.red[500]} />
          )}
        </View>
        
        <Text style={styles.recipeDescription} numberOfLines={2}>
          {item.description}
        </Text>
        
        <View style={styles.recipeInfo}>
          <View style={styles.infoItem}>
            <Ionicons name="time-outline" size={16} color={colors.gray[500]} />
            <Text style={styles.infoText}>{formatTime(item.totalTime)}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Ionicons name="people-outline" size={16} color={colors.gray[500]} />
            <Text style={styles.infoText}>{item.servings} pers.</Text>
          </View>
          
          <DifficultyBadge difficulty={item.difficulty} />
        </View>
        
        <View style={styles.recipeTags}>
          {item.aiGenerated && <AIBadge style={styles.badge} />}
          
          {item.dietary.slice(0, 2).map((diet) => (
            <Badge
              key={diet}
              text={diet}
              variant="secondary"
              size="sm"
              style={styles.badge}
            />
          ))}
          
          {item.dietary.length > 2 && (
            <Badge
              text={`+${item.dietary.length - 2}`}
              variant="secondary"
              size="sm"
              style={styles.badge}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="restaurant-outline" size={64} color={colors.gray[400]} />
      <Text style={styles.emptyStateTitle}>Aucune recette trouvée</Text>
      <Text style={styles.emptyStateSubtitle}>
        {searchQuery 
          ? "Essayez de modifier vos critères de recherche"
          : "Commencez par générer votre première recette !"
        }
      </Text>
      
      {!searchQuery && (
        <Button
          title="Générer une recette"
          onPress={handleAddRecipe}
          style={styles.emptyStateButton}
        />
      )}
      
      {searchQuery && (
        <Button
          title="Effacer les filtres"
          onPress={() => {
            setSearchQuery('');
            clearFilters();
          }}
          variant="outline"
          style={styles.emptyStateButton}
        />
      )}
    </View>
  );

  if (isLoadingRecipes) {
    return <LoadingSpinner fullScreen message="Chargement des recettes..." />;
  }

  return (
    <View style={styles.container}>
      {/* Barre de recherche */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search-outline" size={20} color={colors.gray[400]} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher une recette..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.gray[400]}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={colors.gray[400]} />
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity
          style={[styles.filterButton, showFilters && styles.filterButtonActive]}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Ionicons 
            name="options-outline" 
            size={20} 
            color={showFilters ? colors.white : colors.gray[600]} 
          />
        </TouchableOpacity>
      </View>

      {/* Compteur de résultats */}
      {recipes.length > 0 && (
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>
            {filteredRecipes.length} recette{filteredRecipes.length > 1 ? 's' : ''}
            {searchQuery && ` pour "${searchQuery}"`}
          </Text>
          
          {(searchQuery || filteredRecipes.length !== recipes.length) && (
            <TouchableOpacity onPress={() => {
              setSearchQuery('');
              clearFilters();
            }}>
              <Text style={styles.clearFilters}>Tout afficher</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Liste des recettes */}
      <FlatList
        data={filteredRecipes}
        renderItem={renderRecipeItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />

      {/* Bouton flottant d'ajout */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleAddRecipe}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={24} color={colors.white} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
    gap: 12,
  },
  
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[50],
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  
  searchInput: {
    flex: 1,
    fontSize: typography.sizes.base,
    color: colors.gray[900],
  },
  
  filterButton: {
    backgroundColor: colors.gray[100],
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  filterButtonActive: {
    backgroundColor: colors.primary[500],
  },
  
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  
  resultsCount: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
    fontWeight: '500',
  },
  
  clearFilters: {
    fontSize: typography.sizes.sm,
    color: colors.primary[600],
    fontWeight: '600',
  },
  
  listContainer: {
    padding: 20,
    paddingBottom: 100, // Espace pour le FAB
  },
  
  recipeCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: colors.gray[300],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  
  recipeImagePlaceholder: {
    height: 150,
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  recipeContent: {
    padding: 16,
  },
  
  recipeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  
  recipeTitle: {
    flex: 1,
    fontSize: typography.sizes.lg,
    fontWeight: 'bold',
    color: colors.gray[900],
    marginRight: 8,
  },
  
  recipeDescription: {
    fontSize: typography.sizes.base,
    color: colors.gray[600],
    lineHeight: 20,
    marginBottom: 12,
  },
  
  recipeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 12,
  },
  
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  
  infoText: {
    fontSize: typography.sizes.sm,
    color: colors.gray[500],
    fontWeight: '500',
  },
  
  recipeTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  
  badge: {
    marginBottom: 4,
  },
  
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  
  emptyStateTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: 'bold',
    color: colors.gray[700],
    marginTop: 16,
    marginBottom: 8,
  },
  
  emptyStateSubtitle: {
    fontSize: typography.sizes.base,
    color: colors.gray[500],
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  
  emptyStateButton: {
    paddingHorizontal: 32,
  },
  
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});
