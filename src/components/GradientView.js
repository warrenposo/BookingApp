import React from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';

// Export COLORS for convenience
export { COLORS };

const GradientView = ({ 
  children, 
  colors, 
  gradient = 'primary',
  start = { x: 0, y: 0 }, 
  end = { x: 1, y: 1 },
  style = {},
  ...props 
}) => {
  // Get gradient colors
  const gradientColors = colors || COLORS.gradients[gradient] || COLORS.gradients.primary;
  
  return (
    <LinearGradient
      colors={gradientColors}
      start={start}
      end={end}
      style={style}
      {...props}
    >
      {children}
    </LinearGradient>
  );
};

export default GradientView;

// Predefined gradient components for common use cases
export const PrimaryGradient = ({ children, style, ...props }) => (
  <GradientView gradient="primary" style={style} {...props}>
    {children}
  </GradientView>
);

export const SecondaryGradient = ({ children, style, ...props }) => (
  <GradientView gradient="secondary" style={style} {...props}>
    {children}
  </GradientView>
);

export const SuccessGradient = ({ children, style, ...props }) => (
  <GradientView gradient="success" style={style} {...props}>
    {children}
  </GradientView>
);

export const WarningGradient = ({ children, style, ...props }) => (
  <GradientView gradient="warning" style={style} {...props}>
    {children}
  </GradientView>
);

export const ErrorGradient = ({ children, style, ...props }) => (
  <GradientView gradient="error" style={style} {...props}>
    {children}
  </GradientView>
);

export const OceanGradient = ({ children, style, ...props }) => (
  <GradientView gradient="ocean" style={style} {...props}>
    {children}
  </GradientView>
);

export const SunsetGradient = ({ children, style, ...props }) => (
  <GradientView gradient="sunset" style={style} {...props}>
    {children}
  </GradientView>
);

export const ModernGradient = ({ children, style, ...props }) => (
  <GradientView gradient="modern" style={style} {...props}>
    {children}
  </GradientView>
);

export const TechGradient = ({ children, style, ...props }) => (
  <GradientView gradient="tech" style={style} {...props}>
    {children}
  </GradientView>
);
