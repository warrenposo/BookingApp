import React, { useState } from 'react';
import { View, TextInput, Image, Alert, ActivityIndicator, ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { supabase } from '../utils/supabaseClient';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

export default function AddHouseScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [phone, setPhone] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  async function pickImages() {
    console.log('pickImages called');
    
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log('Permission status:', status);
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required', 
          'Please allow access to your photos to select images.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => ImagePicker.requestMediaLibraryPermissionsAsync() }
          ]
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        selectionLimit: Math.max(1, 8 - images.length),
        quality: 0.7,
        aspect: [4, 3],
        allowsEditing: false,
      });

      console.log('Image picker result:', result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const validImages = [];
        for (const asset of result.assets) {
          const response = await fetch(asset.uri, { method: 'HEAD' });
          const size = response.headers.get('content-length');
          if (size !== '0') {
            validImages.push(asset.uri);
          } else {
            console.warn('Skipping 0-byte image:', asset.uri);
          }
        }

        if (validImages.length > 0) {
          setImages(prev => {
            const combined = [...prev, ...validImages];
            return combined.slice(0, 8);
          });
          Alert.alert('Success', `${validImages.length} image(s) added successfully!`);
        } else {
          Alert.alert('Error', 'All selected images were empty. Please try again.');
        }
      } else if (result.canceled) {
        console.log('User canceled image selection');
      } else {
        Alert.alert('Error', 'No images were selected. Please try again.');
      }
    } catch (error) {
      console.error('Error picking images:', error);
      Alert.alert('Error', 'Failed to open image picker. Please try again.');
    }
  }

  function removeImage(index) {
    setImages(prev => prev.filter((_, i) => i !== index));
  }

  async function uploadHouse() {
    console.log('uploadHouse called');
    
    if (!title.trim() || !desc.trim() || !phone.trim()) {
      Alert.alert('Missing Information', 'Please fill in all required fields (Title, Description, Phone)');
      return;
    }

    if (images.length === 0) {
      Alert.alert('No Images', 'Please add at least one image');
      return;
    }

    try {
      setLoading(true);
      setProgress(0);

      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;

      const imageUrls = [];
      for (let i = 0; i < images.length; i++) {
        const uri = images[i];
        console.log(`Uploading image ${i + 1}/${images.length}`);
        
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 8);
        const fileExt = uri.split('.').pop()?.toLowerCase() || 'jpg';
        const path = `houses/${timestamp}_${randomString}_${i}.${fileExt}`;

        const response = await fetch(uri);
        if (!response.ok) throw new Error(`Failed to fetch image: ${response.status}`);
        
        const blob = await response.blob();
        if (blob.size === 0) throw new Error(`Image ${i + 1} is empty (0 bytes)`);

        const { error: uploadError } = await supabase.storage
          .from('house-images')
          .upload(path, blob, {
            contentType: blob.type || `image/${fileExt}`,
            upsert: false,
            cacheControl: '3600'
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('house-images')
          .getPublicUrl(path);

        imageUrls.push(publicUrl);
        setProgress(Math.round(((i + 1) / images.length) * 100));
      }

      // CORRECTED INSERT - using only image_url
      const { error } = await supabase.from('houses').insert([{
        title: title.trim(),
        description: desc.trim(),
        image_url: imageUrls[0], // Only storing the first image URL
        phone: phone.trim(),
        created_at: new Date().toISOString(),
        ...(user && { user_id: user.id })
      }]);

      if (error) throw error;

      Alert.alert(
        'Success', 
        'Property listed successfully!', 
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );

      setTitle('');
      setDesc('');
      setPhone('');
      setImages([]);
      setProgress(0);

    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert(
        'Upload Failed', 
        error.message || 'An error occurred. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        placeholder="Property Title *"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        maxLength={100}
      />
      
      <TextInput
        placeholder="Property Description *"
        value={desc}
        onChangeText={setDesc}
        multiline
        numberOfLines={4}
        style={[styles.input, styles.descInput]}
        maxLength={500}
      />
      
      <TextInput
        placeholder="Contact Phone Number *"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        style={styles.input}
        maxLength={15}
      />

      <View style={styles.imageSection}>
        <Text style={styles.sectionTitle}>Property Images ({images.length}/8) *</Text>
        <TouchableOpacity
          style={[styles.addButton, images.length >= 8 && styles.disabledButton]}
          onPress={pickImages}
          disabled={images.length >= 8}
        >
          <Ionicons name="camera" size={16} color="white" style={{ marginRight: 5 }} />
          <Text style={styles.buttonText}>
            {images.length >= 8 ? 'Max Reached' : 'Add Images'}
          </Text>
        </TouchableOpacity>
      </View>

      {images.length > 0 && (
        <View style={styles.imageGrid}>
          {images.map((uri, index) => (
            <View key={`${uri}_${index}`} style={styles.imageWrapper}>
              <Image 
                source={{ uri }} 
                style={styles.image}
                onError={(error) => {
                  console.error('Image load error:', error.nativeEvent);
                  Alert.alert('Error', `Failed to preview image ${index + 1}`);
                }}
              />
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => removeImage(index)}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={18} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {loading && (
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>Uploading: {progress}%</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.submitButton, 
          (loading || images.length === 0) && styles.disabledButton
        ]}
        onPress={uploadHouse}
        disabled={loading || images.length === 0}
        activeOpacity={0.8}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="white" size="small" />
            <Text style={[styles.buttonText, { marginLeft: 10 }]}>Uploading...</Text>
          </View>
        ) : (
          <Text style={styles.buttonText}>Submit Property</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    paddingBottom: 30,
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  descInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  imageSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  imageWrapper: {
    width: '48%',
    marginBottom: 15,
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    aspectRatio: 4/3,
    borderRadius: 8,
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  submitButton: {
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressContainer: {
    width: '100%',
    marginBottom: 15,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
  },
});