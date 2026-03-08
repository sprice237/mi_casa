import { useAuthStore } from '$/stores/authStore';
import { Redirect } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Drawer from 'expo-router/drawer';
import { AppApolloProvider } from '$/gql/AppApolloProvider';
import { AppDrawer } from '$/components/AppDrawer';
import { AppNotificationsProvider } from '$/gql/AppNotificationsProvider';

export default function Layout() {
  const auth = useAuthStore((state) => state.auth);

  if (!auth) {
    return <Redirect href="/unauthenticated" />
  }

  return (
    <AppApolloProvider>
      <AppNotificationsProvider>
        {/* should GestureHandlerRootView be here? */}
        <GestureHandlerRootView style={{ flex: 1 }}>
          <AppDrawer>
            <Drawer.Screen name="index" options={{ headerTitle: 'Home' }} />
            <Drawer.Screen name="Categories" options={{ headerTitle: 'Categories' }} />
            <Drawer.Screen name="Equipment" options={{ headerTitle: 'Equipment' }} />
            <Drawer.Screen name="Projects" options={{ headerTitle: 'Projects' }} />
            <Drawer.Screen name="RecurringTasks" options={{ headerTitle: 'Recurring tasks' }} />
            <Drawer.Screen name="Tasks" options={{ headerTitle: 'Tasks' }} />
          </AppDrawer>
        </GestureHandlerRootView>
      </AppNotificationsProvider>
    </AppApolloProvider>
  )
}
