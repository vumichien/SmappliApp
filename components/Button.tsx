import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
};

export default function Button({ label, onPress, variant = 'secondary', disabled = false }: Props) {
  return (
    <View style={styles.buttonContainer}>
      <Pressable 
        style={[
          styles.button,
          variant === 'primary' ? styles.primaryButton : styles.secondaryButton,
          disabled && styles.disabledButton
        ]} 
        onPress={onPress}
        disabled={disabled}
      >
        <Text style={[
          styles.buttonLabel,
          variant === 'primary' ? styles.primaryLabel : styles.secondaryLabel,
          disabled && styles.disabledLabel
        ]}>
          {label}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 320,
    height: 68,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
    marginVertical: 8,
  },
  button: {
    borderRadius: 10,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#ffd33d',
    borderWidth: 2,
    borderColor: '#ffd33d',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#fff',
  },
  disabledButton: {
    backgroundColor: '#666',
    borderColor: '#666',
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryLabel: {
    color: '#25292e',
  },
  secondaryLabel: {
    color: '#fff',
  },
  disabledLabel: {
    color: '#999',
  },
});
