import { useAuthStore } from '$/stores/authStore';
import { Redirect, Stack } from 'expo-router';

export default function AuthLayout() {
  const username = useAuthStore((state) => state.username);
  const apiUri = useAuthStore((state) => state.apiUri);

  if (username && apiUri) {
    return <Redirect href="/authenticated" />
  }

  return (
    <Stack initialRouteName="index" screenOptions={{ headerShown: false }} />
  );
}