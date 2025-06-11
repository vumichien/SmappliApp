import { ImageService } from '@/services/ImageService';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { ImageSourcePropType, StyleSheet, Text, View } from 'react-native';

type Props = {
  source: ImageSourcePropType | string;
  size?: 'small' | 'medium' | 'large';
  shape?: 'square' | 'circle' | 'rounded';
  imageId?: string; // ID for locally stored images
  style?: any;
};

export default function AppImage({ 
  source, 
  size = 'medium', 
  shape = 'rounded',
  imageId,
  style 
}: Props) {
  const [localImageUri, setLocalImageUri] = useState<string | null>(null);

  const sizeStyles = {
    small: { width: 80, height: 80 },
    medium: { width: 150, height: 150 },
    large: { width: 250, height: 250 },
  };

  const shapeStyles = {
    square: { borderRadius: 0 },
    circle: { borderRadius: sizeStyles[size].width / 2 },
    rounded: { borderRadius: 12 },
  };

  // Check if we have a real image
  const hasRealImage = source && 
    (typeof source === 'string' ? source.trim() !== '' : true) &&
    (typeof source === 'string' ? !source.startsWith('@/') : true);

  // Load local image if source uses local:// protocol
  useEffect(() => {
    const loadLocalImage = async () => {
      if (typeof source === 'string' && source.startsWith('local://')) {
        const localImageId = source.replace('local://', '') || imageId;
        if (localImageId) {
          try {
            const imageData = await ImageService.getImage(localImageId);
            if (imageData && imageData.base64) {
              const dataUri = `data:image/jpeg;base64,${imageData.base64}`;
              setLocalImageUri(dataUri);
            }
          } catch (error) {
            console.error('Failed to load local image:', localImageId, error);
          }
        }
      }
    };

    loadLocalImage();
  }, [source, imageId]);

  // Show placeholder if no real image
  if (!hasRealImage && !localImageUri) {
    return (
      <View style={[
        styles.container, 
        styles.placeholderContainer,
        sizeStyles[size],
        shapeStyles[shape],
        { backgroundColor: '#1a1f24' },
        style
      ]}>
        <Text style={[styles.placeholderIcon, { fontSize: sizeStyles[size].width * 0.3 }]}>🖼️</Text>
      </View>
    );
  }

  // Determine image source
  const getImageSource = (): ImageSourcePropType => {
    if (typeof source === 'string' && source.startsWith('local://') && localImageUri) {
      return { uri: localImageUri };
    } else if (typeof source === 'string') {
      return { uri: source };
    } else {
      return source as ImageSourcePropType;
    }
  };

  return (
    <View style={[styles.container, style]}>
      <Image 
        source={getImageSource()} 
        style={[
          styles.image,
          sizeStyles[size],
          shapeStyles[shape],
        ]} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8,
  },
  image: {
    resizeMode: 'cover',
  },
  placeholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderIcon: {
    fontSize: 50,
  },
}); 