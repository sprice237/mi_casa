import { Tabs } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
      <Tabs.Screen
        name="List"
        options={{
          headerShown: false,
          title: 'List',
          tabBarIcon: ({ focused }) => <FontAwesome6 name="face-smile" size={24} color={focused ? 'blue' : 'black'} />,
        }}
      />
      <Tabs.Screen
        name="Calendar"
        options={{
          headerShown: false,
          title: 'Calendar',
          tabBarIcon: ({ focused }) => <FontAwesome6 name="face-smile" size={24} color={focused ? 'blue' : 'black'} />,
        }}
      />
    </Tabs>
  );
}