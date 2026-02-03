import { useAuthStore } from '$/stores/authStore';
import { Redirect, Stack } from 'expo-router';

export default function AuthLayout() {
  const username = useAuthStore((state) => state.username);

  if (username) {
    return <Redirect href="/authenticated/drawer/(tabs)/me" />
  }

  return (
    <Stack initialRouteName="signIn">
      <Stack.Screen name="signIn" options={{ headerShown: false }} />
      {/* <Stack.Screen name="register" options={{ headerBackTitle: "Back", title: 'Register' }} /> */}
    </Stack>
  );
}