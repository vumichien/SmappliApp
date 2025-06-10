import { StyleSheet, View } from 'react-native';
import Title from '../Title';

export interface TitleBlockData {
  type: 'title';
  text: string;
  size?: 'small' | 'medium' | 'large';
  color?: string;
  style?: {
    backgroundColor?: string;
    padding?: number;
    margin?: number;
    borderRadius?: number;
  };
}

interface Props {
  data: TitleBlockData;
}

export default function TitleBlock({ data }: Props) {
  const { text, size, color, style } = data;
  
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
      <Title text={text} size={size} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
}); 