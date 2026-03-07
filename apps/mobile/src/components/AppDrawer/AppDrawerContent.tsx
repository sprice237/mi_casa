import { useAuthStore } from '$/stores/authStore';
import { useRouter } from 'expo-router';
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';

export const AppDrawerContent = (props: DrawerContentComponentProps) => {
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
        onPress={() => navigate('/authenticated/Tasks/list/todoTasks')}
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
        onPress={() => navigate('/authenticated/RecurringTasks/list/List')}
      />
      <DrawerItem
        label="Log out"
        onPress={onLogOut}
      />
    </DrawerContentScrollView>
  );
}