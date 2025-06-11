import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ImageUploaderProps {
  onImageUploaded: (imageData: { id: string; base64: string; filename: string }) => void;
  currentImageUrl?: string;
}

/**
 * Image uploader component for web builder using Expo ImagePicker
 * Allows users to upload images from camera or gallery and converts them to base64 for storage and transmission
 */
const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUploaded, currentImageUrl }) => {
  const [isUploading, setIsUploading] = useState(false);

  const pickImageFromLibrary = async () => {
    try {
      setIsUploading(true);

      // Request permission to access media library
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera roll is required!');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8, // Reduce quality to keep file size manageable
        base64: true, // Get base64 data
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        
        // Validate file size (max 5MB)
        if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
          Alert.alert('Error', 'Image size must be less than 5MB');
          return;
        }

        if (asset.base64) {
          // Generate unique ID
          const imageId = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          
          // Create image data object
          const imageData = {
            id: imageId,
            base64: asset.base64,
            filename: asset.fileName || `image_${imageId}.jpg`
          };

          // Store in localStorage for persistence
          const existingImages = JSON.parse(localStorage.getItem('smappli_images') || '{}');
          existingImages[imageId] = {
            ...imageData,
            timestamp: new Date().toISOString(),
            synced: false,
            uri: asset.uri,
            width: asset.width,
            height: asset.height
          };
          localStorage.setItem('smappli_images', JSON.stringify(existingImages));

          // Call callback with image data
          onImageUploaded(imageData);

          console.log('Image uploaded successfully:', imageId);
        } else {
          Alert.alert('Error', 'Failed to get image data. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const takePhoto = async () => {
    try {
      setIsUploading(true);

      // Request permission to access camera
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera is required!');
        return;
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8, // Reduce quality to keep file size manageable
        base64: true, // Get base64 data
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        
        // Validate file size (max 5MB)
        if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
          Alert.alert('Error', 'Image size must be less than 5MB');
          return;
        }

        if (asset.base64) {
          // Generate unique ID
          const imageId = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          
          // Create image data object
          const imageData = {
            id: imageId,
            base64: asset.base64,
            filename: asset.fileName || `photo_${imageId}.jpg`
          };

          // Store in localStorage for persistence
          const existingImages = JSON.parse(localStorage.getItem('smappli_images') || '{}');
          existingImages[imageId] = {
            ...imageData,
            timestamp: new Date().toISOString(),
            synced: false,
            uri: asset.uri,
            width: asset.width,
            height: asset.height
          };
          localStorage.setItem('smappli_images', JSON.stringify(existingImages));

          // Call callback with image data
          onImageUploaded(imageData);

          console.log('Photo taken successfully:', imageId);
        } else {
          Alert.alert('Error', 'Failed to get photo data. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const showImagePickerOptions = () => {
    Alert.alert(
      'Select Image',
      'Choose how you want to select an image',
      [
        { text: 'Camera', onPress: takePhoto },
        { text: 'Gallery', onPress: pickImageFromLibrary },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.uploadButton, isUploading && styles.uploadButtonDisabled]}
        onPress={showImagePickerOptions}
        disabled={isUploading}
      >
        <Text style={styles.uploadIcon}>📷</Text>
        <Text style={styles.uploadText}>
          {isUploading ? 'Processing...' : 'Choose Image'}
        </Text>
      </TouchableOpacity>

      {currentImageUrl && (
        <View style={styles.currentImageContainer}>
          <Text style={styles.currentImageLabel}>Current:</Text>
          <Text style={styles.currentImageUrl} numberOfLines={1}>
            {currentImageUrl.length > 30 ? `${currentImageUrl.substring(0, 30)}...` : currentImageUrl}
          </Text>
        </View>
      )}

      <Text style={styles.helpText}>
        Take a photo or choose from gallery (max 5MB)
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  uploadButtonDisabled: {
    backgroundColor: '#8E8E93',
  },
  uploadIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  uploadText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  currentImageContainer: {
    backgroundColor: '#F0F0F0',
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  currentImageLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 2,
  },
  currentImageUrl: {
    fontSize: 12,
    color: '#333333',
    fontFamily: 'monospace',
  },
  helpText: {
    fontSize: 11,
    color: '#999999',
    textAlign: 'center',
    lineHeight: 14,
  },
});

export default ImageUploader; 