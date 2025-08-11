import React from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, PrimaryGradient, ModernGradient, OceanGradient } from './GradientView';

const GradientInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  style,
  inputStyle,
  labelStyle,
  ...props
}) => {
  const getGradientComponent = () => {
    switch (variant) {
      case 'modern':
        return ModernGradient;
      case 'ocean':
        return OceanGradient;
      default:
        return PrimaryGradient;
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: 8,
          paddingHorizontal: 12,
          fontSize: 14,
          minHeight: 40,
        };
      case 'large':
        return {
          paddingVertical: 16,
          paddingHorizontal: 20,
          fontSize: 18,
          minHeight: 56,
        };
      default:
        return {
          paddingVertical: 12,
          paddingHorizontal: 16,
          fontSize: 16,
          minHeight: 48,
        };
    }
  };

  const GradientComponent = getGradientComponent();
  const sizeStyles = getSizeStyles();

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, labelStyle]}>
          {label}
        </Text>
      )}
      
      <View style={styles.inputContainer}>
        <GradientComponent style={[styles.gradientBorder, { borderRadius: sizeStyles.minHeight / 2 }]}>
          <View style={[styles.inputWrapper, { borderRadius: (sizeStyles.minHeight / 2) - 2 }]}>
            {leftIcon && (
              <View style={styles.leftIcon}>
                {leftIcon}
              </View>
            )}
            
            <TextInput
              style={[
                styles.input,
                sizeStyles,
                leftIcon && styles.inputWithLeftIcon,
                rightIcon && styles.inputWithRightIcon,
                inputStyle,
              ]}
              placeholder={placeholder}
              placeholderTextColor={COLORS.textSecondary}
              value={value}
              onChangeText={onChangeText}
              secureTextEntry={secureTextEntry}
              keyboardType={keyboardType}
              multiline={multiline}
              numberOfLines={numberOfLines}
              editable={!disabled}
              {...props}
            />
            
            {rightIcon && (
              <TouchableOpacity
                style={styles.rightIcon}
                onPress={onRightIconPress}
                disabled={!onRightIconPress}
              >
                {rightIcon}
              </TouchableOpacity>
            )}
          </View>
        </GradientComponent>
      </View>
      
      {error && (
        <Text style={styles.errorText}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  inputContainer: {
    shadowColor: COLORS.shadow.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  gradientBorder: {
    padding: 2,
  },
  inputWrapper: {
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftIcon: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  rightIcon: {
    paddingRight: 16,
    paddingLeft: 8,
  },
  input: {
    flex: 1,
    color: COLORS.text,
    backgroundColor: 'transparent',
    textAlignVertical: 'top',
  },
  inputWithLeftIcon: {
    paddingLeft: 8,
  },
  inputWithRightIcon: {
    paddingRight: 8,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.error,
    marginTop: 4,
    marginLeft: 4,
  },
});

export default GradientInput;

// Predefined input variants for common use cases
export const PrimaryInput = (props) => (
  <GradientInput variant="primary" {...props} />
);

export const ModernInput = (props) => (
  <GradientInput variant="modern" {...props} />
);

export const OceanInput = (props) => (
  <GradientInput variant="ocean" {...props} />
);

// Size variants
export const SmallInput = (props) => (
  <GradientInput size="small" {...props} />
);

export const LargeInput = (props) => (
  <GradientInput size="large" {...props} />
);

// Specialized input types
export const EmailInput = (props) => (
  <GradientInput
    keyboardType="email-address"
    leftIcon={<Ionicons name="mail" size={20} color={COLORS.textSecondary} />}
    placeholder="Enter your email"
    {...props}
  />
);

export const PasswordInput = ({ showPassword, onTogglePassword, ...props }) => (
  <GradientInput
    secureTextEntry={!showPassword}
    leftIcon={<Ionicons name="lock-closed" size={20} color={COLORS.textSecondary} />}
    rightIcon={
      <TouchableOpacity onPress={onTogglePassword}>
        <Ionicons 
          name={showPassword ? "eye-off" : "eye"} 
          size={20} 
          color={COLORS.textSecondary} 
        />
      </TouchableOpacity>
    }
    placeholder="Enter your password"
    {...props}
  />
);

export const PhoneInput = (props) => (
  <GradientInput
    keyboardType="phone-pad"
    leftIcon={<Ionicons name="call" size={20} color={COLORS.textSecondary} />}
    placeholder="Enter phone number"
    {...props}
  />
);

export const SearchInput = ({ onSearch, ...props }) => (
  <GradientInput
    leftIcon={<Ionicons name="search" size={20} color={COLORS.textSecondary} />}
    rightIcon={
      onSearch && (
        <TouchableOpacity onPress={onSearch}>
          <Ionicons name="arrow-forward" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      )
    }
    placeholder="Search..."
    returnKeyType="search"
    {...props}
  />
);
