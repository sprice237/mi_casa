import { StyleSheet, Text, View } from 'react-native';
import { useForm } from '@tanstack/react-form';
import { Tabs, useLocalSearchParams } from 'expo-router';
import { useMutation, useSuspenseQuery } from '@apollo/client/react';
import { EquipmentDocument, EquipmentFragmentDoc, getFragmentData, UpdateEquipmentDocument } from '$/gql';
import { useFormAutoSubmitEffect } from '$/util/util';
import { FieldUpdateModal } from '$/components/FieldUpdateModal';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

interface EquipmentFormValues {
  name: string;
}


export default function Equipment() {
  const { equipmentId } = useLocalSearchParams<'/authenticated/Equipment/item/[equipmentId]/(tabs)/details'>();
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
            initialParams={{ equipmentId }}
            options={{
              title: 'Details',
              tabBarIcon: ({ focused }) => <FontAwesome6 name="circle-info" size={24} color={focused ? 'blue' : 'black'} />,
            }}
          />
          <Tabs.Screen
            name="(tabs)/activity"
            initialParams={{ equipmentId }}
            options={{
              title: 'Activity',
              tabBarIcon: ({ focused }) => <FontAwesome6 name="list" size={24} color={focused ? 'blue' : 'black'} />,
            }}
          />
          <Tabs.Screen
            name="(tabs)/recurringTasks"
            initialParams={{ equipmentId }}
            options={{
              title: 'Recurring Tasks',
              tabBarIcon: ({ focused }) => <FontAwesome6 name="clock" size={24} color={focused ? 'blue' : 'black'} />,
            }}
          />
          <Tabs.Screen
            name="(tabs)/tasks"
            initialParams={{ equipmentId }}
            options={{
              title: 'Tasks',
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