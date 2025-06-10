import { Dimensions, StyleSheet, View } from 'react-native';
import ImageViewer from '../ImageViewer';

export interface ImageBlockData {
  type: 'image';
  source: string; // path to image or require()
  width?: number;
  height?: number;
  borderRadius?: number;
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
  const { source, width, height, borderRadius, style } = data;
  
  // Get screen width for responsive design
  const screenWidth = Dimensions.get('window').width;
  
  // Calculate only the margin from style (not padding since we want image to fill the block)
  const containerMargin = (style?.margin || 0) * 2; // margin on both sides
  
  // Calculate available width for image (full width minus only margins)
  const availableWidth = screenWidth - containerMargin;
  
  // Calculate responsive dimensions
  const imageWidth = width || availableWidth;
  const imageHeight = height || (imageWidth * 0.6); // 5:3 aspect ratio for better proportions
  
  // Handle both require() paths and direct image sources
  const imageSource = source.startsWith('@/') 
    ? require(`../../assets/images/background-image.png`) // fallback for now
    : { uri: source };
  
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
        imgSource={imageSource}
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
}); 