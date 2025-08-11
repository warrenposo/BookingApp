import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
} from 'react-native';
import { COLORS, PrimaryGradient, SuccessGradient, WarningGradient, ErrorGradient, OceanGradient, SunsetGradient, ModernGradient, TechGradient } from './GradientView';

const { width } = Dimensions.get('window');

const GradientCard = ({
  children,
  variant = 'primary',
  style,
  contentStyle,
  shadow = true,
  borderRadius = 16,
  padding = 20,
  margin = 0,
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
      case 'tech':
        return TechGradient;
      default:
        return PrimaryGradient;
    }
  };

  const GradientComponent = getGradientComponent();

  return (
    <View
      style={[
        styles.container,
        {
          borderRadius,
          padding,
          margin,
        },
        shadow && styles.shadow,
        style,
      ]}
      {...props}
    >
      <GradientComponent
        style={[
          styles.gradient,
          {
            borderRadius,
            padding,
          },
          contentStyle,
        ]}
      >
        {children}
      </GradientComponent>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  gradient: {
    width: '100%',
  },
  shadow: {
    shadowColor: COLORS.shadow.medium,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
});

export default GradientCard;

// Predefined card variants for common use cases
export const PrimaryCard = (props) => (
  <GradientCard variant="primary" {...props} />
);

export const SuccessCard = (props) => (
  <GradientCard variant="success" {...props} />
);

export const WarningCard = (props) => (
  <GradientCard variant="warning" {...props} />
);

export const ErrorCard = (props) => (
  <GradientCard variant="error" {...props} />
);

export const OceanCard = (props) => (
  <GradientCard variant="ocean" {...props} />
);

export const SunsetCard = (props) => (
  <GradientCard variant="sunset" {...props} />
);

export const ModernCard = (props) => (
  <GradientCard variant="modern" {...props} />
);

export const TechCard = (props) => (
  <GradientCard variant="tech" {...props} />
);

// Size variants
export const SmallCard = (props) => (
  <GradientCard padding={12} borderRadius={12} {...props} />
);

export const LargeCard = (props) => (
  <GradientCard padding={28} borderRadius={20} {...props} />
);

// Special purpose cards
export const InfoCard = ({ title, description, icon, ...props }) => (
  <GradientCard variant="ocean" {...props}>
    <View style={styles.infoCardContent}>
      {icon && (
        <View style={styles.infoCardIcon}>
          {icon}
        </View>
      )}
      <View style={styles.infoCardText}>
        {title && (
          <Text style={styles.infoCardTitle}>{title}</Text>
        )}
        {description && (
          <Text style={styles.infoCardDescription}>{description}</Text>
        )}
      </View>
    </View>
  </GradientCard>
);

export const StatsCard = ({ value, label, icon, variant = 'primary', ...props }) => (
  <GradientCard variant={variant} padding={24} {...props}>
    <View style={styles.statsCardContent}>
      {icon && (
        <View style={styles.statsCardIcon}>
          {icon}
        </View>
      )}
      <View style={styles.statsCardText}>
        <Text style={styles.statsCardValue}>{value}</Text>
        <Text style={styles.statsCardLabel}>{label}</Text>
      </View>
    </View>
  </GradientCard>
);

// Additional styles for special cards
const additionalStyles = StyleSheet.create({
  infoCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoCardIcon: {
    marginRight: 16,
  },
  infoCardText: {
    flex: 1,
  },
  infoCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  infoCardDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
  },
  statsCardContent: {
    alignItems: 'center',
  },
  statsCardIcon: {
    marginBottom: 12,
  },
  statsCardText: {
    alignItems: 'center',
  },
  statsCardValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  statsCardLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
});

// Merge additional styles
Object.assign(styles, additionalStyles);
