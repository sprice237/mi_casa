import { Stack } from 'expo-router';
import { useState } from 'react';
import 'react-native-reanimated';
import { SplashGuard } from '../components/SplashGuard';

export default function RootLayout() {
  const [loaded] = useState(true);

  return (
    <SplashGuard loaded={loaded}>
      <Stack screenOptions={{ headerShown: false }} />
    </SplashGuard>
  );
}