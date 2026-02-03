import { StyleSheet, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { StyledButton } from '$/components/StyledButton';
import { StyledTextInput } from '$/components/StyledTextInput';
import { useAuthStore } from '$/stores/authStore';
import { useState } from 'react';

export default function SignIn() {
  const updateUsername = useAuthStore((state) => state.updateUsername);
  const [workingUsername, setWorkingUsername] = useState<string>('');

  const onSubmit = async () => {
    updateUsername(workingUsername);
  };

  return (
    <View style={styles.background}>
      <View style={styles.container}>
        <StyledTextInput
          placeholder="username"
          value={workingUsername}
          onChangeText={setWorkingUsername}
          style={{ textAlign: 'center' }}
        />
        <StyledButton text="Sign in" onPress={onSubmit} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  container: {
    width: 400,
    maxWidth: '100%',
    padding: 20,
    display: 'flex',
    gap: 20,
  },
  logoContainer: {
    width: '100%',
  },
  logo: {
    width: null,
  },
  textInput: {
    height: 40,
    width: '100%',
    borderWidth: 1,
    padding: 10,
    textAlign: 'center',
  },
});