import { showSimpleAlert } from '@/utils/alert';
import { StyleSheet, View } from 'react-native';
import Button from '../Button';
import Title from '../Title';

export interface ButtonItem {
  label: string;
  variant?: 'primary' | 'secondary';
  action?: string; // action type for handling
  message?: string; // custom alert message
}

export interface ButtonBlockData {
  type: 'button';
  title?: string;
  titleSize?: 'small' | 'medium' | 'large';
  titleColor?: string;
  buttons: ButtonItem[];
  style?: {
    backgroundColor?: string;
    padding?: number;
    margin?: number;
    borderRadius?: number;
  };
}

interface Props {
  data: ButtonBlockData;
  onButtonPress?: (action: string, button: ButtonItem) => void;
}

export default function ButtonBlock({ data, onButtonPress }: Props) {
  const { title, titleSize, titleColor, buttons, style } = data;
  
  const handlePress = (button: ButtonItem) => {
    if (onButtonPress && button.action) {
      onButtonPress(button.action, button);
    } else {
      const message = button.message || `Pressed "${button.label}"!`;
      showSimpleAlert('Notice', message);
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
      {title && (
        <Title text={title} size={titleSize} color={titleColor} />
      )}
      
      {buttons.map((button, index) => (
        <Button
          key={index}
          label={button.label}
          variant={button.variant || 'secondary'}
          onPress={() => handlePress(button)}
        />
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
}); 