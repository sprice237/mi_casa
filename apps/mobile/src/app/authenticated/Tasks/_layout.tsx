import { Tabs } from 'expo-router';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'blue', headerShown: false }}>
      <Tabs.Screen
        name="(tabs)/todoTasks"
        options={{
          title: 'To do',
          tabBarIcon: ({ focused }) => <FontAwesome6 name="face-smile" size={24} color={focused ? 'blue' : 'black'} />,
        }}
      />
      <Tabs.Screen
        name="(tabs)/inProgressTasks"
        options={{
          title: 'In progress',
          tabBarIcon: ({ focused }) => <FontAwesome6 name="face-smile" size={24} color={focused ? 'blue' : 'black'} />,
        }}
      />
      <Tabs.Screen
        name="(tabs)/completeTasks"
        options={{
          title: 'Complete',
          tabBarIcon: ({ focused }) => <FontAwesome6 name="face-smile" size={24} color={focused ? 'blue' : 'black'} />,
        }}
      />
    </Tabs>
  );
}