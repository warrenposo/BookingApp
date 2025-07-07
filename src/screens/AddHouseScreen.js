import React, { useState } from 'react';
import {
  View,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform
} from 'react-native';
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
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please allow access to your photos.',
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
        quality: 0.8,
        aspect: [4, 3],
        allowsEditing: false,
      });

      if (!result.canceled && result.assets?.length > 0) {
        const validImages = [];

        for (const asset of result.assets) {
          if (asset.uri) {
            console.log('Asset info:', {
              uri: asset.uri,
              fileSize: asset.fileSize,
              type: asset.type,
              width: asset.width,
              height: asset.height
            });
            validImages.push(asset.uri);
          } else {
            console.warn('Invalid asset detected:', asset);
          }
        }

        if (validImages.length > 0) {
          setImages(prev => {
            const combined = [...prev, ...validImages];
            return combined.slice(0, 8);
          });
          Alert.alert('Success', `${validImages.length} image(s) added.`);
        } else {
          Alert.alert('Error', 'All selected images were invalid.');
        }
      } else if (result.canceled) {
        console.log('Image selection canceled');
      } else {
        Alert.alert('Error', 'No images selected.');
      }

    } catch (error) {
      console.error('Error picking images:', error);
      Alert.alert('Error', 'Failed to pick images.');
    }
  }

  function removeImage(index) {
    setImages(prev => prev.filter((_, i) => i !== index));
  }

  // Simple FormData upload function
  async function uploadImageWithFormData(uri, path) {
    try {
      console.log(`Uploading image: ${uri}`);
      
      const formData = new FormData();
      
      // Get file extension
      const fileExtension = uri.split('.').pop()?.toLowerCase() || 'jpg';
      const mimeType = fileExtension === 'png' ? 'image/png' : 'image/jpeg';
      
      // Create file object for FormData
      formData.append('file', {
        uri: uri,
        type: mimeType,
        name: `upload.${fileExtension}`,
      });

      console.log(`Uploading to path: ${path} with type: ${mimeType}`);

      // Upload using Supabase storage
      const { data, error: uploadError } = await supabase
        .storage
        .from('house-images')
        .upload(path, formData, {
          contentType: mimeType,
          upsert: false,
          cacheControl: '3600',
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      console.log('Upload successful:', data);

      // Get public URL
      const { data: { publicUrl } } = supabase
        .storage
        .from('house-images')
        .getPublicUrl(path);

      console.log('Public URL:', publicUrl);
      return publicUrl;
      
    } catch (error) {
      console.error('FormData upload error:', error);
      throw error;
    }
  }

  async function uploadHouse() {
    if (!title.trim() || !desc.trim() || !phone.trim()) {
      Alert.alert('Missing Fields', 'Fill in all required fields.');
      return;
    }

    if (images.length === 0) {
      Alert.alert('No Images', 'Please add at least one image.');
      return;
    }

    try {
      setLoading(true);
      setProgress(0);

      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) {
        console.error('Auth error:', authError);
        throw authError;
      }

      const imageUrls = [];

      for (let i = 0; i < images.length; i++) {
        const uri = images[i];
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8);
        const ext = uri.split('.').pop()?.toLowerCase() || 'jpg';
        const path = `houses/${timestamp}_${random}_${i}.${ext}`;

        try {
          console.log(`Processing image ${i + 1}/${images.length}`);
          
          const publicUrl = await uploadImageWithFormData(uri, path);
          imageUrls.push(publicUrl);
          
          // Update progress
          const currentProgress = Math.round(((i + 1) / images.length) * 100);
          setProgress(currentProgress);
          console.log(`Progress: ${currentProgress}%`);
          
        } catch (imageError) {
          console.error(`Error processing image ${i + 1}:`, imageError);
          throw new Error(`Failed to upload image ${i + 1}: ${imageError.message}`);
        }
      }

      console.log('All images uploaded successfully:', imageUrls);

      // Insert house record
      const { error: insertError } = await supabase.from('houses').insert([{
        title: title.trim(),
        description: desc.trim(),
        image_url: imageUrls[0],
        phone: phone.trim(),
        created_at: new Date().toISOString(),
        ...(user && { user_id: user.id })
      }]);

      if (insertError) {
        console.error('Database insert error:', insertError);
        throw insertError;
      }

      Alert.alert('Success', 'Property listed successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);

      // Reset form
      setTitle('');
      setDesc('');
      setPhone('');
      setImages([]);
      setProgress(0);

    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Upload Failed', error.message || 'Please try again.');
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
      />

      <TextInput
        placeholder="Property Description *"
        value={desc}
        onChangeText={setDesc}
        multiline
        numberOfLines={4}
        style={[styles.input, styles.descInput]}
      />

      <TextInput
        placeholder="Contact Phone Number *"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        style={styles.input}
      />

      <View style={styles.imageSection}>
        <Text style={styles.sectionTitle}>Property Images ({images.length}/8)</Text>
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
              <Image source={{ uri }} style={styles.image} />
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => removeImage(index)}
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
        style={[styles.submitButton, (loading || images.length === 0) && styles.disabledButton]}
        onPress={uploadHouse}
        disabled={loading || images.length === 0}
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
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
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
    aspectRatio: 4 / 3,
    borderRadius: 8,
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 4,
  },
  submitButton: {
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
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