import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, PrimaryGradient, OceanGradient, SunsetGradient, ModernGradient, TechGradient } from './GradientView';

const GradientHeader = ({
  title,
  subtitle,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
  variant = 'primary',
  height = 120,
  showStatusBar = true,
  statusBarStyle = 'light-content',
  style,
  titleStyle,
  subtitleStyle,
  leftIconStyle,
  rightIconStyle,
  children,
  ...props
}) => {
  const getGradientComponent = () => {
    switch (variant) {
      case 'ocean':
        return OceanGradient;
      case 'sunset':
        return SunsetGradient;
      case 'modern':
        return ModernGradient;
      case 'tech':
        return TechGradient;
      default:
        return PrimaryGradient;
    }
  };

  const GradientComponent = getGradientComponent();

  return (
    <View style={[styles.container, { height }, style]} {...props}>
      {showStatusBar && (
        <StatusBar
          barStyle={statusBarStyle}
          backgroundColor="transparent"
          translucent
        />
      )}
      
      <GradientComponent style={[styles.gradient, { height }]}>
        <View style={styles.content}>
          {/* Left Icon */}
          {leftIcon && (
            <TouchableOpacity
              style={[styles.iconButton, styles.leftIcon, leftIconStyle]}
              onPress={onLeftPress}
              disabled={!onLeftPress}
            >
              {leftIcon}
            </TouchableOpacity>
          )}
          
          {/* Center Content */}
          <View style={styles.centerContent}>
            {title && (
              <Text style={[styles.title, titleStyle]}>
                {title}
              </Text>
            )}
            {subtitle && (
              <Text style={[styles.subtitle, subtitleStyle]}>
                {subtitle}
              </Text>
            )}
            {children}
          </View>
          
          {/* Right Icon */}
          {rightIcon && (
            <TouchableOpacity
              style={[styles.iconButton, styles.rightIcon, rightIconStyle]}
              onPress={onRightPress}
              disabled={!onRightPress}
            >
              {rightIcon}
            </TouchableOpacity>
          )}
        </View>
      </GradientComponent>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1000,
  },
  gradient: {
    width: '100%',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.shadow.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  leftIcon: {
    marginRight: 'auto',
  },
  rightIcon: {
    marginLeft: 'auto',
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default GradientHeader;

// Predefined header variants for common use cases
export const PrimaryHeader = (props) => (
  <GradientHeader variant="primary" {...props} />
);

export const OceanHeader = (props) => (
  <GradientHeader variant="ocean" {...props} />
);

export const SunsetHeader = (props) => (
  <GradientHeader variant="sunset" {...props} />
);

export const ModernHeader = (props) => (
  <GradientHeader variant="modern" {...props} />
);

export const TechHeader = (props) => (
  <GradientHeader variant="tech" {...props} />
);

// Size variants
export const SmallHeader = (props) => (
  <GradientHeader height={80} {...props} />
);

export const LargeHeader = (props) => (
  <GradientHeader height={160} {...props} />
);

// Common header patterns
export const BackHeader = ({ title, subtitle, onBack, rightIcon, onRightPress, ...props }) => (
  <GradientHeader
    title={title}
    subtitle={subtitle}
    leftIcon={<Ionicons name="arrow-back" size={24} color="white" />}
    onLeftPress={onBack}
    rightIcon={rightIcon}
    onRightPress={onRightPress}
    {...props}
  />
);

export const MenuHeader = ({ title, subtitle, onMenu, rightIcon, onRightPress, ...props }) => (
  <GradientHeader
    title={title}
    subtitle={subtitle}
    leftIcon={<Ionicons name="menu" size={24} color="white" />}
    onLeftPress={onMenu}
    rightIcon={rightIcon}
    onRightPress={onRightPress}
    {...props}
  />
);

export const SearchHeader = ({ title, subtitle, onSearch, onBack, ...props }) => (
  <GradientHeader
    title={title}
    subtitle={subtitle}
    leftIcon={<Ionicons name="arrow-back" size={24} color="white" />}
    onLeftPress={onBack}
    rightIcon={<Ionicons name="search" size={24} color="white" />}
    onRightPress={onSearch}
    {...props}
  />
);

export const ProfileHeader = ({ title, subtitle, onEdit, onBack, ...props }) => (
  <GradientHeader
    title={title}
    subtitle={subtitle}
    leftIcon={<Ionicons name="arrow-back" size={24} color="white" />}
    onLeftPress={onBack}
    rightIcon={<Ionicons name="create" size={24} color="white" />}
    onRightPress={onEdit}
    {...props}
  />
);
