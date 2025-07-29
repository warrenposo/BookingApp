import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  ActivityIndicator,
  Platform,
  Alert,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../utils/supabaseClient';
import HouseCard from '../components/HouseCard';

// Professional color palette
const COLORS = {
  primary: '#2563eb',
  primaryDark: '#1d4ed8',
  secondary: '#64748b',
  background: '#f8fafc',
  surface: '#ffffff',
  text: '#1e293b',
  textSecondary: '#64748b',
  border: '#e2e8f0',
  success: '#10b981',
  error: '#ef4444',
  shadow: '#00000015',
};

export default function HomeScreen({ navigation }) {
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const navigateToExplore = () => {
    navigation.navigate('Explore');
  };

  const navigateToWishlist = () => {
    navigation.navigate('Wishlist');
  };

  const navigateToProfile = () => {
    navigation.navigate('Profile');
  };

  useEffect(() => {
    fetchHouses();
  }, []);

  async function fetchHouses(isRefresh = false) {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      console.log('Fetching houses...');
      const { data, error } = await supabase
        .from('houses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      console.log('Fetched houses:', data);
      setHouses(data || []);
    } catch (err) {
      console.error('Error fetching houses:', err);
      setError(err.message || 'Failed to fetch houses');
      
      // Show user-friendly error alert
      Alert.alert(
        'Error',
        'Unable to load houses. Please check your connection and try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  const handleRefresh = () => {
    fetchHouses(true);
  };

  const handleAddHouse = () => {
    navigation.navigate('AddHouse');
  };

  const handleHousePress = (house) => {
    navigation.navigate('HouseDetail', { house });
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No Houses Found</Text>
      <Text style={styles.emptySubtitle}>
        Get started by adding your first house listing
      </Text>
      <TouchableOpacity style={styles.emptyButton} onPress={handleAddHouse}>
        <Text style={styles.emptyButtonText}>Add Your First House</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHouseItem = ({ item, index }) => (
    <View style={[styles.cardContainer, { marginTop: index === 0 ? 16 : 8 }]}>
      <HouseCard 
        house={item} 
        onPress={() => handleHousePress(item)}
      />
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search properties..."
          placeholderTextColor={COLORS.textSecondary}
        />
      </View>
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>Properties</Text>
        <Text style={styles.headerSubtitle}>
          {houses.length} {houses.length === 1 ? 'listing' : 'listings'} available
        </Text>
      </View>
      <TouchableOpacity style={styles.addButton} onPress={handleAddHouse}>
        <Text style={styles.addButtonText}>+ Add New</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading properties...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      {!loading && (
        <FlatList
          data={houses}
          renderItem={renderHouseItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[COLORS.primary]}
            />
          }
        />
      )}
      
      <View style={styles.tabContainer}>
        <TouchableOpacity style={styles.tabButton} onPress={navigateToExplore}>
          <Ionicons name="compass-outline" size={24} color="#2563eb" />
          <Text style={styles.tabText}>Explore</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton} onPress={navigateToWishlist}>
          <Ionicons name="heart-outline" size={24} color="#2563eb" />
          <Text style={styles.tabText}>Wishlist</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton} onPress={navigateToProfile}>
          <Ionicons name="person-outline" size={24} color="#2563eb" />
          <Text style={styles.tabText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabButton: {
    alignItems: 'center',
  },
  tabText: {
    marginTop: 5,
    fontSize: 12,
    color: '#2563eb',
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingBottom: 70, // Add padding to prevent content from being hidden behind tabs
  },
  header: {
    flexDirection: 'column',
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  searchInput: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  addButtonText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  cardContainer: {
    marginBottom: 8,
  },
  separator: {
    height: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  emptyButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  emptyButtonText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: '600',
  },
});