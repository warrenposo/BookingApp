import React from 'react';
import { View, Text, Image, Button, Linking, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../utils/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

export default function HouseDetailScreen({ route, navigation }) {
  const { house } = route.params;
  const { user } = useAuth();

  const handleDelete = async () => {
    Alert.alert(
      'Delete Property',
      'Are you sure you want to delete this property?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('houses')
                .delete()
                .eq('id', house.id);
              
              if (error) throw error;
              
              Alert.alert('Success', 'Property deleted successfully!');
              navigation.replace('Home');
            } catch (error) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={{ padding: 10 }}>
      <Image source={{ uri: house.image_url }} style={{ height: 300, marginBottom: 10 }} />
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{house.title}</Text>
      <Text style={{ marginVertical: 10 }}>{house.description}</Text>
      
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
        <TouchableOpacity 
          style={{ 
            backgroundColor: '#34C759', 
            padding: 12, 
            borderRadius: 8, 
            flexDirection: 'row', 
            alignItems: 'center',
            flex: 1,
            marginRight: 10
          }}
          onPress={() => navigation.navigate('Booking', { house })}
        >
          <Ionicons name="calendar" size={16} color="white" style={{ marginRight: 5 }} />
          <Text style={{ color: 'white', fontWeight: '600' }}>Book Now</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={{ 
            backgroundColor: '#007AFF', 
            padding: 12, 
            borderRadius: 8, 
            flexDirection: 'row', 
            alignItems: 'center',
            flex: 1,
            marginRight: 10
          }}
          onPress={() => Linking.openURL(`tel:${house.phone}`)}
        >
          <Ionicons name="call" size={16} color="white" style={{ marginRight: 5 }} />
          <Text style={{ color: 'white', fontWeight: '600' }}>Contact Owner</Text>
        </TouchableOpacity>
      </View>

      {/* Delete button for house owner */}
      {house.user_id === user?.id && (
        <TouchableOpacity 
          style={{ 
            backgroundColor: '#FF3B30', 
            padding: 12, 
            borderRadius: 8, 
            flexDirection: 'row', 
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onPress={handleDelete}
        >
          <Ionicons name="trash" size={16} color="white" style={{ marginRight: 5 }} />
          <Text style={{ color: 'white', fontWeight: '600' }}>Delete Property</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}