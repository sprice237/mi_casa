import { useAuthStore } from '$/stores/authStore';
import { Redirect, Stack } from 'expo-router';

export default function AuthLayout() {
  const auth = useAuthStore((state) => state.auth);

  if (auth) {
    return <Redirect href="/authenticated" />
  }

  return (
    <Stack initialRouteName="index" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerTitle: 'Sign in' }} />
      <Stack.Screen name="settings" options={{ headerTitle: 'Settings', headerShown: true }} />
    </Stack>
  );
}