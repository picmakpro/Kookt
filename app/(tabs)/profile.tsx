import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUserStore } from '../../src/stores';
import { Button } from '../../src/components/ui';
import { colors, typography } from '../../src/constants';
import { 
  cookingSkillLabels, 
  budgetLabels, 
  cookingTimeLabels,
  kitchenEquipmentLabels 
} from '../../src/types/user';

export default function ProfileScreen() {
  const { profile, clearProfile } = useUserStore();

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ? Vos données locales seront supprimées.',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Déconnecter', 
          style: 'destructive',
          onPress: clearProfile
        },
      ]
    );
  };

  if (!profile) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Ionicons name="person-outline" size={64} color={colors.gray[400]} />
          <Text style={styles.emptyStateTitle}>Profil non configuré</Text>
          <Text style={styles.emptyStateSubtitle}>
            Redémarrez l'application pour configurer votre profil
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* En-tête du profil */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person" size={32} color={colors.primary[600]} />
        </View>
        
        <Text style={styles.userName}>
          {profile.name || 'Chef Kookt'}
        </Text>
        
        {profile.email && (
          <Text style={styles.userEmail}>{profile.email}</Text>
        )}
      </View>

      {/* Statistiques */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Statistiques</Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="restaurant" size={24} color={colors.primary[500]} />
            <Text style={styles.statNumber}>{profile.stats.recipesGenerated}</Text>
            <Text style={styles.statLabel}>Recettes générées</Text>
          </View>
          
          <View style={styles.statCard}>
            <Ionicons name="heart" size={24} color={colors.accent.red[500]} />
            <Text style={styles.statNumber}>{profile.stats.recipesCooked}</Text>
            <Text style={styles.statLabel}>Recettes cuisinées</Text>
          </View>
          
          <View style={styles.statCard}>
            <Ionicons name="time" size={24} color={colors.accent.blue[500]} />
            <Text style={styles.statNumber}>
              {Math.round(profile.stats.totalCookingTime / 60)}h
            </Text>
            <Text style={styles.statLabel}>Temps de cuisine</Text>
          </View>
          
          <View style={styles.statCard}>
            <Ionicons name="star" size={24} color={colors.accent.yellow[500]} />
            <Text style={styles.statNumber}>{profile.stats.favoriteRecipes}</Text>
            <Text style={styles.statLabel}>Favoris</Text>
          </View>
        </View>
      </View>

      {/* Préférences alimentaires */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Préférences alimentaires</Text>
        
        <View style={styles.preferenceCard}>
          <View style={styles.preferenceItem}>
            <Text style={styles.preferenceLabel}>Niveau de cuisine</Text>
            <Text style={styles.preferenceValue}>
              {cookingSkillLabels[profile.preferences.cookingSkillLevel]}
            </Text>
          </View>
          
          <View style={styles.preferenceItem}>
            <Text style={styles.preferenceLabel}>Temps disponible</Text>
            <Text style={styles.preferenceValue}>
              {cookingTimeLabels[profile.preferences.availableCookingTime]}
            </Text>
          </View>
          
          <View style={styles.preferenceItem}>
            <Text style={styles.preferenceLabel}>Budget</Text>
            <Text style={styles.preferenceValue}>
              {budgetLabels[profile.preferences.budgetPreference]}
            </Text>
          </View>
          
          <View style={styles.preferenceItem}>
            <Text style={styles.preferenceLabel}>Portions préférées</Text>
            <Text style={styles.preferenceValue}>
              {profile.preferences.preferredServings} personne{profile.preferences.preferredServings > 1 ? 's' : ''}
            </Text>
          </View>
        </View>
      </View>

      {/* Régimes alimentaires */}
      {profile.preferences.dietaryRestrictions.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Régimes alimentaires</Text>
          
          <View style={styles.tagsContainer}>
            {profile.preferences.dietaryRestrictions.map((restriction) => (
              <View key={restriction} style={styles.tag}>
                <Text style={styles.tagText}>{restriction}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Allergies */}
      {profile.preferences.allergens.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Allergies</Text>
          
          <View style={styles.tagsContainer}>
            {profile.preferences.allergens.map((allergen) => (
              <View key={allergen} style={[styles.tag, styles.allergenTag]}>
                <Text style={[styles.tagText, styles.allergenTagText]}>
                  {allergen}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Équipement de cuisine */}
      {profile.preferences.kitchenEquipment.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Équipement disponible</Text>
          
          <View style={styles.tagsContainer}>
            {profile.preferences.kitchenEquipment.map((equipment) => (
              <View key={equipment} style={styles.tag}>
                <Text style={styles.tagText}>
                  {kitchenEquipmentLabels[equipment] || equipment}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Actions */}
      <View style={styles.actionsSection}>
        <TouchableOpacity style={styles.actionItem}>
          <Ionicons name="settings-outline" size={24} color={colors.gray[600]} />
          <Text style={styles.actionText}>Modifier les préférences</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionItem}>
          <Ionicons name="download-outline" size={24} color={colors.gray[600]} />
          <Text style={styles.actionText}>Exporter mes données</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionItem}>
          <Ionicons name="help-circle-outline" size={24} color={colors.gray[600]} />
          <Text style={styles.actionText}>Aide et support</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionItem}>
          <Ionicons name="information-circle-outline" size={24} color={colors.gray[600]} />
          <Text style={styles.actionText}>À propos de Kookt</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />
        </TouchableOpacity>
      </View>

      {/* Bouton de déconnexion */}
      <View style={styles.logoutSection}>
        <Button
          title="Se déconnecter"
          onPress={handleLogout}
          variant="outline"
          style={styles.logoutButton}
          textStyle={styles.logoutButtonText}
        />
      </View>

      {/* Informations de version */}
      <View style={styles.versionInfo}>
        <Text style={styles.versionText}>
          Kookt v1.0.0 - Cuisine IA
        </Text>
        <Text style={styles.versionSubtext}>
          Créé avec 💚 pour les passionnés de cuisine
        </Text>
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
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingVertical: 32,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  
  userName: {
    fontSize: typography.sizes['2xl'],
    fontWeight: 'bold',
    color: colors.gray[900],
    marginBottom: 4,
  },
  
  userEmail: {
    fontSize: typography.sizes.base,
    color: colors.gray[600],
  },
  
  statsSection: {
    backgroundColor: colors.white,
    padding: 20,
    marginTop: 16,
  },
  
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: 'bold',
    color: colors.gray[900],
    marginBottom: 16,
  },
  
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.gray[50],
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  
  statNumber: {
    fontSize: typography.sizes['2xl'],
    fontWeight: 'bold',
    color: colors.gray[900],
    marginTop: 8,
    marginBottom: 4,
  },
  
  statLabel: {
    fontSize: typography.sizes.sm,
    color: colors.gray[600],
    textAlign: 'center',
  },
  
  section: {
    backgroundColor: colors.white,
    padding: 20,
    marginTop: 16,
  },
  
  preferenceCard: {
    backgroundColor: colors.gray[50],
    borderRadius: 12,
    padding: 16,
  },
  
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  
  preferenceLabel: {
    fontSize: typography.sizes.base,
    color: colors.gray[700],
  },
  
  preferenceValue: {
    fontSize: typography.sizes.base,
    fontWeight: '600',
    color: colors.gray[900],
  },
  
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  
  tag: {
    backgroundColor: colors.primary[100],
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  
  allergenTag: {
    backgroundColor: colors.accent.red[100],
  },
  
  tagText: {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
    color: colors.primary[700],
  },
  
  allergenTagText: {
    color: colors.accent.red[700],
  },
  
  actionsSection: {
    backgroundColor: colors.white,
    marginTop: 16,
  },
  
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  
  actionText: {
    flex: 1,
    fontSize: typography.sizes.base,
    color: colors.gray[700],
    marginLeft: 16,
  },
  
  logoutSection: {
    padding: 20,
    marginTop: 16,
  },
  
  logoutButton: {
    borderColor: colors.accent.red[500],
  },
  
  logoutButtonText: {
    color: colors.accent.red[500],
  },
  
  versionInfo: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  
  versionText: {
    fontSize: typography.sizes.sm,
    color: colors.gray[500],
    marginBottom: 4,
  },
  
  versionSubtext: {
    fontSize: typography.sizes.xs,
    color: colors.gray[400],
    textAlign: 'center',
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
  },
});
