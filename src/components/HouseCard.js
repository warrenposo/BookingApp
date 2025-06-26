import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

export default function HouseCard({ house, onPress }) {
  const [imageError, setImageError] = useState(false);

  return (
    <TouchableOpacity onPress={onPress} style={{ marginBottom: 10, borderWidth: 1, borderRadius: 8, overflow: 'hidden' }}>
      {imageError ? (
        <View style={{ height: 200, justifyContent: 'center', alignItems: 'center', backgroundColor: '#eee' }}>
          <Text style={{ color: '#888' }}>Image failed to load</Text>
        </View>
      ) : (
        <Image
          source={{ uri: house.image_url }}
          style={{ height: 200, width: '100%' }}
          onError={() => {
            console.error('Failed to load image:', house.image_url);
            setImageError(true);
          }}
        />
      )}
      <View style={{ padding: 10 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{house.title}</Text>
        <Text numberOfLines={2}>{house.description}</Text>
      </View>
    </TouchableOpacity>
  );
}
