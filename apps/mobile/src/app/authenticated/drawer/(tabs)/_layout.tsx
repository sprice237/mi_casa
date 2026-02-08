import { Tabs } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
      <Tabs.Screen
        name="me"
        options={{
          headerShown: false,
          title: 'Me',
          tabBarIcon: ({ focused }) => <FontAwesome6 name="face-smile" size={24} color={focused ? 'blue' : 'black'} />,
        }}
      />
      <Tabs.Screen
        name="todoTasks"
        options={{
          headerShown: false,
          title: 'To do',
          tabBarIcon: ({ focused }) => <FontAwesome6 name="face-smile" size={24} color={focused ? 'blue' : 'black'} />,
        }}
      />
      <Tabs.Screen
        name="inProgressTasks"
        options={{
          headerShown: false,
          title: 'In progress',
          tabBarIcon: ({ focused }) => <FontAwesome6 name="face-smile" size={24} color={focused ? 'blue' : 'black'} />,
        }}
      />
      <Tabs.Screen
        name="completeTasks"
        options={{
          headerShown: false,
          title: 'Complete',
          tabBarIcon: ({ focused }) => <FontAwesome6 name="face-smile" size={24} color={focused ? 'blue' : 'black'} />,
        }}
      />
    </Tabs>
  );
}