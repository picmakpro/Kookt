import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, typography } from '../../constants';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  icon,
}) => {
  const buttonStyle = [
    styles.base,
    styles[variant],
    styles[`${size}Size`],
    fullWidth && styles.fullWidth,
    (disabled || loading) && styles.disabled,
    style,
  ];

  const textStyleCombined = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    (disabled || loading) && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? colors.white : colors.primary[500]}
        />
      ) : (
        <>
          {icon}
          <Text style={textStyleCombined}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  
  // Variants
  primary: {
    backgroundColor: colors.primary[500],
    shadowColor: colors.primary[500],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  
  secondary: {
    backgroundColor: colors.secondary[100],
    borderWidth: 1,
    borderColor: colors.secondary[200],
  },
  
  outline: {
    backgroundColor: colors.transparent,
    borderWidth: 2,
    borderColor: colors.primary[500],
  },
  
  ghost: {
    backgroundColor: colors.transparent,
  },
  
  // Sizes
  smSize: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  
  mdSize: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  
  lgSize: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
  },
  
  // Text base
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  
  // Text variants
  primaryText: {
    color: colors.white,
  },
  
  secondaryText: {
    color: colors.secondary[700],
  },
  
  outlineText: {
    color: colors.primary[500],
  },
  
  ghostText: {
    color: colors.primary[500],
  },
  
  // Text sizes
  smText: {
    fontSize: typography.sizes.sm,
  },
  
  mdText: {
    fontSize: typography.sizes.base,
  },
  
  lgText: {
    fontSize: typography.sizes.lg,
  },
  
  // States
  disabled: {
    backgroundColor: colors.gray[200],
    borderColor: colors.gray[200],
    opacity: 0.6,
  },
  
  disabledText: {
    color: colors.gray[400],
  },
  
  fullWidth: {
    width: '100%',
  },
});
