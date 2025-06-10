// Web-specific clipboard implementation
export const copyToClipboard = async (text: string): Promise<void> => {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else if (typeof document !== 'undefined') {
      // Fallback for older browsers or non-secure contexts
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      textArea.remove();
    } else {
      throw new Error('Clipboard API not available');
    }
  } catch (error) {
    throw new Error('Không thể copy vào clipboard');
  }
};

export const getFromClipboard = async (): Promise<string> => {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard && window.isSecureContext) {
      return await navigator.clipboard.readText();
    } else {
      // Web fallback - return empty string as we can't read clipboard
      return '';
    }
  } catch (error) {
    return '';
  }
}; 