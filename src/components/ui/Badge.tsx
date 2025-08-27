import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, typography } from '../../constants';

interface BadgeProps {
  text: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'ai';
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  text,
  variant = 'primary',
  size = 'md',
  style,
  textStyle,
  icon,
}) => {
  const badgeStyle = [
    styles.base,
    styles[variant],
    styles[`${size}Size`],
    style,
  ];

  const textStyleCombined = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    textStyle,
  ];

  return (
    <View style={badgeStyle}>
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text style={textStyleCombined}>{text}</Text>
    </View>
  );
};

// Badge spécialisé pour l'IA
export const AIBadge: React.FC<{ style?: ViewStyle }> = ({ style }) => {
  return (
    <Badge
      text="Généré par IA"
      variant="ai"
      size="sm"
      icon={<Text style={styles.aiIcon}>🤖</Text>}
      style={style}
    />
  );
};

// Badge pour les difficultés
export const DifficultyBadge: React.FC<{ 
  difficulty: 'facile' | 'moyen' | 'difficile';
  style?: ViewStyle;
}> = ({ difficulty, style }) => {
  const variantMap = {
    'facile': 'success' as const,
    'moyen': 'warning' as const,
    'difficile': 'error' as const,
  };

  const iconMap = {
    'facile': '🟢',
    'moyen': '🟡',
    'difficile': '🔴',
  };

  const textMap = {
    'facile': 'Facile',
    'moyen': 'Moyen',
    'difficile': 'Difficile',
  };

  return (
    <Badge
      text={textMap[difficulty]}
      variant={variantMap[difficulty]}
      size="sm"
      icon={<Text style={styles.difficultyIcon}>{iconMap[difficulty]}</Text>}
      style={style}
    />
  );
};

// Badge pour les régimes alimentaires
export const DietaryBadge: React.FC<{ 
  dietary: string;
  style?: ViewStyle;
}> = ({ dietary, style }) => {
  const iconMap: Record<string, string> = {
    'vegetarien': '🥬',
    'vegan': '🌱',
    'sans-gluten': '🌾',
    'sans-lactose': '🥛',
    'halal': '☪️',
    'casher': '✡️',
    'paleo': '🦴',
    'keto': '🥑',
    'low-carb': '📉',
    'high-protein': '💪',
  };

  return (
    <Badge
      text={dietary}
      variant="secondary"
      size="sm"
      icon={iconMap[dietary] ? <Text style={styles.dietaryIcon}>{iconMap[dietary]}</Text> : undefined}
      style={style}
    />
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  
  // Variants
  primary: {
    backgroundColor: colors.primary[100],
    borderWidth: 1,
    borderColor: colors.primary[200],
  },
  
  secondary: {
    backgroundColor: colors.secondary[100],
    borderWidth: 1,
    borderColor: colors.secondary[200],
  },
  
  success: {
    backgroundColor: colors.primary[50],
    borderWidth: 1,
    borderColor: colors.primary[200],
  },
  
  warning: {
    backgroundColor: colors.accent.yellow[50],
    borderWidth: 1,
    borderColor: colors.accent.yellow[200],
  },
  
  error: {
    backgroundColor: colors.accent.red[50],
    borderWidth: 1,
    borderColor: colors.accent.red[200],
  },
  
  ai: {
    backgroundColor: colors.primary[50],
    borderWidth: 1,
    borderColor: colors.primary[300],
  },
  
  // Sizes
  smSize: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  
  mdSize: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  
  lgSize: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  
  // Text base
  text: {
    fontWeight: '600',
  },
  
  // Text variants
  primaryText: {
    color: colors.primary[700],
  },
  
  secondaryText: {
    color: colors.secondary[700],
  },
  
  successText: {
    color: colors.primary[700],
  },
  
  warningText: {
    color: colors.accent.yellow[700],
  },
  
  errorText: {
    color: colors.accent.red[700],
  },
  
  aiText: {
    color: colors.primary[700],
  },
  
  // Text sizes
  smText: {
    fontSize: typography.sizes.xs,
  },
  
  mdText: {
    fontSize: typography.sizes.sm,
  },
  
  lgText: {
    fontSize: typography.sizes.base,
  },
  
  // Icons
  icon: {
    marginRight: 4,
  },
  
  aiIcon: {
    fontSize: 10,
  },
  
  difficultyIcon: {
    fontSize: 8,
  },
  
  dietaryIcon: {
    fontSize: 10,
  },
});
