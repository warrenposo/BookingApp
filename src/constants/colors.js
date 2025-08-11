export const COLORS = {
  // Primary Colors
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  
  // Text Colors
  text: '#1C1C1E',
  textSecondary: '#8E8E93',
  
  // Background Colors
  background: '#F2F2F7',
  white: '#FFFFFF',
  
  // Gray Scale
  gray: '#C7C7CC',
  lightGray: '#E5E5EA',
  darkGray: '#48484A',
  
  // Additional Colors for Gradients
  primaryLight: '#4DA6FF',
  primaryDark: '#0056CC',
  secondaryLight: '#7B79E6',
  secondaryDark: '#3D3BC4',
  successLight: '#5CDB7A',
  successDark: '#28A745',
  warningLight: '#FFB84D',
  warningDark: '#E6850E',
  errorLight: '#FF6B6B',
  errorDark: '#CC2E2E',
  
  // Gradient Combinations
  gradients: {
    primary: ['#007AFF', '#5856D6'],
    secondary: ['#5856D6', '#7B79E6'],
    success: ['#34C759', '#5CDB7A'],
    warning: ['#FF9500', '#FFB84D'],
    error: ['#FF3B30', '#FF6B6B'],
    sunset: ['#FF6B6B', '#FFB84D'],
    ocean: ['#007AFF', '#34C759'],
    purple: ['#5856D6', '#FF6B6B'],
    modern: ['#667eea', '#764ba2'],
    warm: ['#f093fb', '#f5576c'],
    cool: ['#4facfe', '#00f2fe'],
    dark: ['#2c3e50', '#34495e'],
    light: ['#a8edea', '#fed6e3'],
    business: ['#667eea', '#764ba2'],
    creative: ['#f093fb', '#f5576c'],
    tech: ['#4facfe', '#00f2fe'],
    nature: ['#a8edea', '#fed6e3'],
    sunset: ['#ffecd2', '#fcb69f'],
    midnight: ['#2c3e50', '#34495e'],
    dawn: ['#ffecd2', '#fcb69f'],
  },
  
  // Shadow Colors
  shadow: {
    light: 'rgba(0, 0, 0, 0.1)',
    medium: 'rgba(0, 0, 0, 0.15)',
    dark: 'rgba(0, 0, 0, 0.25)',
    primary: 'rgba(0, 122, 255, 0.2)',
    secondary: 'rgba(88, 86, 214, 0.2)',
    success: 'rgba(52, 199, 89, 0.2)',
    warning: 'rgba(255, 149, 0, 0.2)',
    error: 'rgba(255, 59, 48, 0.2)',
  },
  
  // Overlay Colors
  overlay: {
    light: 'rgba(255, 255, 255, 0.9)',
    dark: 'rgba(0, 0, 0, 0.7)',
    primary: 'rgba(0, 122, 255, 0.1)',
    secondary: 'rgba(88, 86, 214, 0.1)',
  },
  
  // Status Colors
  status: {
    online: '#34C759',
    offline: '#8E8E93',
    busy: '#FF9500',
    away: '#FFB84D',
  }
};

// Helper function to get random gradient
export const getRandomGradient = () => {
  const gradientKeys = Object.keys(COLORS.gradients);
  const randomKey = gradientKeys[Math.floor(Math.random() * gradientKeys.length)];
  return COLORS.gradients[randomKey];
};

// Helper function to get gradient by name
export const getGradient = (name) => {
  return COLORS.gradients[name] || COLORS.gradients.primary;
};
