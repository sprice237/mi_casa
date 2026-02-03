import { StatusDocument } from '$/gql';
import { useAuthStore } from '$/stores/authStore';
import { useRegisterTitle } from '$/stores/titleStore';
import { useSuspenseQuery } from '@apollo/client/react';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function Me() {
  useRegisterTitle('Me');

  const { version } = useSuspenseQuery(StatusDocument).data.status
  console.log('version', version);

  const username = useAuthStore((state) => state.username);
  const updateUsername = useAuthStore((state) => state.updateUsername);


  const onLogOut = () => {
    updateUsername(null);
  };

  if (!username) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text>Welcome, {username}!</Text>
      <Button title="Log out" onPress={onLogOut} />
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