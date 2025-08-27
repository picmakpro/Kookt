import React from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { colors, typography } from '../../constants';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  message?: string;
  fullScreen?: boolean;
  style?: ViewStyle;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  color = colors.primary[500],
  message,
  fullScreen = false,
  style,
}) => {
  const containerStyle = [
    styles.container,
    fullScreen && styles.fullScreen,
    style,
  ];

  return (
    <View style={containerStyle}>
      <ActivityIndicator 
        size={size} 
        color={color}
        style={styles.spinner}
      />
      {message && (
        <Text style={styles.message}>{message}</Text>
      )}
    </View>
  );
};

// Composant spécialisé pour la génération IA
export const AILoadingSpinner: React.FC<{ message?: string }> = ({ 
  message = "Génération de votre recette..." 
}) => {
  return (
    <View style={styles.aiContainer}>
      <View style={styles.aiSpinnerContainer}>
        <ActivityIndicator 
          size="large" 
          color={colors.primary[500]}
        />
        <View style={styles.aiPulse} />
      </View>
      
      <Text style={styles.aiTitle}>🤖 Kookt IA</Text>
      <Text style={styles.aiMessage}>{message}</Text>
      
      <View style={styles.dots}>
        <View style={[styles.dot, styles.dotAnimation1]} />
        <View style={[styles.dot, styles.dotAnimation2]} />
        <View style={[styles.dot, styles.dotAnimation3]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  
  fullScreen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  
  spinner: {
    marginBottom: 12,
  },
  
  message: {
    fontSize: typography.sizes.base,
    color: colors.gray[600],
    textAlign: 'center',
    marginTop: 8,
  },
  
  // Styles pour l'IA
  aiContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    padding: 32,
  },
  
  aiSpinnerContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  
  aiPulse: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: colors.primary[200],
    opacity: 0.5,
  },
  
  aiTitle: {
    fontSize: typography.sizes['2xl'],
    fontWeight: 'bold',
    color: colors.primary[600],
    marginBottom: 8,
  },
  
  aiMessage: {
    fontSize: typography.sizes.lg,
    color: colors.gray[600],
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary[400],
  },
  
  dotAnimation1: {
    // Animation sera gérée par React Native Reanimated si nécessaire
  },
  
  dotAnimation2: {
    // Animation avec délai
  },
  
  dotAnimation3: {
    // Animation avec délai plus long
  },
});
