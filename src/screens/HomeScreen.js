import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../utils/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { COLORS, PrimaryGradient, OceanGradient, SunsetGradient, ModernGradient } from '../components/GradientView';
import HouseCard from '../components/HouseCard';

export default function HomeScreen({ navigation }) {
  const { user, signOut } = useAuth();
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userPropertiesCount, setUserPropertiesCount] = useState(0);

  useEffect(() => {
    loadHouses();
    loadUserPropertiesCount();
  }, [user]);

  const testDatabaseConnection = async () => {
    try {
      console.log('Testing database connection...');
      
      // Test basic connection
      const { data: testData, error: testError } = await supabase
        .from('houses')
        .select('count')
        .limit(1);
      
      if (testError) {
        console.error('Database test failed:', testError);
        Alert.alert('Database Test Failed', `Error: ${testError.message}\nCode: ${testError.code}`);
      } else {
        console.log('Database connection successful');
        Alert.alert('Database Test', 'Connection successful! Tables are accessible.');
      }
    } catch (error) {
      console.error('Database test error:', error);
      Alert.alert('Database Test Error', error.message);
    }
  };

  const checkDatabaseStructure = async () => {
    try {
      console.log('Checking database structure...');
      
      // Get all houses to see what fields exist
      const { data: housesData, error: housesError } = await supabase
        .from('houses')
        .select('*')
        .limit(5);
      
      if (housesError) {
        console.error('Error fetching houses:', housesError);
        Alert.alert('Error', `Failed to fetch houses: ${housesError.message}`);
        return;
      }
      
      if (housesData && housesData.length > 0) {
        const firstHouse = housesData[0];
        console.log('First house structure:', Object.keys(firstHouse));
        console.log('First house data:', JSON.stringify(firstHouse, null, 2));
        
        // Check specific fields
        const hasImages = 'images' in firstHouse;
        const hasImageUrl = 'image_url' in firstHouse;
        const imagesValue = firstHouse.images;
        const imageUrlValue = firstHouse.image_url;
        
        console.log('Field check:', {
          hasImages,
          hasImageUrl,
          imagesValue,
          imageUrlValue,
          imagesType: typeof imagesValue,
          imageUrlType: typeof imageUrlValue
        });
        
        Alert.alert(
          'Database Structure Check',
          `Fields found: ${Object.keys(firstHouse).join(', ')}\n\n` +
          `Has 'images' field: ${hasImages}\n` +
          `Has 'image_url' field: ${hasImageUrl}\n` +
          `Images value: ${JSON.stringify(imagesValue)}\n` +
          `Image URL value: ${imageUrlValue}`
        );
      } else {
        Alert.alert('Database Check', 'No houses found in database. Add a property first.');
      }
      
    } catch (error) {
      console.error('Database structure check error:', error);
      Alert.alert('Error', `Check failed: ${error.message}`);
    }
  };

  const checkStorageBucket = async () => {
    try {
      console.log('Checking storage bucket...');
      
      // Try to list files in the house-images bucket
      const { data: files, error: bucketError } = await supabase
        .storage
        .from('house-images')
        .list('', { limit: 1 });
      
      if (bucketError) {
        console.error('Storage bucket error:', bucketError);
        Alert.alert(
          'Storage Check Failed', 
          `Error: ${bucketError.message}\n\nThis means the 'house-images' bucket doesn't exist or isn't accessible.`
        );
      } else {
        console.log('Storage bucket accessible, files found:', files?.length || 0);
        Alert.alert(
          'Storage Check', 
          `Storage bucket 'house-images' is accessible!\n\nFiles found: ${files?.length || 0}`
        );
      }
      
    } catch (error) {
      console.error('Storage check error:', error);
      Alert.alert('Error', `Storage check failed: ${error.message}`);
    }
  };

  const createTestHouse = async () => {
    try {
      console.log('Creating test house...');
      
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) {
        Alert.alert('Error', 'Not authenticated');
        return;
      }
      
      const testHouseData = {
        title: 'Test Property',
        description: 'This is a test property to verify image display',
        images: ['https://via.placeholder.com/400x300?text=Test+Image'],
        phone: '+1234567890',
        user_id: user.id,
        status: 'active'
      };
      
      console.log('Inserting test house:', testHouseData);
      
      const { data: newHouse, error: insertError } = await supabase
        .from('houses')
        .insert([testHouseData])
        .select()
        .single();
      
      if (insertError) {
        console.error('Error inserting test house:', insertError);
        Alert.alert('Error', `Failed to create test house: ${insertError.message}`);
      } else {
        console.log('Test house created successfully:', newHouse);
        Alert.alert('Success', 'Test house created! Refresh to see it.');
        // Reload houses
        loadHouses();
      }
      
    } catch (error) {
      console.error('Error creating test house:', error);
      Alert.alert('Error', `Test house creation failed: ${error.message}`);
    }
  };

  const loadHouses = async () => {
    try {
      setLoading(true);
      console.log('Loading houses...');
      
      const { data, error } = await supabase
        .from('houses')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Houses loaded successfully:', data?.length || 0, 'houses');
      
      // Debug: Log the first house data to see what fields are available
      if (data && data.length > 0) {
        console.log('First house data:', JSON.stringify(data[0], null, 2));
        console.log('First house images field:', {
          images: data[0].images,
          imagesType: typeof data[0].images,
          imagesLength: data[0].images?.length,
          hasImages: !!data[0].images
        });
      }
      
      setHouses(data || []);
    } catch (error) {
      console.error('Error loading houses:', error);
      let errorMessage = 'Failed to load properties';
      
      if (error.code === '42P01') {
        errorMessage = 'Database tables not found. Please run the database schema first.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const loadUserPropertiesCount = async () => {
    try {
      if (!user?.id) return;
      
      const { count, error } = await supabase
        .from('houses')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'active');
      
      if (error) {
        console.error('Error loading user properties count:', error);
      } else {
        setUserPropertiesCount(count || 0);
      }
    } catch (error) {
      console.error('Error in loadUserPropertiesCount:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHouses();
    await loadUserPropertiesCount();
    setRefreshing(false);
  };

  const handleAddHouse = () => {
    navigation.navigate('Payment', { houseData: {} });
  };

  const navigateToHostDashboard = () => {
    navigation.navigate('HostDashboard');
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', onPress: signOut }
      ]
    );
  };

  const handleProfilePress = () => {
    navigation.navigate('Profile');
  };

  return (
    <View style={styles.container}>
      {/* Beautiful Gradient Header */}
      <PrimaryGradient style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={styles.welcomeText}>Welcome back!</Text>
            <Text style={styles.userName}>{user?.email?.split('@')[0] || 'User'}</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.testButton}
              onPress={testDatabaseConnection}
            >
              <Ionicons name="bug" size={20} color="white" />
              <Text style={styles.testButtonText}>Test DB</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.structureButton}
              onPress={checkDatabaseStructure}
            >
              <Ionicons name="database" size={20} color="white" />
              <Text style={styles.structureButtonText}>Check Fields</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.storageButton}
              onPress={checkStorageBucket}
            >
              <Ionicons name="cloud" size={20} color="white" />
              <Text style={styles.storageButtonText}>Check Storage</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.testHouseButton}
              onPress={createTestHouse}
            >
              <Ionicons name="add-circle" size={20} color="white" />
              <Text style={styles.testHouseButtonText}>Test House</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.hostButton}
              onPress={navigateToHostDashboard}
            >
              <Ionicons name="home" size={20} color="white" />
              <Text style={styles.hostButtonText}>Host</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={handleProfilePress}
            >
              <Ionicons name="person" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.signOutButton}
              onPress={handleSignOut}
            >
              <Ionicons name="log-out-outline" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Search Bar with Gradient Border */}
        <View style={styles.searchContainer}>
          <ModernGradient style={styles.searchBar}>
            <Ionicons name="search" size={20} color={COLORS.textSecondary} />
            <Text style={styles.searchPlaceholder}>Search properties...</Text>
          </ModernGradient>
        </View>

        {/* User Info Section */}
        <View style={styles.userInfoSection}>
          <View style={styles.userInfoLeft}>
            <Text style={styles.userInfoTitle}>Welcome back, {user?.email?.split('@')[0] || 'User'}!</Text>
            <Text style={styles.userInfoSubtitle}>Manage your properties and discover new ones</Text>
          </View>
          <TouchableOpacity
            style={styles.userInfoButton}
            onPress={handleProfilePress}
          >
            <Ionicons name="person-circle" size={32} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </PrimaryGradient>

      {/* Content */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Stats Section with Gradient Cards */}
        <View style={styles.statsSection}>
          <OceanGradient style={styles.statCard}>
            <Ionicons name="home" size={24} color="white" />
            <Text style={styles.statNumber}>{userPropertiesCount}</Text>
            <Text style={styles.statLabel}>Properties</Text>
          </OceanGradient>
          
          <SunsetGradient style={styles.statCard}>
            <Ionicons name="calendar" size={24} color="white" />
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Bookings</Text>
          </SunsetGradient>
          
          <ModernGradient style={styles.statCard}>
            <Ionicons name="star" size={24} color="white" />
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </ModernGradient>
        </View>

        {/* Add Property Button */}
        <TouchableOpacity
          style={styles.addButtonContainer}
          onPress={handleAddHouse}
        >
          <PrimaryGradient style={styles.addButton}>
            <Ionicons name="add" size={24} color="white" />
            <Text style={styles.addButtonText}>Add Your Property</Text>
          </PrimaryGradient>
        </TouchableOpacity>

        {/* Manage Properties Button */}
        <TouchableOpacity
          style={styles.manageButtonContainer}
          onPress={navigateToHostDashboard}
        >
          <OceanGradient style={styles.manageButton}>
            <Ionicons name="settings" size={24} color="white" />
            <Text style={styles.manageButtonText}>Manage My Properties</Text>
          </OceanGradient>
        </TouchableOpacity>

        {/* Quick Actions Section */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.quickActionsTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={handleAddHouse}
            >
              <View style={styles.quickActionIcon}>
                <Ionicons name="add-circle" size={32} color={COLORS.primary} />
              </View>
              <Text style={styles.quickActionText}>Add Property</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={navigateToHostDashboard}
            >
              <View style={styles.quickActionIcon}>
                <Ionicons name="settings" size={32} color={COLORS.primary} />
              </View>
              <Text style={styles.quickActionText}>Manage</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={handleProfilePress}
            >
              <View style={styles.quickActionIcon}>
                <Ionicons name="person" size={32} color={COLORS.primary} />
              </View>
              <Text style={styles.quickActionText}>Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Properties Section */}
        <View style={styles.propertiesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Available Properties</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Explore')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading properties...</Text>
            </View>
          ) : houses.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="home-outline" size={64} color={COLORS.textSecondary} />
              <Text style={styles.emptyTitle}>No Properties Yet</Text>
              <Text style={styles.emptySubtitle}>
                Be the first to add a property and start earning!
              </Text>
            </View>
          ) : (
            houses.map((house) => (
              <HouseCard
                key={house.id}
                house={house}
                onPress={() => navigation.navigate('HouseDetail', { house })}
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleAddHouse}
      >
        <PrimaryGradient style={styles.fabContent}>
          <Ionicons name="add" size={24} color="white" />
        </PrimaryGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLeft: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  testButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 4,
  },
  structureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  structureButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 4,
  },
  storageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  storageButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 4,
  },
  testHouseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  testHouseButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 4,
  },
  hostButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  hostButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 4,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  searchContainer: {
    marginTop: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: COLORS.shadow.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  searchPlaceholder: {
    marginLeft: 12,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  userInfoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  userInfoLeft: {
    flex: 1,
  },
  userInfoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  userInfoSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  userInfoButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 25,
  },
  statCard: {
    width: '30%',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: COLORS.shadow.medium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  addButtonContainer: {
    marginBottom: 25,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    shadowColor: COLORS.shadow.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  manageButtonContainer: {
    marginBottom: 25,
  },
  manageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    shadowColor: COLORS.shadow.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  manageButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  quickActionsSection: {
    marginBottom: 25,
  },
  quickActionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  quickActionCard: {
    width: '45%', // Adjust as needed for 2 columns
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginVertical: 10,
    shadowColor: COLORS.shadow.medium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  quickActionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  quickActionText: {
    fontSize: 14,
    color: COLORS.text,
    textAlign: 'center',
    fontWeight: '500',
  },
  propertiesSection: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  seeAllText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    shadowColor: COLORS.shadow.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabContent: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
