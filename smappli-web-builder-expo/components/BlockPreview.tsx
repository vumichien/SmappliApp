import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Block, ButtonBlock, GalleryBlock, ImageBlock, TextBlock, TitleBlock } from '../types/blocks';

interface BlockPreviewProps {
  block: Block;
  isSelected?: boolean;
  onPress?: () => void;
}

/**
 * Component to preview different block types
 * Renders blocks matching exactly the mobile app format
 */
const BlockPreview: React.FC<BlockPreviewProps> = ({ block, isSelected, onPress }) => {
  const renderBlock = () => {
    switch (block.type) {
      case 'title':
        return <TitlePreview block={block as TitleBlock} />;
      case 'text':
        return <TextPreview block={block as TextBlock} />;
      case 'image':
        return <ImagePreview block={block as ImageBlock} />;
      case 'button':
        return <ButtonPreview block={block as ButtonBlock} />;
      case 'gallery':
        return <GalleryPreview block={block as GalleryBlock} />;
      default:
        return <Text style={styles.errorText}>Unknown block type</Text>;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isSelected && styles.selected,
        block.style && {
          backgroundColor: block.style.backgroundColor || 'transparent',
          padding: block.style.padding,
          margin: block.style.margin,
          borderRadius: block.style.borderRadius,
        }
      ]}
      onPress={onPress}
    >
      {renderBlock()}
    </TouchableOpacity>
  );
};

const TitlePreview: React.FC<{ block: TitleBlock }> = ({ block }) => {
  const getFontSize = (size?: string) => {
    switch (size) {
      case 'small': return 18;
      case 'large': return 32;
      default: return 24; // medium
    }
  };

  return (
    <Text
      style={[
        styles.title,
        {
          fontSize: getFontSize(block.size),
          color: block.color || '#FFFFFF',
          textAlign: block.style?.textAlign || 'center',
        }
      ]}
    >
      {block.text}
    </Text>
  );
};

const TextPreview: React.FC<{ block: TextBlock }> = ({ block }) => (
  <Text
    style={[
      styles.text,
      {
        fontSize: block.fontSize || 16,
        color: block.color || '#B0B0B0',
        textAlign: block.textAlign || 'left',
      }
    ]}
  >
    {block.content}
  </Text>
);

const ImagePreview: React.FC<{ block: ImageBlock }> = ({ block }) => {
  return (
    <Image
      source={{ 
        uri: block.source.startsWith('@/') 
          ? 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop' 
          : block.source 
      }}
      style={[
        styles.image,
        { 
          borderRadius: block.borderRadius || 12,
        }
      ]}
      resizeMode="cover"
    />
  );
};

const ButtonPreview: React.FC<{ block: ButtonBlock }> = ({ block }) => {
  const getTitleFontSize = (size?: string) => {
    switch (size) {
      case 'small': return 16;
      case 'large': return 24;
      default: return 20; // medium
    }
  };

  const getButtonStyle = (variant?: string) => {
    switch (variant) {
      case 'primary':
        return { 
          backgroundColor: '#F1C40F', 
          textColor: '#2C3E50',
          borderWidth: 0,
          borderColor: 'transparent'
        };
      case 'secondary':
        return { 
          backgroundColor: 'transparent', 
          textColor: '#FFFFFF',
          borderWidth: 2,
          borderColor: '#FFFFFF'
        };
      case 'outline':
        return { 
          backgroundColor: 'transparent', 
          textColor: '#FFFFFF',
          borderWidth: 2,
          borderColor: '#FFFFFF'
        };
      default:
        return { 
          backgroundColor: '#F1C40F', 
          textColor: '#2C3E50',
          borderWidth: 0,
          borderColor: 'transparent'
        };
    }
  };

  return (
    <View style={styles.buttonContainer}>
      {block.title && (
        <Text
          style={[
            styles.buttonTitle,
            {
              fontSize: getTitleFontSize(block.titleSize),
              color: block.titleColor || '#FFFFFF',
              marginBottom: 16,
            }
          ]}
        >
          {block.title}
        </Text>
      )}
      <View style={styles.buttonList}>
        {block.buttons.map((button, index) => {
          const buttonStyle = getButtonStyle(button.variant);
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.button,
                {
                  backgroundColor: buttonStyle.backgroundColor,
                  borderWidth: buttonStyle.borderWidth,
                  borderColor: buttonStyle.borderColor,
                  marginBottom: index < block.buttons.length - 1 ? 12 : 0,
                }
              ]}
            >
              <Text
                style={[
                  styles.buttonText,
                  { color: buttonStyle.textColor }
                ]}
              >
                {button.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const GalleryPreview: React.FC<{ block: GalleryBlock }> = ({ block }) => {
  const getTitleFontSize = (size?: string) => {
    switch (size) {
      case 'small': return 16;
      case 'large': return 24;
      default: return 20; // medium
    }
  };

  // Fixed 3x2 grid layout like in mobile app
  const renderGalleryGrid = () => {
    const images = block.images.slice(0, 6); // Show max 6 images like in mobile app
    const rows = [];
    
    for (let i = 0; i < images.length; i += 3) {
      const rowImages = images.slice(i, i + 3);
      rows.push(
        <View key={i} style={styles.galleryRow}>
          {rowImages.map((image, index) => (
            <View key={index} style={styles.galleryImageWrapper}>
              <Image
                source={{ 
                  uri: image.source.startsWith('@/') 
                    ? 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=150&h=150&fit=crop' 
                    : image.source 
                }}
                style={styles.galleryImage}
                resizeMode="cover"
              />
            </View>
          ))}
          {/* Fill empty slots in row */}
          {rowImages.length < 3 && Array.from({ length: 3 - rowImages.length }).map((_, emptyIndex) => (
            <View key={`empty-${emptyIndex}`} style={styles.galleryImageWrapper}>
              <View style={[styles.galleryImage, styles.emptyGalleryImage]} />
            </View>
          ))}
        </View>
      );
    }
    
    return rows;
  };

  return (
    <View style={styles.galleryContainer}>
      {block.title && (
        <Text
          style={[
            styles.galleryTitle,
            {
              fontSize: getTitleFontSize(block.titleSize),
              color: block.titleColor || '#FFFFFF',
              marginBottom: 16,
            }
          ]}
        >
          {block.title}
        </Text>
      )}
      <View style={styles.galleryGrid}>
        {renderGalleryGrid()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    padding: 0,
    marginVertical: 6,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selected: {
    borderColor: '#007AFF',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFFFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  text: {
    lineHeight: 22,
    color: '#B0B0B0',
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  buttonContainer: {
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  buttonTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFFFF',
  },
  buttonList: {
    width: '100%',
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius:10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  galleryContainer: {
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  galleryTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFFFF',
  },
  galleryGrid: {
    width: '100%',
  },
  galleryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  galleryImageWrapper: {
    flex: 1,
    marginHorizontal: 4,
  },
  galleryImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
    backgroundColor: '#1a1f24',
  },
  emptyGalleryImage: {
    backgroundColor: '#1a1f24',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
    padding: 15,
  },
});

export default BlockPreview; 