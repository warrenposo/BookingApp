import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

export default function HouseCard({ house, onPress }) {
  const [imageError, setImageError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const handleImageError = () => {
    console.error('Failed to load image:', house.image_url);
    if (retryCount < 2) {
      setRetryCount(retryCount + 1);
    } else {
      setImageError(true);
    }
  };

  return (
    <TouchableOpacity onPress={onPress} style={{ marginBottom: 10, borderWidth: 1, borderRadius: 8, overflow: 'hidden' }}>
      {imageError ? (
        <View style={{ height: 200, justifyContent: 'center', alignItems: 'center', backgroundColor: '#eee' }}>
          <Ionicons name="image-off" size={32} color="#888" />
          <Text style={{ color: '#888', marginTop: 8 }}>Image unavailable</Text>
        </View>
      ) : (
        <Image
          key={`${house.image_url}_${retryCount}`}
          source={{ uri: house.image_url }}
          style={{ height: 200, width: '100%' }}
          onError={handleImageError}
        />
      )}
      <View style={{ padding: 10 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{house.title}</Text>
        <Text numberOfLines={2}>{house.description}</Text>
      </View>
    </TouchableOpacity>
  );
}