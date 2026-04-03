import { StyleSheet, Text, View } from 'react-native';
import { useForm } from '@tanstack/react-form';
import { useLocalSearchParams } from 'expo-router';
import { useMutation, useSuspenseQuery } from '@apollo/client/react';
import { EquipmentDocument, EquipmentFragmentDoc, getFragmentData, UpdateEquipmentDocument } from '$/gql';
import { useFormAutoSubmitEffect } from '$/util/util';
import { TabRow } from '$/components/TabRow';
import { useState } from 'react';
import { FieldUpdateModal } from '$/components/FieldUpdateModal';
import { RecurringTasksList } from '$/components/RecurringTasksList';
import { ActivityFeed } from '$/components/activityFeed/ActivityFeed';
import { TasksList } from '$/components/TasksList';

interface EquipmentFormValues {
  name: string;
}

const tabs = [
  { key: 'details', label: 'Details' },
  { key: 'activity', label: 'Activity' },
  { key: 'recurring-tasks', label: 'Recurring Tasks' },
  { key: 'tasks', label: 'Tasks' },
] as const;
type Tab = typeof tabs[number];
const getTabKey = (tab: Tab) => tab.key;
const getTabLabel = (tab: Tab) => tab.label;

export default function Equipment() {
  const { equipmentId } = useLocalSearchParams<'/authenticated/Equipment/[equipmentId]'>();
  if (!equipmentId) {
    throw new Error('must have equipmentId')
  }

  const [updateEquipment] = useMutation(UpdateEquipmentDocument);

  const { data: { equipment: equipmentFragment }, refetch } = useSuspenseQuery(EquipmentDocument, { variables: { equipmentId } });
  const equipment = getFragmentData(EquipmentFragmentDoc, equipmentFragment);

  const defaultValues: EquipmentFormValues = { name: equipment?.name };
  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      await updateEquipment({
        variables: {
          equipmentId,
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
          <ActivityFeed style={styles.flexOne} activityFeedId={equipment.activityFeedId} />
        )}
        {tab === 'recurring-tasks' && (
          <RecurringTasksList style={styles.flexOne} equipmentId={equipment.id} />
        )}
        {tab === 'tasks' && (
          <TasksList style={styles.flexOne} equipmentId={equipment.id} navigateOnTaskPress />
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