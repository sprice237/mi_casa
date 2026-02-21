import { useAuthStore } from '$/stores/authStore';
import { Redirect, Stack } from 'expo-router';
import { ApolloProvider } from "@apollo/client/react";
import { useClient } from "$/gql";

export default function Layout() {
  const username = useAuthStore((state) => state.username);
  const apiUri = useAuthStore((state) => state.apiUri);

  if (!username || !apiUri) {
    return <Redirect href="/unauthenticated/signIn" />
  }

  return <Content username={username} apiUri={apiUri} />
};

type ContentProps = {
  username: string
  apiUri: string
}

const Content = ({ username, apiUri }: ContentProps) => {
  const client = useClient(apiUri);

  return (
    <ApolloProvider client={client}>
      <Stack>
        <Stack.Screen name="drawer" options={{ headerShown: false }} />
      </Stack>
    </ApolloProvider>
  )

}