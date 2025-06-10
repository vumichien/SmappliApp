import { Image } from 'expo-image';
import { ImageSourcePropType, StyleSheet, View } from 'react-native';

type Props = {
  source: ImageSourcePropType;
  size?: 'small' | 'medium' | 'large';
  shape?: 'square' | 'circle' | 'rounded';
  style?: any;
};

export default function AppImage({ 
  source, 
  size = 'medium', 
  shape = 'rounded',
  style 
}: Props) {
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

  return (
    <View style={[styles.container, style]}>
      <Image 
        source={source} 
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
}); 