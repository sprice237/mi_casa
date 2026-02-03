import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { useTitleStore } from '$/stores/titleStore';
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';

export default function Layout() {
  const title = useTitleStore((store) => store.title);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer drawerContent={DrawerContent}>
        <Drawer.Screen name="(tabs)" options={{ headerTitle: title }} />
      </Drawer>
    </GestureHandlerRootView>
  );
};


const DrawerContent = (props: DrawerContentComponentProps) => {
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
        label="Categories"
        onPress={() => navigate('Categories')}
      />
    </DrawerContentScrollView>
  );
}