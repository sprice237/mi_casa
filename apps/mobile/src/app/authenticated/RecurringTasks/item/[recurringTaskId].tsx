import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useMutation, useSuspenseQuery } from '@apollo/client/react';
import { getFragmentData, RecurringTaskDocument, RecurringTaskFragmentDoc, UpdateRecurringTaskDocument } from '$/gql';
import { useForm } from '@tanstack/react-form';
import { useFormAutoSubmitEffect } from '$/util';
import { useState } from 'react';
import { FieldUpdateModal } from '$/components/FieldUpdateModal';
import { TabRow } from '$/components/TabRow';
import { RecurringTaskAttachmentsList } from '$/components/recurringTasks/RecurringTaskAttachmentsList';
import { RecurringTaskNotesList } from '$/components/recurringTasks/RecurringTaskNotesList';

interface RecurringTaskFormValues {
  name: string;
}

const tabs = [
  { key: 'details', label: 'Details' },
  { key: 'notes', label: 'Notes' },
  { key: 'attachments', label: 'Attachments' }
] as const;
type Tab = typeof tabs[number];
const getTabKey = (tab: Tab) => tab.key;
const getTabLabel = (tab: Tab) => tab.label;

export default function RecurringTask() {
  const { recurringTaskId } = useLocalSearchParams<'/authenticated/RecurringTasks/item/[recurringTaskId]'>();
  if (!recurringTaskId) {
    throw new Error('must have recurringTaskId')
  }

  const [updateRecurringTask] = useMutation(UpdateRecurringTaskDocument);

  const { data: { recurringTask: recurringTaskFragment }, refetch } = useSuspenseQuery(RecurringTaskDocument, { variables: { recurringTaskId } });
  const recurringTask = getFragmentData(RecurringTaskFragmentDoc, recurringTaskFragment);

  const defaultValues: RecurringTaskFormValues = { name: recurringTask?.name };
  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      await updateRecurringTask({
        variables: {
          recurringTaskId,
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
        {tab === 'notes' && (
          <RecurringTaskNotesList style={styles.flexOne} recurringTaskId={recurringTask.id} />
        )}
        {tab === 'attachments' && (
          <RecurringTaskAttachmentsList style={styles.flexOne} recurringTaskId={recurringTask.id} />
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