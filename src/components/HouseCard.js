import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, ModernGradient, SunsetGradient } from './GradientView';

const { width } = Dimensions.get('window');

const HouseCard = ({ house, onPress }) => {
  // Debug logging for images
  console.log('HouseCard received house:', {
    id: house.id,
    title: house.title,
    images: house.images,
    imagesType: typeof house.images,
    imagesLength: house.images?.length
  });

  // Get the first image or use placeholder
  const getImageUri = () => {
    // Try different possible image field formats
    if (house.images && Array.isArray(house.images) && house.images.length > 0) {
      return house.images[0];
    }
    
    // Fallback to image_url if it exists (for backward compatibility)
    if (house.image_url) {
      return house.image_url;
    }
    
    // Fallback to placeholder
    return 'https://via.placeholder.com/300x200?text=No+Image';
  };

  const imageUri = getImageUri();

  console.log('Using image URI:', imageUri);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.9}>
      {/* Image Container with Gradient Overlay */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
          resizeMode="cover"
        />
        {/* Gradient Overlay */}
        <ModernGradient style={styles.imageOverlay} />
        
        {/* Price Badge with Gradient */}
        <View style={styles.priceContainer}>
          <SunsetGradient style={styles.priceBadge}>
            <Text style={styles.priceText}>$9.99</Text>
          </SunsetGradient>
        </View>
        
        {/* Verification Badge */}
        {house.is_verified && (
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
            <Text style={styles.verifiedText}>Verified</Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {house.title}
        </Text>
        
        <Text style={styles.description} numberOfLines={2}>
          {house.description}
        </Text>
        
        {/* Bottom Row */}
        <View style={styles.bottomRow}>
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={14} color={COLORS.textSecondary} />
            <Text style={styles.locationText}>Location</Text>
          </View>
          
          <View style={styles.contactContainer}>
            <Ionicons name="call" size={14} color={COLORS.primary} />
            <Text style={styles.contactText}>Contact</Text>
          </View>
        </View>
      </View>

      {/* Gradient Border Bottom */}
      <ModernGradient style={styles.gradientBorder} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: COLORS.shadow.medium,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 200,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    opacity: 0.3,
  },
  priceContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  priceBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: COLORS.shadow.medium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  priceText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  verifiedBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedText: {
    color: COLORS.success,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
    lineHeight: 22,
  },
  description: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
    marginLeft: 4,
  },
  gradientBorder: {
    height: 3,
    width: '100%',
  },
});

export default HouseCard;