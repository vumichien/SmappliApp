// Native-specific clipboard implementation
import * as ExpoClipboard from 'expo-clipboard';

export const copyToClipboard = async (text: string): Promise<void> => {
  try {
    await ExpoClipboard.setStringAsync(text);
  } catch (error) {
    throw new Error('Không thể copy vào clipboard');
  }
};

export const getFromClipboard = async (): Promise<string> => {
  try {
    return await ExpoClipboard.getStringAsync();
  } catch (error) {
    return '';
  }
}; 