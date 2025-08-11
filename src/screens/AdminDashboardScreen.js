import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { supabase } from '../utils/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

export default function AdminDashboardScreen({ navigation }) {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalHouses: 0,
    pendingVerifications: 0,
    totalUsers: 0,
    totalBookings: 0,
    revenue: 0,
  });
  const [houses, setHouses] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [actionType, setActionType] = useState('');

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      
      // Load all houses for admin review
      const { data: allHouses, error: housesError } = await supabase
        .from('houses')
        .select('*, user_profiles(full_name, phone, email)')
        .order('created_at', { ascending: false });

      if (housesError) throw housesError;
      setHouses(allHouses || []);

      // Load user statistics
      const { count: userCount, error: userError } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact' });

      if (userError) throw userError;

      // Calculate stats
      const pendingVerifications = allHouses?.filter(h => !h.is_verified).length || 0;
      const totalBookings = 0; // You'll need to implement this
      const revenue = 0; // You'll need to implement this

      setStats({
        totalHouses: allHouses?.length || 0,
        pendingVerifications,
        totalUsers: userCount || 0,
        totalBookings,
        revenue,
      });

    } catch (error) {
      console.error('Error loading admin data:', error);
      Alert.alert('Error', 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleHouseAction = async (houseId, action, details = {}) => {
    try {
      let updateData = {};
      
      switch (action) {
        case 'verify':
          updateData = { is_verified: true, status: 'active' };
          break;
        case 'suspend':
          updateData = { status: 'suspended' };
          break;
        case 'feature':
          updateData = { featured: true };
          break;
        case 'unfeature':
          updateData = { featured: false };
          break;
        case 'delete':
          // Handle deletion
          const { error: deleteError } = await supabase
            .from('houses')
            .delete()
            .eq('id', houseId);
          
          if (deleteError) throw deleteError;
          break;
      }

      if (Object.keys(updateData).length > 0) {
        const { error } = await supabase
          .from('houses')
          .update(updateData)
          .eq('id', houseId);

        if (error) throw error;
      }

      // Log admin action
      await supabase
        .from('admin_actions')
        .insert({
          admin_user_id: user.id,
          action_type: action,
          target_type: 'house',
          target_id: houseId,
          details: details
        });

      Alert.alert('Success', `House ${action} successful`);
      loadAdminData(); // Reload data
      
    } catch (error) {
      Alert.alert('Error', `Failed to ${action} house`);
    }
  };

  const handleUserAction = async (userId, action, details = {}) => {
    try {
      let updateData = {};
      
      switch (action) {
        case 'verify':
          updateData = { verification_status: 'verified' };
          break;
        case 'suspend':
          updateData = { 
            verification_status: 'suspended',
            suspension_reason: details.reason || 'Admin suspension'
          };
          break;
        case 'activate':
          updateData = { verification_status: 'verified' };
          break;
      }

      if (Object.keys(updateData).length > 0) {
        const { error } = await supabase
          .from('user_profiles')
          .update(updateData)
          .eq('id', userId);

        if (error) throw error;
      }

      // Log admin action
      await supabase
        .from('admin_actions')
        .insert({
          admin_user_id: user.id,
          action_type: action,
          target_type: 'user',
          target_id: userId,
          details: details
        });

      Alert.alert('Success', `User ${action} successful`);
      loadAdminData();
      
    } catch (error) {
      Alert.alert('Error', `Failed to ${action} user`);
    }
  };

  const renderStatsCard = (title, value, icon, color, subtitle = '') => (
    <View style={[styles.statsCard, { borderLeftColor: color }]}>
      <View style={styles.statsContent}>
        <View style={styles.statsText}>
          <Text style={styles.statsValue}>{value}</Text>
          <Text style={styles.statsTitle}>{title}</Text>
          {subtitle && <Text style={styles.statsSubtitle}>{subtitle}</Text>}
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
        <Text style={styles.houseOwner}>
          Owner: {house.user_profiles?.full_name || 'Unknown'}
        </Text>
        <Text style={styles.houseStatus}>
          Status: <Text style={[
            styles.statusText,
            { color: house.is_verified ? COLORS.success : COLORS.warning }
          ]}>
            {house.is_verified ? 'Verified' : 'Pending Verification'}
          </Text>
        </Text>
        <Text style={styles.houseDate}>
          Listed: {new Date(house.created_at).toLocaleDateString()}
        </Text>
      </View>
      
      <View style={styles.houseActions}>
        {!house.is_verified && (
          <TouchableOpacity
            style={[styles.actionButton, styles.verifyButton]}
            onPress={() => handleHouseAction(house.id, 'verify')}
          >
            <Ionicons name="checkmark" size={16} color="white" />
            <Text style={styles.actionButtonText}>Verify</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[styles.actionButton, styles.featureButton]}
          onPress={() => handleHouseAction(house.id, house.featured ? 'unfeature' : 'feature')}
        >
          <Ionicons name={house.featured ? "star" : "star-outline"} size={16} color="white" />
          <Text style={styles.actionButtonText}>
            {house.featured ? 'Unfeature' : 'Feature'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.suspendButton]}
          onPress={() => handleHouseAction(house.id, 'suspend')}
        >
          <Ionicons name="pause" size={16} color="white" />
          <Text style={styles.actionButtonText}>Suspend</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderUserCard = (userProfile) => (
    <View key={userProfile.id} style={styles.userCard}>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{userProfile.full_name || 'No Name'}</Text>
        <Text style={styles.userEmail}>{userProfile.phone || 'No Phone'}</Text>
        <Text style={styles.userStatus}>
          Status: <Text style={[
            styles.statusText,
            { color: userProfile.verification_status === 'verified' ? COLORS.success : COLORS.warning }
          ]}>
            {userProfile.verification_status || 'pending'}
          </Text>
        </Text>
      </View>
      
      <View style={styles.userActions}>
        {userProfile.verification_status !== 'verified' && (
          <TouchableOpacity
            style={[styles.actionButton, styles.verifyButton]}
            onPress={() => handleUserAction(userProfile.id, 'verify')}
          >
            <Ionicons name="checkmark" size={16} color="white" />
            <Text style={styles.actionButtonText}>Verify</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[styles.actionButton, styles.suspendButton]}
          onPress={() => {
            setSelectedItem(userProfile);
            setActionType('suspend_user');
            setShowActionModal(true);
          }}
        >
          <Ionicons name="pause" size={16} color="white" />
          <Text style={styles.actionButtonText}>Suspend</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'overview':
        return (
          <View style={styles.overviewSection}>
            <Text style={styles.sectionTitle}>System Overview</Text>
            <View style={styles.statsGrid}>
              {renderStatsCard('Total Properties', stats.totalHouses, 'home', COLORS.primary)}
              {renderStatsCard('Pending Verification', stats.pendingVerifications, 'time', COLORS.warning)}
              {renderStatsCard('Total Users', stats.totalUsers, 'people', COLORS.secondary)}
              {renderStatsCard('Total Bookings', stats.totalBookings, 'calendar', COLORS.success)}
            </View>
            
            <View style={styles.revenueCard}>
              <Text style={styles.revenueTitle}>Revenue Overview</Text>
              <Text style={styles.revenueAmount}>${stats.revenue.toFixed(2)}</Text>
              <Text style={styles.revenueSubtitle}>Total revenue from upload fees</Text>
            </View>
          </View>
        );
        
      case 'properties':
        return (
          <View style={styles.propertiesSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Property Management</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Search properties..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            
            {houses.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="home" size={48} color={COLORS.textSecondary} />
                <Text style={styles.emptyStateText}>No properties found</Text>
              </View>
            ) : (
              houses
                .filter(house => 
                  house.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  house.user_profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map(renderHouseCard)
            )}
          </View>
        );
        
      case 'users':
        return (
          <View style={styles.usersSection}>
            <Text style={styles.sectionTitle}>User Management</Text>
            {users.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="people" size={48} color={COLORS.textSecondary} />
                <Text style={styles.emptyStateText}>No users found</Text>
              </View>
            ) : (
              users.map(renderUserCard)
            )}
          </View>
        );
        
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading admin dashboard...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <Text style={styles.subtitle}>
          Manage properties, users, and system operations
        </Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'overview' && styles.activeTab]}
          onPress={() => setSelectedTab('overview')}
        >
          <Ionicons 
            name="stats-chart" 
            size={20} 
            color={selectedTab === 'overview' ? COLORS.primary : COLORS.textSecondary} 
          />
          <Text style={[styles.tabText, selectedTab === 'overview' && styles.activeTabText]}>
            Overview
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'properties' && styles.activeTab]}
          onPress={() => setSelectedTab('properties')}
        >
          <Ionicons 
            name="home" 
            size={20} 
            color={selectedTab === 'properties' ? COLORS.primary : COLORS.textSecondary} 
          />
          <Text style={[styles.tabText, selectedTab === 'properties' && styles.activeTabText]}>
            Properties
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'users' && styles.activeTab]}
          onPress={() => setSelectedTab('users')}
        >
          <Ionicons 
            name="people" 
            size={20} 
            color={selectedTab === 'users' ? COLORS.primary : COLORS.textSecondary} 
          />
          <Text style={[styles.tabText, selectedTab === 'users' && styles.activeTabText]}>
            Users
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {renderTabContent()}
      </ScrollView>

      {/* Action Modal */}
      <Modal
        visible={showActionModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {actionType === 'suspend_user' ? 'Suspend User' : 'Admin Action'}
            </Text>
            
            {actionType === 'suspend_user' && (
              <View>
                <Text style={styles.modalSubtitle}>
                  Please provide a reason for suspending this user:
                </Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Suspension reason..."
                  multiline
                  numberOfLines={3}
                />
              </View>
            )}
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowActionModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => {
                  // Handle action confirmation
                  setShowActionModal(false);
                }}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  activeTab: {
    backgroundColor: COLORS.primary + '20',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textSecondary,
    marginLeft: 8,
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  overviewSection: {
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
    marginBottom: 25,
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
  statsSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statsIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  revenueCard: {
    backgroundColor: 'white',
    padding: 25,
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
  revenueTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 15,
  },
  revenueAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.success,
    marginBottom: 10,
  },
  revenueSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
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
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
    backgroundColor: 'white',
    width: '40%',
  },
  houseCard: {
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
  houseInfo: {
    marginBottom: 15,
  },
  houseTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 5,
  },
  houseOwner: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 5,
  },
  houseStatus: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 5,
  },
  houseDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  statusText: {
    fontWeight: '600',
  },
  houseActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginHorizontal: 2,
  },
  verifyButton: {
    backgroundColor: COLORS.success,
  },
  featureButton: {
    backgroundColor: COLORS.primary,
  },
  suspendButton: {
    backgroundColor: COLORS.warning,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  usersSection: {
    marginBottom: 30,
  },
  userCard: {
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
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 5,
  },
  userStatus: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  userActions: {
    flexDirection: 'row',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
    marginBottom: 20,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontWeight: '500',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
