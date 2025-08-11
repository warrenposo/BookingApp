import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { supabase } from '../utils/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

export default function HostDashboardScreen({ navigation }) {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalHouses: 0,
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
  });
  const [houses, setHouses] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load user's houses
      const { data: userHouses, error: housesError } = await supabase
        .from('houses')
        .select('*')
        .eq('user_id', user.id);

      if (housesError) throw housesError;
      
      setHouses(userHouses || []);
      setStats(prev => ({ ...prev, totalHouses: userHouses?.length || 0 }));

      // Load recent bookings for user's houses
      if (userHouses && userHouses.length > 0) {
        const houseIds = userHouses.map(house => house.id);
        const { data: bookings, error: bookingsError } = await supabase
          .from('bookings')
          .select('*')
          .in('house_id', houseIds)
          .order('created_at', { ascending: false })
          .limit(5);

        if (bookingsError) throw bookingsError;
        
        setRecentBookings(bookings || []);
        
        const pending = bookings?.filter(b => b.status === 'pending').length || 0;
        const confirmed = bookings?.filter(b => b.status === 'confirmed').length || 0;
        
        setStats(prev => ({
          ...prev,
          totalBookings: bookings?.length || 0,
          pendingBookings: pending,
          confirmedBookings: confirmed,
        }));
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmBooking = async (bookingId) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'confirmed', confirmed_at: new Date().toISOString() })
        .eq('id', bookingId);

      if (error) throw error;

      Alert.alert('Success', 'Booking confirmed successfully!');
      loadDashboardData(); // Reload data
    } catch (error) {
      Alert.alert('Error', 'Failed to confirm booking');
    }
  };

  const handleRejectBooking = async (bookingId) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'rejected' })
        .eq('id', bookingId);

      if (error) throw error;

      Alert.alert('Success', 'Booking rejected successfully!');
      loadDashboardData(); // Reload data
    } catch (error) {
      Alert.alert('Error', 'Failed to reject booking');
    }
  };

  const renderStatsCard = (title, value, icon, color) => (
    <View style={[styles.statsCard, { borderLeftColor: color }]}>
      <View style={styles.statsContent}>
        <View style={styles.statsText}>
          <Text style={styles.statsValue}>{value}</Text>
          <Text style={styles.statsTitle}>{title}</Text>
        </View>
        <View style={[styles.statsIcon, { backgroundColor: color }]}>
          <Ionicons name={icon} size={24} color="white" />
        </View>
      </View>
    </View>
  );

  const renderHouseCard = (house) => (
    <View key={house.id} style={styles.houseCard}>
      <View style={styles.houseInfo}>
        <Text style={styles.houseTitle}>{house.title}</Text>
        <Text style={styles.houseDescription} numberOfLines={2}>
          {house.description}
        </Text>
        <Text style={styles.houseStatus}>
          Status: <Text style={styles.statusText}>{house.status}</Text>
        </Text>
      </View>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate('AddHouse', { house, isEditing: true })}
      >
        <Ionicons name="create" size={20} color={COLORS.primary} />
      </TouchableOpacity>
    </View>
  );

  const renderBookingCard = (booking) => (
    <View key={booking.id} style={styles.bookingCard}>
      <View style={styles.bookingHeader}>
        <Text style={styles.bookingDates}>
          {new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}
        </Text>
        <View style={[
          styles.statusBadge,
          { backgroundColor: booking.status === 'confirmed' ? COLORS.success : COLORS.warning }
        ]}>
          <Text style={styles.statusText}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </Text>
        </View>
      </View>
      
      {booking.message && (
        <Text style={styles.bookingMessage}>{booking.message}</Text>
      )}
      
      {booking.status === 'pending' && (
        <View style={styles.bookingActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.confirmButton]}
            onPress={() => handleConfirmBooking(booking.id)}
          >
            <Text style={styles.actionButtonText}>Confirm</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.rejectButton]}
            onPress={() => handleRejectBooking(booking.id)}
          >
            <Text style={styles.actionButtonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Host Dashboard</Text>
          <Text style={styles.subtitle}>
            Manage your properties and bookings
          </Text>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsGrid}>
            {renderStatsCard('Properties', stats.totalHouses, 'home', COLORS.primary)}
            {renderStatsCard('Total Bookings', stats.totalBookings, 'calendar', COLORS.secondary)}
            {renderStatsCard('Pending', stats.pendingBookings, 'time', COLORS.warning)}
            {renderStatsCard('Confirmed', stats.confirmedBookings, 'checkmark', COLORS.success)}
          </View>
        </View>

        {/* Properties Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Properties</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('Payment', { houseData: {} })}
            >
              <Ionicons name="add" size={20} color="white" />
              <Text style={styles.addButtonText}>Add Property</Text>
            </TouchableOpacity>
          </View>
          
          {houses.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="home" size={48} color={COLORS.textSecondary} />
              <Text style={styles.emptyStateText}>No properties yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Start by adding your first property
              </Text>
            </View>
          ) : (
            houses.map(renderHouseCard)
          )}
        </View>

        {/* Recent Bookings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Booking Requests</Text>
          
          {recentBookings.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="calendar" size={48} color={COLORS.textSecondary} />
              <Text style={styles.emptyStateText}>No bookings yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Booking requests will appear here
              </Text>
            </View>
          ) : (
            recentBookings.map(renderBookingCard)
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  statsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statsCard: {
    backgroundColor: 'white',
    width: '48%',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statsContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsText: {
    flex: 1,
  },
  statsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 5,
  },
  statsTitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  statsIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
  houseCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  houseInfo: {
    flex: 1,
  },
  houseTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 5,
  },
  houseDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  houseStatus: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  statusText: {
    fontWeight: '600',
    color: COLORS.primary,
  },
  editButton: {
    padding: 10,
  },
  bookingCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  bookingDates: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  bookingMessage: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginBottom: 15,
    lineHeight: 20,
  },
  bookingActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  confirmButton: {
    backgroundColor: COLORS.success,
  },
  rejectButton: {
    backgroundColor: COLORS.error,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    backgroundColor: 'white',
    padding: 40,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 15,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
});
