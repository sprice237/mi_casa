import { Stack } from 'expo-router';
import 'react-native-reanimated';
import { SplashGuard } from '../components/SplashGuard';
import { useDeviceStore } from '$/stores/deviceStore';

import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  environment: process.env.EXPO_PUBLIC_SENTRY_ENVIRONMENT,

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,
  integrations: [Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

function RootLayout() {
  const deviceStoreLoaded = useDeviceStore(x => x.isLoaded);
  const authStoreLoaded = useDeviceStore(x => x.isLoaded);

  const loaded = deviceStoreLoaded && authStoreLoaded;

  return (
    <SplashGuard loaded={loaded}>
      <Stack screenOptions={{ headerShown: false }} />
    </SplashGuard>
  );
}

export default Sentry.wrap(RootLayout);