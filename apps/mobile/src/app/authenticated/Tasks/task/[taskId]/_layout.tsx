import { StyleSheet, Text, View } from 'react-native';
import { Tabs, useLocalSearchParams } from 'expo-router';
import { useMutation, useSuspenseQuery } from '@apollo/client/react';
import { getFragmentData, TaskDocument, TaskFragmentDoc, UpdateTaskDocument } from '$/gql';
import { useForm } from '@tanstack/react-form';
import { useFormAutoSubmitEffect } from '$/util/util';
import { FieldUpdateModal } from '$/components/FieldUpdateModal';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

interface TaskFormValues {
  name: string;
}

export default function Task() {
  const { taskId } = useLocalSearchParams<{ taskId: string }>();
  if (!taskId) {
    throw new Error('must have taskId')
  }

  const [updateTask] = useMutation(UpdateTaskDocument);

  const { data: { task: taskFragment } } = useSuspenseQuery(TaskDocument, { variables: { taskId } });
  const task = getFragmentData(TaskFragmentDoc, taskFragment);

  const defaultValues: TaskFormValues = { name: task?.name };
  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      await updateTask({
        variables: {
          taskId,
          input: {
            name: value.name,
          }
        }
      })
    }
  });

  useFormAutoSubmitEffect(form);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text>Name:</Text>
        <View style={styles.flexOne}>
          <form.Field name="name">
            {field => <FieldUpdateModal type="text" value={field.state.value} onChange={field.setValue} />}
          </form.Field>
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <Tabs screenOptions={{ tabBarActiveTintColor: 'blue', headerShown: false }}>
          <Tabs.Screen
            name="(tabs)/details"
            initialParams={{ taskId }}
            options={{
              title: 'Details',
              tabBarIcon: ({ focused }) => <FontAwesome6 name="circle-info" size={24} color={focused ? 'blue' : 'black'} />,
            }}
          />
          <Tabs.Screen
            name="(tabs)/activity"
            initialParams={{ taskId }}
            options={{
              title: 'Activity',
              tabBarIcon: ({ focused }) => <FontAwesome6 name="list" size={24} color={focused ? 'blue' : 'black'} />,
            }}
          />
          <Tabs.Screen
            name="(tabs)/history"
            initialParams={{ taskId }}
            options={{
              title: 'History',
              tabBarIcon: ({ focused }) => <FontAwesome6 name="clock" size={24} color={focused ? 'blue' : 'black'} />,
            }}
          />
        </Tabs>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    gap: 10,
  },
  flexOne: {
    flex: 1,
  },
  listContainer: {
    flex: 1
  },
});