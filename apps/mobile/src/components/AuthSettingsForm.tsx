import { StyleSheet, Text, View } from 'react-native';

import { StyledButton } from '$/components/StyledButton';
import { StyledTextInput } from '$/components/StyledTextInput';
import { useForm } from '@tanstack/react-form';
import { useRouter } from 'expo-router';
import { useEndpointsStore } from '$/stores/endpointsStore';

interface AuthSettingsFormValues {
  apiUri: string;
  authApiUri: string;
}

export const AuthSettingsForm = () => {
  const apiUri = useEndpointsStore((state) => state.apiUri);
  const authApiUri = useEndpointsStore((state) => state.authApiUri);
  const updateApiUri = useEndpointsStore((state) => state.updateApiUri);
  const updateAuthApiUri = useEndpointsStore((state) => state.updateAuthApiUri);

  const router = useRouter();

  const defaultValues: AuthSettingsFormValues = {
    apiUri,
    authApiUri,
  }

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      updateApiUri(value.apiUri);
      updateAuthApiUri(value.authApiUri);
      router.back();
    }
  });

  return (
    <View style={styles.background}>
      <View style={styles.container}>
        <View style={styles.row}>
          <View style={{ width: 70 }}>
            <Text>API</Text>
          </View>
          <View style={styles.flexOne}>
            <form.Field
              name="apiUri"
              children={(field) => (
                <StyledTextInput
                  placeholder="api uri"
                  value={field.state.value}
                  onChangeText={field.setValue}
                  style={{ textAlign: 'center' }}
                />
              )}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={{ width: 70 }}>
            <Text>Auth API</Text>
          </View>
          <View style={styles.flexOne}>
            <form.Field
              name="authApiUri"
              children={(field) => (
                <StyledTextInput
                  placeholder="auth api uri"
                  value={field.state.value}
                  onChangeText={field.setValue}
                  style={{ textAlign: 'center' }}
                />
              )}
            />
          </View>
        </View>
        <StyledButton text="Submit" onPress={form.handleSubmit} />
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
  row: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  flexOne: {
    flex: 1
  }
});