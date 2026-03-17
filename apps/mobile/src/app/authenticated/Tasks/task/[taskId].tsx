import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useMutation, useSuspenseQuery } from '@apollo/client/react';
import { getFragmentData, TaskDocument, TaskFragmentDoc, UpdateTaskDocument } from '$/gql';
import { useForm } from '@tanstack/react-form';
import { useFormAutoSubmitEffect } from '$/util/util';
import { useState } from 'react';
import { FieldUpdateModal } from '$/components/FieldUpdateModal';
import { TabRow } from '$/components/TabRow';
import { ActivityFeed } from '$/components/activityFeed/ActivityFeed';

interface TaskFormValues {
  name: string;
}

const tabs = [
  { key: 'details', label: 'Details' },
  { key: 'activity', label: 'Activity' },
] as const;
type Tab = typeof tabs[number];
const getTabKey = (tab: Tab) => tab.key;
const getTabLabel = (tab: Tab) => tab.label;

export default function Task() {
  const { taskId } = useLocalSearchParams<'/authenticated/Tasks/task/[taskId]'>();
  if (!taskId) {
    throw new Error('must have taskId')
  }

  const [updateTask] = useMutation(UpdateTaskDocument);

  const { data: { task: taskFragment }, refetch } = useSuspenseQuery(TaskDocument, { variables: { taskId } });
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

  const [tab, setTab] = useState<Tab['key']>('details')

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
      <TabRow options={tabs} getKey={getTabKey} getLabel={getTabLabel} selected={tab} onSelect={setTab} />
      <View style={{ flex: 1 }}>
        {tab === 'details' && (
          <View />
        )}
        {tab === 'activity' && (
          <ActivityFeed style={styles.flexOne} activityFeedId={task.activityFeedId} />
        )}
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