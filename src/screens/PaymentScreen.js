import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, PrimaryGradient, OceanGradient, SunsetGradient, ModernGradient, TechGradient } from '../components/GradientView';

const { width, height } = Dimensions.get('window');

export default function PaymentScreen({ navigation, route }) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Payment Successful!',
        'Your payment has been processed. You can now upload your property.',
        [
          {
            text: 'Continue',
            onPress: () => navigation.navigate('AddHouse', {
              paymentCompleted: true,
              paymentId: `pay_${Date.now()}`
            })
          }
        ]
      );
    }, 2000);
  };

  const handleSkipPayment = () => {
    Alert.alert(
      'Skip Payment',
      'You can upload your property without payment for now. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Continue',
          onPress: () => navigation.navigate('AddHouse', {
            paymentCompleted: false,
            paymentId: null
          })
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Beautiful Gradient Header */}
      <PrimaryGradient style={styles.header}>
        <View style={styles.headerContent}>
          <Ionicons name="card" size={32} color="white" />
          <Text style={styles.headerTitle}>Upload Fee</Text>
          <Text style={styles.headerSubtitle}>List your property and start earning</Text>
        </View>
      </PrimaryGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Pricing Card */}
        <View style={styles.pricingSection}>
          <OceanGradient style={styles.pricingCard}>
            <View style={styles.priceContainer}>
              <Text style={styles.currency}>$</Text>
              <Text style={styles.price}>9.99</Text>
              <Text style={styles.period}>one-time</Text>
            </View>
            <Text style={styles.pricingTitle}>Property Upload Fee</Text>
            <Text style={styles.pricingDescription}>
              Upload your property images and start receiving booking requests
            </Text>
          </OceanGradient>
        </View>

        {/* Features List */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>What's Included</Text>
          
          <View style={styles.featureItem}>
            <ModernGradient style={styles.featureIcon}>
              <Ionicons name="images" size={20} color="white" />
            </ModernGradient>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Multiple Images</Text>
              <Text style={styles.featureDescription}>Upload up to 8 high-quality images</Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <SunsetGradient style={styles.featureIcon}>
              <Ionicons name="eye" size={20} color="white" />
            </SunsetGradient>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Public Listing</Text>
              <Text style={styles.featureDescription}>Your property will be visible to all users</Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <TechGradient style={styles.featureIcon}>
              <Ionicons name="chatbubbles" size={20} color="white" />
            </TechGradient>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Direct Contact</Text>
              <Text style={styles.featureDescription}>Receive booking requests directly from guests</Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <PrimaryGradient style={styles.featureIcon}>
              <Ionicons name="shield-checkmark" size={20} color="white" />
            </PrimaryGradient>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Verified Badge</Text>
              <Text style={styles.featureDescription}>Get verified status for trust</Text>
            </View>
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.paymentMethodsSection}>
          <Text style={styles.sectionTitle}>Payment Methods</Text>
          
          <View style={styles.paymentMethod}>
            <ModernGradient style={styles.paymentIcon}>
              <Ionicons name="card" size={24} color="white" />
            </ModernGradient>
            <View style={styles.paymentContent}>
              <Text style={styles.paymentTitle}>Credit/Debit Card</Text>
              <Text style={styles.paymentDescription}>Secure payment processing</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
          </View>

          <View style={styles.paymentMethod}>
            <OceanGradient style={styles.paymentIcon}>
              <Ionicons name="wallet" size={24} color="white" />
            </OceanGradient>
            <View style={styles.paymentContent}>
              <Text style={styles.paymentTitle}>Digital Wallet</Text>
              <Text style={styles.paymentDescription}>Apple Pay, Google Pay</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={styles.payButton}
            onPress={handlePayment}
            disabled={loading}
          >
            <PrimaryGradient style={styles.payButtonGradient}>
              {loading ? (
                <View style={styles.loadingContainer}>
                  <Ionicons name="sync" size={20} color="white" style={styles.spinning} />
                  <Text style={styles.payButtonText}>Processing...</Text>
                </View>
              ) : (
                <>
                  <Ionicons name="card" size={20} color="white" />
                  <Text style={styles.payButtonText}>Pay $9.99 & Continue</Text>
                </>
              )}
            </PrimaryGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleSkipPayment}
          >
            <Text style={styles.skipButtonText}>Skip Payment for Now</Text>
          </TouchableOpacity>
        </View>

        {/* Security Notice */}
        <View style={styles.securitySection}>
          <View style={styles.securityIcon}>
            <Ionicons name="shield-checkmark" size={20} color={COLORS.success} />
          </View>
          <Text style={styles.securityText}>
            Your payment information is secure and encrypted
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 16,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  pricingSection: {
    marginTop: 30,
    marginBottom: 30,
  },
  pricingCard: {
    padding: 30,
    borderRadius: 24,
    alignItems: 'center',
    shadowColor: COLORS.shadow.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  currency: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 4,
  },
  price: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 8,
  },
  period: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  pricingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  pricingDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 20,
  },
  featuresSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 16,
    shadowColor: COLORS.shadow.light,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  paymentMethodsSection: {
    marginBottom: 30,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: COLORS.shadow.light,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  paymentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  paymentContent: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  paymentDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  actionSection: {
    marginBottom: 30,
  },
  payButton: {
    marginBottom: 16,
    shadowColor: COLORS.shadow.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  payButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
  },
  payButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spinning: {
    transform: [{ rotate: '360deg' }],
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  skipButtonText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textDecorationLine: 'underline',
  },
  securitySection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    marginBottom: 30,
  },
  securityIcon: {
    marginRight: 8,
  },
  securityText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
