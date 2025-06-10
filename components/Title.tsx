import { StyleSheet, Text } from 'react-native';

type Props = {
  text: string;
  size?: 'small' | 'medium' | 'large';
  color?: string;
};

export default function Title({ text, size = 'medium', color = '#fff' }: Props) {
  return (
    <Text style={[
      styles.title,
      styles[size],
      { color }
    ]}>
      {text}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  small: {
    fontSize: 16,
  },
  medium: {
    fontSize: 24,
  },
  large: {
    fontSize: 32,
  },
}); 