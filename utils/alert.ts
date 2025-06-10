import { Alert, Platform } from 'react-native';

export const showAlert = (title: string, message: string, buttons?: any[]) => {
  console.log('showAlert called:', title, message);
  
  if (Platform.OS === 'web') {
    // For web, use browser confirm dialog
    const fullMessage = `${title}\n\n${message}`;
    if (buttons && buttons.length > 1) {
      const result = window.confirm(fullMessage);
      // Call the appropriate button callback
      if (result && buttons[1]?.onPress) {
        buttons[1].onPress();
      } else if (!result && buttons[0]?.onPress) {
        buttons[0].onPress();
      }
    } else {
      window.alert(fullMessage);
    }
  } else {
    // For native, use React Native Alert
    Alert.alert(title, message, buttons);
  }
};

export const showSimpleAlert = (title: string, message: string) => {
  console.log('showSimpleAlert called:', title, message);
  
  if (Platform.OS === 'web') {
    // For web, use browser alert directly
    const fullMessage = `${title}\n\n${message}`;
    window.alert(fullMessage);
  } else {
    // For native, use React Native Alert
    Alert.alert(title, message);
  }
}; 