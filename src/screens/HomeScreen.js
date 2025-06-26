import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import { supabase } from '../utils/supabaseClient';
import HouseCard from '../components/HouseCard';

export default function HomeScreen({ navigation }) {
  const [houses, setHouses] = useState([]);

  useEffect(() => {
    fetchHouses();
  }, []);

  async function fetchHouses() {
    console.log('Fetching houses...');
    const { data, error } = await supabase
      .from('houses')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching houses:', error);
    } else {
      console.log('Fetched houses:', data);
      setHouses(data);
    }
  }

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Button title="Add New House" onPress={() => navigation.navigate('AddHouse')} />
      <FlatList
        data={houses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <HouseCard house={item} onPress={() => navigation.navigate('HouseDetail', { house: item })} />}
      />
    </View>
  );
}
