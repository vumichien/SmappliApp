import { BlockProvider } from '@/contexts/BlockContext';
import { Stack } from 'expo-router';

// Suppress React Native Web warnings
if (typeof window !== 'undefined') {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (args[0]?.includes?.('pointerEvents is deprecated')) {
      return; // Suppress this specific warning
    }
    originalWarn.apply(console, args);
  };
}

export default function RootLayout() {
  return (
    <BlockProvider>
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
    </BlockProvider>
  );
}

