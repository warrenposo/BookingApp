import React from 'react';
import { View, Text, Image, Button, Linking, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../utils/supabaseClient';

export default function HouseDetailScreen({ route, navigation }) {
  const { house } = route.params;

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
      
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <TouchableOpacity 
          style={{ 
            backgroundColor: '#007AFF', 
            padding: 10, 
            borderRadius: 5, 
            flexDirection: 'row', 
            alignItems: 'center'
          }}
          onPress={() => Linking.openURL(`tel:${house.phone}`)}
        >
          <Ionicons name="call" size={16} color="white" style={{ marginRight: 5 }} />
          <Text style={{ color: 'white' }}>Contact Owner</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={{ 
            backgroundColor: '#FF3B30', 
            padding: 10, 
            borderRadius: 5, 
            flexDirection: 'row', 
            alignItems: 'center'
          }}
          onPress={handleDelete}
        >
          <Ionicons name="trash" size={16} color="white" style={{ marginRight: 5 }} />
          <Text style={{ color: 'white' }}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}