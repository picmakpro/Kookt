import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useShoppingStore } from '../../src/stores';
import { LoadingSpinner, Button } from '../../src/components/ui';
import { colors, typography } from '../../src/constants';
import { ShoppingListItem } from '../../src/types';
import { formatQuantity, formatPrice } from '../../src/utils/formatters';

export default function ShoppingScreen() {
  const {
    currentList,
    isLoading,
    loadShoppingList,
    toggleItemChecked,
    removeItemFromList,
    clearCheckedItems,
    getTotalItems,
    getCheckedCount,
    getCompletionPercentage,
    getTotalEstimatedPrice,
    shareList,
    getItemsByCategory,
  } = useShoppingStore();

  useEffect(() => {
    loadShoppingList();
  }, [loadShoppingList]);

  const itemsByCategory = getItemsByCategory();
  const totalItems = getTotalItems();
  const checkedCount = getCheckedCount();
  const completionPercentage = getCompletionPercentage();
  const totalPrice = getTotalEstimatedPrice();

  const handleItemPress = (itemId: string) => {
    toggleItemChecked(itemId);
  };

  const handleDeleteItem = (item: ShoppingListItem) => {
    Alert.alert(
      'Supprimer l\'article',
      `Voulez-vous supprimer "${item.name}" de votre liste ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Supprimer', 
          style: 'destructive',
          onPress: () => removeItemFromList(item.id)
        },
      ]
    );
  };

  const handleClearCompleted = () => {
    if (checkedCount === 0) return;
    
    Alert.alert(
      'Vider les articles cochés',
      `Supprimer les ${checkedCount} article${checkedCount > 1 ? 's' : ''} coché${checkedCount > 1 ? 's' : ''} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Supprimer', 
          style: 'destructive',
          onPress: clearCheckedItems
        },
      ]
    );
  };

  const handleShare = () => {
    Alert.alert(
      'Partager la liste',
      'Comment souhaitez-vous partager votre liste de courses ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'WhatsApp', 
          onPress: () => shareList('whatsapp')
        },
        { 
          text: 'Texte simple', 
          onPress: () => shareList('text')
        },
      ]
    );
  };

  const renderCategorySection = ({ item: category }: { item: any }) => (
    <View style={styles.categorySection}>
      <View style={styles.categoryHeader}>
        <Text style={styles.categoryTitle}>{category.category}</Text>
        <Text style={styles.categoryCount}>
          {category.checkedCount}/{category.totalCount}
        </Text>
      </View>
      
      {category.items.map((item: ShoppingListItem) => (
        <TouchableOpacity
          key={item.id}
          style={[styles.shoppingItem, item.isChecked && styles.shoppingItemChecked]}
          onPress={() => handleItemPress(item.id)}
          activeOpacity={0.7}
        >
          <View style={styles.itemCheckbox}>
            <Ionicons
              name={item.isChecked ? 'checkmark-circle' : 'ellipse-outline'}
              size={24}
              color={item.isChecked ? colors.primary[500] : colors.gray[300]}
            />
          </View>
          
          <View style={styles.itemContent}>
            <Text style={[
              styles.itemName,
              item.isChecked && styles.itemNameChecked
            ]}>
              {item.name}
            </Text>
            
            <Text style={[
              styles.itemQuantity,
              item.isChecked && styles.itemQuantityChecked
            ]}>
              {formatQuantity(item.quantity, item.unit)}
            </Text>
            
            {item.estimatedPrice && (
              <Text style={[
                styles.itemPrice,
                item.isChecked && styles.itemPriceChecked
              ]}>
                {formatPrice(item.estimatedPrice)}
              </Text>
            )}
            
            {item.notes && (
              <Text style={[
                styles.itemNotes,
                item.isChecked && styles.itemNotesChecked
              ]}>
                {item.notes}
              </Text>
            )}
          </View>
          
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteItem(item)}
          >
            <Ionicons name="close" size={20} color={colors.gray[400]} />
          </TouchableOpacity>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="bag-outline" size={64} color={colors.gray[400]} />
      <Text style={styles.emptyStateTitle}>Liste de courses vide</Text>
      <Text style={styles.emptyStateSubtitle}>
        Ajoutez des articles depuis vos recettes ou créez une nouvelle liste
      </Text>
    </View>
  );

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Chargement de votre liste..." />;
  }

  return (
    <View style={styles.container}>
      {/* En-tête avec statistiques */}
      {totalItems > 0 && (
        <View style={styles.statsHeader}>
          <View style={styles.progressContainer}>
            <View style={styles.progressInfo}>
              <Text style={styles.progressText}>
                {checkedCount} / {totalItems} articles
              </Text>
              <Text style={styles.progressPercentage}>
                {completionPercentage}%
              </Text>
            </View>
            
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${completionPercentage}%` }
                ]} 
              />
            </View>
          </View>
          
          {totalPrice > 0 && (
            <View style={styles.totalPrice}>
              <Text style={styles.totalPriceLabel}>Total estimé</Text>
              <Text style={styles.totalPriceAmount}>
                {formatPrice(totalPrice)}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Actions rapides */}
      {totalItems > 0 && (
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.actionButton, checkedCount === 0 && styles.actionButtonDisabled]}
            onPress={handleClearCompleted}
            disabled={checkedCount === 0}
          >
            <Ionicons 
              name="trash-outline" 
              size={20} 
              color={checkedCount > 0 ? colors.accent.red[500] : colors.gray[400]} 
            />
            <Text style={[
              styles.actionButtonText,
              checkedCount === 0 && styles.actionButtonTextDisabled
            ]}>
              Vider cochés
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleShare}
          >
            <Ionicons name="share-outline" size={20} color={colors.primary[500]} />
            <Text style={styles.actionButtonText}>Partager</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Liste des articles par catégorie */}
      {itemsByCategory.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={itemsByCategory}
          renderItem={renderCategorySection}
          keyExtractor={(item) => item.category}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  
  statsHeader: {
    backgroundColor: colors.white,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  
  progressContainer: {
    marginBottom: 16,
  },
  
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  
  progressText: {
    fontSize: typography.sizes.base,
    fontWeight: '600',
    color: colors.gray[700],
  },
  
  progressPercentage: {
    fontSize: typography.sizes.base,
    fontWeight: 'bold',
    color: colors.primary[600],
  },
  
  progressBar: {
    height: 8,
    backgroundColor: colors.gray[200],
    borderRadius: 4,
    overflow: 'hidden',
  },
  
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary[500],
    borderRadius: 4,
  },
  
  totalPrice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
  },
  
  totalPriceLabel: {
    fontSize: typography.sizes.base,
    color: colors.gray[600],
  },
  
  totalPriceAmount: {
    fontSize: typography.sizes.lg,
    fontWeight: 'bold',
    color: colors.gray[900],
  },
  
  quickActions: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
    gap: 12,
  },
  
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: colors.gray[50],
    gap: 8,
  },
  
  actionButtonDisabled: {
    opacity: 0.5,
  },
  
  actionButtonText: {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
    color: colors.gray[700],
  },
  
  actionButtonTextDisabled: {
    color: colors.gray[400],
  },
  
  listContainer: {
    padding: 20,
  },
  
  categorySection: {
    marginBottom: 24,
  },
  
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  
  categoryTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: 'bold',
    color: colors.gray[800],
  },
  
  categoryCount: {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
    color: colors.primary[600],
    backgroundColor: colors.primary[50],
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  
  shoppingItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: colors.gray[300],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  
  shoppingItemChecked: {
    backgroundColor: colors.gray[50],
    opacity: 0.7,
  },
  
  itemCheckbox: {
    marginRight: 12,
    marginTop: 2,
  },
  
  itemContent: {
    flex: 1,
  },
  
  itemName: {
    fontSize: typography.sizes.base,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: 2,
  },
  
  itemNameChecked: {
    textDecorationLine: 'line-through',
    color: colors.gray[500],
  },
  
  itemQuantity: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
    marginBottom: 2,
  },
  
  itemQuantityChecked: {
    color: colors.gray[400],
  },
  
  itemPrice: {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
    color: colors.primary[600],
    marginBottom: 2,
  },
  
  itemPriceChecked: {
    color: colors.gray[400],
  },
  
  itemNotes: {
    fontSize: typography.sizes.xs,
    color: colors.gray[500],
    fontStyle: 'italic',
  },
  
  itemNotesChecked: {
    color: colors.gray[400],
  },
  
  deleteButton: {
    padding: 4,
    marginTop: 2,
  },
  
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
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
    lineHeight: 22,
  },
});
