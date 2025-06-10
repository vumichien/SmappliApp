import { StyleSheet, View } from 'react-native';
import AppImage from '../AppImage';
import Title from '../Title';

export interface GalleryItem {
  source: string;
  size?: 'small' | 'medium' | 'large';
  shape?: 'square' | 'circle' | 'rounded';
}

export interface GalleryBlockData {
  type: 'gallery';
  title?: string;
  titleSize?: 'small' | 'medium' | 'large';
  titleColor?: string;
  images: GalleryItem[];
  columns?: number;
  style?: {
    backgroundColor?: string;
    padding?: number;
    margin?: number;
    borderRadius?: number;
  };
}

interface Props {
  data: GalleryBlockData;
}

export default function GalleryBlock({ data }: Props) {
  const { title, titleSize, titleColor, images, columns = 3, style } = data;
  
  // Group images into rows
  const rows = [];
  for (let i = 0; i < images.length; i += columns) {
    rows.push(images.slice(i, i + columns));
  }
  
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
      {title && (
        <Title text={title} size={titleSize} color={titleColor} />
      )}
      
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((item, itemIndex) => {
            const imageSource = item.source.startsWith('@/') 
              ? require(`../../assets/images/background-image.png`) // fallback
              : { uri: item.source };
              
            return (
              <AppImage
                key={itemIndex}
                source={imageSource}
                size={item.size || 'small'}
                shape={item.shape || 'rounded'}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 5,
  },
}); 