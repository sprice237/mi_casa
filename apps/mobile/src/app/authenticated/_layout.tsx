import { useAuthStore } from '$/stores/authStore';
import { Redirect, Stack } from 'expo-router';
import { ApolloProvider } from "@apollo/client/react";
import { useClient } from "$/gql";

const uri = 'http://172.17.1.52:8080/graphql';

export default function Layout() {
  const username = useAuthStore((state) => state.username);

  if (!username) {
    return <Redirect href="/unauthenticated/signIn" />
  }

  return <Content username={username} />
};

type ContentProps = {
  username: string
}

const Content = ({ username }: ContentProps) => {
  const client = useClient(uri);

  return (
    <ApolloProvider client={client}>
      <Stack>
        <Stack.Screen name="drawer" options={{ headerShown: false }} />
        <Stack.Screen name="Categories" options={{ headerBackButtonDisplayMode: 'minimal', title: 'Categories' }} />
      </Stack>
    </ApolloProvider>
  )

}