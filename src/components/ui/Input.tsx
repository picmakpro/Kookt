import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from 'react-native';
import { colors, typography } from '../../constants';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'filled' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  variant = 'outline',
  size = 'md',
  containerStyle,
  inputStyle,
  labelStyle,
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const containerStyles = [
    styles.container,
    containerStyle,
  ];

  const inputContainerStyles = [
    styles.inputContainer,
    styles[variant],
    styles[`${size}Size`],
    isFocused && styles.focused,
    error && styles.error,
  ];

  const textStyles = [
    styles.input,
    styles[`${size}Text`],
    inputStyle,
  ];

  const labelStyles = [
    styles.label,
    styles[`${size}Label`],
    labelStyle,
  ];

  return (
    <View style={containerStyles}>
      {label && (
        <Text style={labelStyles}>{label}</Text>
      )}
      
      <View style={inputContainerStyles}>
        {leftIcon && (
          <View style={styles.iconContainer}>
            {leftIcon}
          </View>
        )}
        
        <TextInput
          style={textStyles}
          placeholderTextColor={colors.gray[400]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...textInputProps}
        />
        
        {rightIcon && (
          <View style={styles.iconContainer}>
            {rightIcon}
          </View>
        )}
      </View>
      
      {(error || hint) && (
        <Text style={[styles.helpText, error && styles.errorText]}>
          {error || hint}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  
  label: {
    marginBottom: 6,
    fontWeight: '600',
    color: colors.gray[700],
  },
  
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  
  // Variants
  default: {
    backgroundColor: colors.gray[50],
    borderColor: colors.gray[200],
  },
  
  filled: {
    backgroundColor: colors.gray[100],
    borderColor: colors.transparent,
  },
  
  outline: {
    backgroundColor: colors.white,
    borderColor: colors.gray[300],
  },
  
  // States
  focused: {
    borderColor: colors.primary[500],
    borderWidth: 2,
    shadowColor: colors.primary[500],
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  error: {
    borderColor: colors.accent.red[500],
    borderWidth: 2,
  },
  
  // Sizes
  smSize: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  
  mdSize: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  
  lgSize: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
  },
  
  input: {
    flex: 1,
    color: colors.gray[900],
    paddingVertical: 0, // Remove default padding on Android
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
  
  // Label sizes
  smLabel: {
    fontSize: typography.sizes.xs,
  },
  
  mdLabel: {
    fontSize: typography.sizes.sm,
  },
  
  lgLabel: {
    fontSize: typography.sizes.base,
  },
  
  iconContainer: {
    marginHorizontal: 4,
  },
  
  helpText: {
    marginTop: 4,
    fontSize: typography.sizes.xs,
    color: colors.gray[500],
  },
  
  errorText: {
    color: colors.accent.red[500],
  },
});
