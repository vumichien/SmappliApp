import { StyleSheet, Text, View } from 'react-native';

export interface TextBlockData {
  type: 'text';
  content: string;
  fontSize?: number;
  color?: string;
  textAlign?: 'left' | 'center' | 'right';
  style?: {
    backgroundColor?: string;
    padding?: number;
    margin?: number;
    borderRadius?: number;
  };
}

interface Props {
  data: TextBlockData;
}

export default function TextBlock({ data }: Props) {
  const { content, fontSize = 16, color = '#fff', textAlign = 'left', style } = data;
  
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
      <Text style={[
        styles.text,
        {
          fontSize,
          color,
          textAlign,
        }
      ]}>
        {content}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  text: {
    lineHeight: 24,
  },
}); 