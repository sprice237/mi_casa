import { RecurringTaskRule } from '@mi_casa/common';
import { DispatchWithoutAction } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { Modal } from '../Modal';
import { CreateRecurringTaskDocument, UpdateRecurringTaskDocument, FragmentType, getFragmentData, RecurringTaskFragmentDoc } from '$/gql';
import { useMutation } from '@apollo/client/react';
import { RuleSubForm, useAppForm } from './form';

type RecurringTaskEditModalProps = {
  recurringTask?: FragmentType<typeof RecurringTaskFragmentDoc>;
  defaultValues?: { name?: string, equipmentId?: string | null; projectId?: string | null };
  onClose: DispatchWithoutAction;
}

interface RecurringTaskEditModalFormValues {
  name: string;
  equipmentId: string | null;
  projectId: string | null;
  rule: RecurringTaskRule;
}

export const RecurringTaskEditModal = ({ recurringTask: recurringTaskFragment, defaultValues, onClose }: RecurringTaskEditModalProps) => {
  const recurringTask = getFragmentData(RecurringTaskFragmentDoc, recurringTaskFragment);

  const formDefaultValues: RecurringTaskEditModalFormValues = {
    name: recurringTask?.name ?? defaultValues?.name ?? '',
    equipmentId: recurringTask?.equipment?.id ?? defaultValues?.equipmentId ?? null,
    projectId: recurringTask?.project?.id ?? defaultValues?.projectId ?? null,
    rule: recurringTask?.rule as RecurringTaskRule ?? { type: 'day', interval: 1 },
  }

  const form = useAppForm({
    defaultValues: formDefaultValues,
    onSubmit: async ({ value: { name, rule, equipmentId, projectId } }) => {
      if (recurringTask) {
        await updateTask({
          variables: {
            recurringTaskId: recurringTask.id,
            input: {
              name,
              rule,
              equipmentId: { id: equipmentId },
              projectId: { id: projectId },
              startDate: null,
            }
          },
        });
      } else {
        await createTask({
          variables: {
            input: {
              name,
              rule,
              equipmentId,
              projectId,
              startDate: new Date(),
            }
          },
          update(cache) {
            cache.evict({ fieldName: 'recurringTasks' })
          }
        });

      }
    }
  })

  const [createTask] = useMutation(CreateRecurringTaskDocument);
  const [updateTask] = useMutation(UpdateRecurringTaskDocument);

  const onSubmit = async () => {
    await form.handleSubmit();
    onClose();
  }

  return (
    <Modal backdropClose title="Add recurring task" onClose={onClose} content={(
      <View style={styles.container}>
        <View style={styles.row}>
          <Text>Name</Text>
          <View style={styles.flexOne}>
            <form.AppField
              name="name"
              children={(field) => <field.TextField label="Name" />}
            />
          </View>
        </View>
        <View style={styles.row}>
          <Text>Equipment</Text>
          <View style={styles.flexOne}>
            <form.AppField
              name="equipmentId"
              children={(field) => <field.EquipmentSelectField />}
            />
          </View>
        </View>
        <View style={styles.row}>
          <Text>Project</Text>
          <View style={styles.flexOne}>
            <form.AppField
              name="projectId"
              children={(field) => <field.ProjectSelectField />}
            />
          </View>
        </View>
        {/* <form.AppField
          name="rule"
          children={(field) => <field.RuleField />}
        /> */}
        <RuleSubForm form={form} fields={{ rule: 'rule' }} />
        <Button onPress={onSubmit} title="Submit" />
      </View>
    )} />
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    padding: 10,
    gap: 10
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  flexOne: {
    flex: 1
  }
})