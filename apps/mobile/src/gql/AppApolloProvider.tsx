import { ApolloProvider } from "@apollo/client/react";
import { useClient } from "$/gql";
import { ReactNode } from 'react';

type AppApolloProviderProps = {
  children?: ReactNode
};

export const AppApolloProvider = ({ children }: AppApolloProviderProps) => {
  const client = useClient();

  return (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  )

}