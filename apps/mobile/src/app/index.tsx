import { useAuthStore } from "$/stores/authStore";
import { Redirect } from "expo-router";
import { LogBox } from "react-native";

// LogBox.ignoreAllLogs();
LogBox.ignoreLogs(['Failed prop type: Invalid prop `textStyle` of type `array` supplied to `Cell`, expected `object`.'])

export default function Index() {
  const username = useAuthStore((state) => state.username);
  const apiUri = useAuthStore((state) => state.apiUri);

  return !!username && !!apiUri ? (
    <Redirect href="/authenticated" />
  ) : (
    <Redirect href="/unauthenticated" />
  );
}