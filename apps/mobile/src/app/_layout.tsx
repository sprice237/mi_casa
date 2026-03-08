import { Stack } from 'expo-router';
import 'react-native-reanimated';
import { SplashGuard } from '../components/SplashGuard';
import { useDeviceStore } from '$/stores/deviceStore';

export default function RootLayout() {
  const deviceStoreLoaded = useDeviceStore(x => x.isLoaded);

  const loaded = deviceStoreLoaded;

  return (
    <SplashGuard loaded={loaded}>
      <Stack screenOptions={{ headerShown: false }} />
    </SplashGuard>
  );
}