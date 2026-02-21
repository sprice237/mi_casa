import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { useTitleStore } from '$/stores/titleStore';
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { useAuthStore } from '$/stores/authStore';

export default function Layout() {
  const title = useTitleStore((store) => store.title);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer drawerContent={DrawerContent}>
        <Drawer.Screen name="(tabs)" options={{ headerTitle: title }} />
        <Drawer.Screen name="Categories" options={{ headerTitle: 'Categories' }} />
        <Drawer.Screen name="RecurringTasks" options={{ headerTitle: 'Recurring tasks' }} />
      </Drawer>
    </GestureHandlerRootView>
  );
};


const DrawerContent = (props: DrawerContentComponentProps) => {
  const updateApiUri = useAuthStore((state) => state.updateApiUri);
  const updateUsername = useAuthStore((state) => state.updateUsername);

  const onLogOut = () => {
    updateApiUri(null);
    updateUsername(null);
  };

  const navigate: DrawerContentComponentProps['navigation']['navigate'] = (...args) => {
    props.navigation.closeDrawer();

    // use set immediate, because running navigate right after closeDrawer doesn't seem to actually close the drawer
    // to test, try opening the drawer, navigating to something in the drawer, and then going back
    // without setImmediate, the drawer will be open
    // this is sure to cause other problems, TBD...

    setImmediate(() => {
      props.navigation.navigate.apply(null, args as never);
    });
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        label="Home"
        onPress={() => navigate('(tabs)')}
      />
      <DrawerItem
        label="Categories"
        onPress={() => navigate('Categories')}
      />
      <DrawerItem
        label="Recurring tasks"
        onPress={() => navigate('RecurringTasks')}
      />
      <DrawerItem
        label="Log out"
        onPress={onLogOut}
      />
    </DrawerContentScrollView>
  );
}