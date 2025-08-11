import React, { useState, useEffect } from 'react';
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
import { COLORS, PrimaryGradient, SuccessGradient, OceanGradient, ModernGradient } from '../components/GradientView';

export default function AddHouseScreen({ navigation, route }) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [phone, setPhone] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [paymentId, setPaymentId] = useState(null);

  useEffect(() => {
    if (route.params) {
      setPaymentCompleted(route.params.paymentCompleted || false);
      setPaymentId(route.params.paymentId || null);
      
      // Log the payment status for debugging
      console.log('Payment status:', {
        paymentCompleted: route.params.paymentCompleted,
        paymentId: route.params.paymentId
      });
    }
    
    // Check if database tables exist
    checkDatabaseTables();
  }, [route.params]);

  const checkDatabaseTables = async () => {
    try {
      console.log('Checking database tables...');
      
      // Check if houses table exists
      const { data: housesTest, error: housesError } = await supabase
        .from('houses')
        .select('id')
        .limit(1);
      
      if (housesError) {
        console.error('Houses table check failed:', housesError);
        if (housesError.code === '42P01') {
          Alert.alert(
            'Database Setup Required',
            'The houses table does not exist. Please run the database schema first.',
            [{ text: 'OK' }]
          );
        }
      } else {
        console.log('Houses table exists and is accessible');
      }
      
      // Check if user_profiles table exists
      const { data: profilesTest, error: profilesError } = await supabase
        .from('user_profiles')
        .select('id')
        .limit(1);
      
      if (profilesError) {
        console.error('User profiles table check failed:', profilesError);
      } else {
        console.log('User profiles table exists and is accessible');
      }
      
    } catch (error) {
      console.error('Database check error:', error);
    }
  };

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

      console.log('Starting house upload...');
      console.log('Payment status:', { paymentCompleted, paymentId });

      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) {
        console.error('Auth error:', authError);
        throw authError;
      }

      console.log('User authenticated:', user?.id);

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
      const houseDataToInsert = {
        title: title.trim(),
        description: desc.trim(),
        images: imageUrls, // Changed from image_url to images array
        phone: phone.trim(),
        user_id: user.id,
        is_verified: false, // Default to false for admin review
        status: 'active'
        // Removed created_at as it has a default value in the schema
      };

      console.log('Inserting house data:', houseDataToInsert);

      const { data: houseData, error: insertError } = await supabase
        .from('houses')
        .insert([houseDataToInsert])
        .select()
        .single();

      if (insertError) {
        console.error('Database insert error:', insertError);
        console.error('Error details:', {
          code: insertError.code,
          message: insertError.message,
          details: insertError.details,
          hint: insertError.hint
        });
        throw insertError;
      }

      console.log('House inserted successfully:', houseData);

      // Show appropriate success message based on payment status
      const successMessage = paymentCompleted 
        ? 'Property listed successfully! Payment has been processed.'
        : 'Property listed successfully! (Payment skipped)';
      
      Alert.alert('Success', successMessage, [
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
      let errorMessage = 'Upload failed. Please try again.';
      
      if (error.code === '42P01') {
        errorMessage = 'Database table not found. Please contact support.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Upload Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header Section */}
      <PrimaryGradient style={styles.header}>
        <Ionicons name="home" size={32} color="white" />
        <Text style={styles.headerTitle}>Add Your Property</Text>
        <Text style={styles.headerSubtitle}>Share your space with travelers</Text>
      </PrimaryGradient>

      {/* Form Section */}
      <View style={styles.formSection}>
        <TextInput
          placeholder="Property Title *"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
          placeholderTextColor={COLORS.textSecondary}
        />

        <TextInput
          placeholder="Property Description *"
          value={desc}
          onChangeText={setDesc}
          multiline
          numberOfLines={4}
          style={[styles.input, styles.descInput]}
          placeholderTextColor={COLORS.textSecondary}
        />

        <TextInput
          placeholder="Contact Phone Number *"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          style={styles.input}
          placeholderTextColor={COLORS.textSecondary}
        />

        {/* Payment Status Indicator */}
        <View style={styles.paymentStatusContainer}>
          <View style={[
            styles.paymentStatusBadge,
            { backgroundColor: paymentCompleted ? COLORS.success : COLORS.warning }
          ]}>
            <Ionicons 
              name={paymentCompleted ? "checkmark-circle" : "information-circle"} 
              size={16} 
              color="white" 
              style={{ marginRight: 5 }}
            />
            <Text style={styles.paymentStatusText}>
              {paymentCompleted ? 'Payment Completed' : 'Payment Skipped'}
            </Text>
          </View>
          {!paymentCompleted && (
            <Text style={styles.paymentStatusNote}>
              You can upload your property without payment for now
            </Text>
          )}
        </View>

        {/* Database Status Check */}
        <TouchableOpacity
          style={styles.dbCheckButton}
          onPress={checkDatabaseTables}
        >
          <ModernGradient style={styles.dbCheckGradient}>
            <Ionicons name="database" size={16} color="white" style={{ marginRight: 5 }} />
            <Text style={styles.dbCheckButtonText}>Check Database Connection</Text>
          </ModernGradient>
        </TouchableOpacity>
      </View>

      {/* Image Section */}
      <View style={styles.imageSection}>
        <View style={styles.imageSectionHeader}>
          <Text style={styles.sectionTitle}>Property Images ({images.length}/8)</Text>
          <TouchableOpacity
            style={[styles.addButton, images.length >= 8 && styles.disabledButton]}
            onPress={pickImages}
            disabled={images.length >= 8}
          >
            <OceanGradient style={styles.addButtonGradient}>
              <Ionicons name="camera" size={16} color="white" style={{ marginRight: 5 }} />
              <Text style={styles.buttonText}>
                {images.length >= 8 ? 'Max Reached' : 'Add Images'}
              </Text>
            </OceanGradient>
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
                  <Ionicons name="close" size={18} color="white" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Progress Section */}
      {loading && (
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>Uploading: {progress}%</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        </View>
      )}

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, (loading || images.length === 0) && styles.disabledButton]}
        onPress={uploadHouse}
        disabled={loading || images.length === 0}
      >
        <SuccessGradient style={styles.submitButtonGradient}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="white" size="small" />
              <Text style={[styles.buttonText, { marginLeft: 10 }]}>Uploading...</Text>
            </View>
          ) : (
            <>
              <Ionicons name="cloud-upload" size={20} color="white" style={{ marginRight: 8 }} />
              <Text style={styles.buttonText}>Submit Property</Text>
            </>
          )}
        </SuccessGradient>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    minHeight: '100%',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 16,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  formSection: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  descInput: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  paymentStatusContainer: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    shadowColor: COLORS.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  paymentStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  paymentStatusText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  paymentStatusNote: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 8,
  },
  dbCheckButton: {
    marginBottom: 20,
  },
  dbCheckGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  dbCheckButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  imageSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  imageSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  addButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  disabledButton: {
    opacity: 0.5,
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
  },
  imageWrapper: {
    width: '48%',
    marginBottom: 15,
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: COLORS.shadow.medium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  image: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: 12,
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: COLORS.error,
    borderRadius: 12,
    padding: 6,
    shadowColor: COLORS.shadow.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  progressText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
    textAlign: 'center',
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.lightGray,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  submitButton: {
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: COLORS.shadow.success,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  submitButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});