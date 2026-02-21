import { useAuthStore } from '$/stores/authStore';
import { useRegisterTitle } from '$/stores/titleStore';
import { StyleSheet, Text, View } from 'react-native';

export default function Me() {
  useRegisterTitle('Me');

  const username = useAuthStore((state) => state.username);

  if (!username) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text>Welcome, {username}!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});