import { Image } from 'expo-image';
import { Dimensions, ImageSourcePropType, StyleSheet } from 'react-native';

type Props = {
  imgSource: ImageSourcePropType;
  width?: number;
  height?: number;
  borderRadius?: number;
};

export default function ImageViewer({ 
  imgSource, 
  width, 
  height, 
  borderRadius = 18 
}: Props) {
  // Get screen dimensions for default sizing
  const screenWidth = Dimensions.get('window').width;
  const defaultWidth = width || screenWidth; // Full screen width if not specified
  const defaultHeight = height || (defaultWidth * 0.6); // 5:3 aspect ratio
  
  return (
    <Image 
      source={imgSource} 
      style={[
        styles.image,
        {
          width: defaultWidth,
          height: defaultHeight,
          borderRadius,
        }
      ]} 
    />
  );
}

const styles = StyleSheet.create({
  image: {
    resizeMode: 'cover',
  },
});
