import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, PrimaryGradient, SuccessGradient, WarningGradient, ErrorGradient, OceanGradient, SunsetGradient, ModernGradient } from './GradientView';

const GradientButton = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
  children,
  ...props
}) => {
  const getGradientComponent = () => {
    switch (variant) {
      case 'success':
        return SuccessGradient;
      case 'warning':
        return WarningGradient;
      case 'error':
        return ErrorGradient;
      case 'ocean':
        return OceanGradient;
      case 'sunset':
        return SunsetGradient;
      case 'modern':
        return ModernGradient;
      default:
        return PrimaryGradient;
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: 8,
          paddingHorizontal: 16,
          borderRadius: 8,
        };
      case 'large':
        return {
          paddingVertical: 18,
          paddingHorizontal: 32,
          borderRadius: 20,
        };
      default:
        return {
          paddingVertical: 14,
          paddingHorizontal: 24,
          borderRadius: 16,
        };
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small':
        return 14;
      case 'large':
        return 18;
      default:
        return 16;
    }
  };

  const GradientComponent = getGradientComponent();
  const sizeStyles = getSizeStyles();
  const textSize = getTextSize();

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="white" size="small" />
          <Text style={[styles.text, { marginLeft: 8, fontSize: textSize }, textStyle]}>
            Loading...
          </Text>
        </View>
      );
    }

    if (children) {
      return children;
    }

    const iconElement = icon && (
      <Ionicons 
        name={icon} 
        size={textSize + 2} 
        color="white" 
        style={iconPosition === 'left' ? { marginRight: 8 } : { marginLeft: 8 }}
      />
    );

    return (
      <>
        {iconPosition === 'left' && iconElement}
        <Text style={[styles.text, { fontSize: textSize }, textStyle]}>
          {title}
        </Text>
        {iconPosition === 'right' && iconElement}
      </>
    );
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        sizeStyles,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      <GradientComponent style={[styles.gradient, sizeStyles]}>
        {renderContent()}
      </GradientComponent>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    shadowColor: COLORS.shadow.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  gradient: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default GradientButton;

// Predefined button variants for common use cases
export const PrimaryButton = (props) => (
  <GradientButton variant="primary" {...props} />
);

export const SuccessButton = (props) => (
  <GradientButton variant="success" {...props} />
);

export const WarningButton = (props) => (
  <GradientButton variant="warning" {...props} />
);

export const ErrorButton = (props) => (
  <GradientButton variant="error" {...props} />
);

export const OceanButton = (props) => (
  <GradientButton variant="ocean" {...props} />
);

export const SunsetButton = (props) => (
  <GradientButton variant="sunset" {...props} />
);

export const ModernButton = (props) => (
  <GradientButton variant="modern" {...props} />
);

// Size variants
export const SmallButton = (props) => (
  <GradientButton size="small" {...props} />
);

export const LargeButton = (props) => (
  <GradientButton size="large" {...props} />
);

// Icon variants
export const IconButton = ({ icon, ...props }) => (
  <GradientButton icon={icon} {...props} />
);

export const IconRightButton = ({ icon, ...props }) => (
  <GradientButton icon={icon} iconPosition="right" {...props} />
);
