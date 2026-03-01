import { useAuthStore } from '$/stores/authStore';
import { Redirect, useRouter } from 'expo-router';
import { ApolloProvider } from "@apollo/client/react";
import { useClient } from "$/gql";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Drawer from 'expo-router/drawer';
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';

export default function Layout() {
  const auth = useAuthStore((state) => state.auth);

  if (!auth) {
    return <Redirect href="/unauthenticated" />
  }

  return <Content />
};

const Content = () => {
  const client = useClient();

  return (
    <ApolloProvider client={client}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Drawer drawerContent={DrawerContent}>
          <Drawer.Screen name="index" options={{ headerTitle: 'Home' }} />
          <Drawer.Screen name="Categories" options={{ headerTitle: 'Categories' }} />
          <Drawer.Screen name="Equipment" options={{ headerTitle: 'Equipment' }} />
          <Drawer.Screen name="Projects" options={{ headerTitle: 'Projects' }} />
          <Drawer.Screen name="RecurringTasks" options={{ headerTitle: 'Recurring tasks' }} />
          <Drawer.Screen name="Tasks" options={{ headerTitle: 'Tasks' }} />
        </Drawer>
      </GestureHandlerRootView>
    </ApolloProvider>
  )

}

const DrawerContent = (props: DrawerContentComponentProps) => {
  const router = useRouter();
  const updateAuth = useAuthStore((state) => state.updateAuth);

  const onLogOut = () => {
    updateAuth(null);
  };

  const navigate = (...args: Parameters<typeof router['navigate']>) => {
    props.navigation.closeDrawer();
    router.navigate.apply(null, args as never);
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        label="Home"
        onPress={() => navigate('/authenticated')}
      />
      <DrawerItem
        label="Tasks"
        onPress={() => navigate('/authenticated/Tasks/todoTasks')}
      />
      <DrawerItem
        label="Categories"
        onPress={() => navigate('/authenticated/Categories')}
      />
      <DrawerItem
        label="Equipment"
        onPress={() => navigate('/authenticated/Equipment')}
      />
      <DrawerItem
        label="Projects"
        onPress={() => navigate('/authenticated/Projects')}
      />
      <DrawerItem
        label="Recurring tasks"
        onPress={() => navigate('/authenticated/RecurringTasks/List')}
      />
      <DrawerItem
        label="Log out"
        onPress={onLogOut}
      />
    </DrawerContentScrollView>
  );
}