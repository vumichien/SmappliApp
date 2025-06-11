import { ImageService } from '@/services/ImageService';
import { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import ImageViewer from '../ImageViewer';

export interface ImageBlockData {
  type: 'image';
  source: string; // path to image, require(), or local://imageId
  width?: number;
  height?: number;
  borderRadius?: number;
  imageId?: string; // ID for locally stored images
  style?: {
    backgroundColor?: string;
    padding?: number;
    margin?: number;
    borderRadius?: number;
  };
}

interface Props {
  data: ImageBlockData;
}

export default function ImageBlock({ data }: Props) {
  const { source, width, height, borderRadius, style, imageId } = data;
  const [localImageUri, setLocalImageUri] = useState<string | null>(null);
  
  // Get screen width for responsive design
  const screenWidth = Dimensions.get('window').width;
  
  // Calculate only the margin from style (not padding since we want image to fill the block)
  const containerMargin = (style?.margin || 0) * 2; // margin on both sides
  
  // Calculate available width for image (full width minus only margins)
  const availableWidth = screenWidth - containerMargin;
  
  // Calculate responsive dimensions
  const imageWidth = width || availableWidth;
  const imageHeight = height || (imageWidth * 0.6); // 5:3 aspect ratio for better proportions
  
  // Check if we have a real image
  const hasRealImage = source && 
    source.trim() !== '' && 
    !source.startsWith('@/');
  
  // Load local image if source uses local:// protocol
  useEffect(() => {
    const loadLocalImage = async () => {
      if (source.startsWith('local://')) {
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
        {
          width: imageWidth,
          height: imageHeight,
          borderRadius: borderRadius || style?.borderRadius || 10,
        },
        style && {
          backgroundColor: style.backgroundColor,
          padding: style.padding,
          margin: style.margin,
          borderRadius: style.borderRadius,
        }
      ]}>
        <Text style={styles.placeholderIcon}>🖼️</Text>
        <Text style={styles.placeholderText}>No Image</Text>
      </View>
    );
  }
  
  // Determine image source
  const getImageSource = () => {
    if (source.startsWith('local://') && localImageUri) {
      return { uri: localImageUri };
    } else if (source.startsWith('@/')) {
      return require(`../../assets/images/background-image.png`); // fallback
    } else {
      return { uri: source };
    }
  };
  
  return (
    <View style={[
      styles.container,
      style && {
        backgroundColor: style.backgroundColor,
        padding: style.padding,
        margin: style.margin,
        borderRadius: style.borderRadius,
      }
    ]}>
      <ImageViewer 
        imgSource={getImageSource()}
        width={imageWidth}
        height={imageHeight}
        borderRadius={borderRadius || style?.borderRadius}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    // Removed padding to let image fill the block
  },
  placeholderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 