import React from 'react';
import { View, Text, Image, Button, Linking } from 'react-native';

export default function HouseDetailScreen({ route }) {
  const { house } = route.params;

  return (
    <View style={{ padding: 10 }}>
      <Image source={{ uri: house.image_url }} style={{ height: 300, marginBottom: 10 }} />
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{house.title}</Text>
      <Text style={{ marginVertical: 10 }}>{house.description}</Text>
      <Button title="Contact Owner" onPress={() => Linking.openURL(`tel:${house.phone}`)} />
    </View>
  );
}
