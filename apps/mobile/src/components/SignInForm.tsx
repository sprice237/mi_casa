import { Alert, StyleSheet, View } from 'react-native';

import { StyledButton } from '$/components/StyledButton';
import { StyledTextInput } from '$/components/StyledTextInput';
import { useAuthStore } from '$/stores/authStore';
import { useMutation } from '@apollo/client/react';
import { useForm } from '@tanstack/react-form';
import { useRouter } from 'expo-router';
import { useEndpointsStore } from '$/stores/endpointsStore';
import { z } from 'zod';
import { useState } from 'react';
import { FullScreenLoader } from './FullScreenLoader';

interface SignInFormValues {
  username: string;
  password: string;
}

const defaultValues: SignInFormValues = {
  username: '',
  password: ''
}

export const SignInForm = () => {
  const authApiUri = useEndpointsStore((state) => state.authApiUri);
  const updateAuth = useAuthStore((state) => state.updateAuth);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      try {
        setIsLoading(true);

        const res = await fetch(`${authApiUri}/generate-token-from-auth`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', // Indicate the content type
            'Accept': 'application/json' // Optionally, state that you expect a JSON response
          },
          body: JSON.stringify({
            username: value.username,
            password: value.password
          })
        });

        if (!res.ok) {
          if (res.status === 401) {
            Alert.alert('Bad login', 'Invalid username or password');
            return;
          }

          console.error(`Received HTTP error: ${res.status}`);
          Alert.alert('Login error', `Received HTTP error: ${res.status}`);
          return;
        }

        const responseData = await res.json();

        const { token } = z.object({
          token: z.string()
        }).parse(responseData);

        updateAuth({
          token,
          username: value.username
        });
      } catch (e) {
        console.error(e);
        if (e instanceof Error) {
          Alert.alert('Login error', `${e.name}: ${e.message}`);
        } else {
          Alert.alert('Login error', 'Received unknown error')
        }
      } finally {
        setIsLoading(false);
      }
    }
  });

  const navigateToSettings = () => {
    router.navigate('/unauthenticated/settings');
  }

  return (
    <>
      {isLoading && <FullScreenLoader message="Signing in..." />}
      <View style={styles.background}>
        <View style={styles.container}>
          <form.Field
            name="username"
            children={(field) => (
              <StyledTextInput
                placeholder="username"
                value={field.state.value}
                onChangeText={field.setValue}
                style={{ textAlign: 'center' }}
              />
            )}
          />
          <form.Field
            name="password"
            children={(field) => (
              <StyledTextInput
                placeholder="password"
                value={field.state.value}
                onChangeText={field.setValue}
                style={{ textAlign: 'center' }}
                secureTextEntry
              />
            )}
          />
          <StyledButton text="Sign in" onPress={form.handleSubmit} />
          <StyledButton text="Settings" onPress={navigateToSettings} />
        </View>
      </View>
    </>
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