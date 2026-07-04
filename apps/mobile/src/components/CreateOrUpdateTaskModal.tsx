import { DispatchWithoutAction, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { Modal } from './Modal';
import { StyledTextInput } from './StyledTextInput';
import { CreateTaskDocument, UpdateTaskDocument, FragmentType, getFragmentData, TaskFragmentDoc, TasksDocument } from '$/gql';
import { useMutation } from '@apollo/client/react';
import { EquipmentSelect } from './EquipmentSelect';
import { ProjectSelect } from './ProjectSelect';
import { useRouter } from 'expo-router';

type CreateOrUpdateTaskModalProps = {
  task?: FragmentType<typeof TaskFragmentDoc>;
  defaultValues?: { name?: string, equipmentId?: string | null; projectId?: string | null };
  navigateOnCreate?: boolean;
  onClose: DispatchWithoutAction;
}

export const CreateOrUpdateTaskModal = ({ task: taskFragment, defaultValues, navigateOnCreate, onClose }: CreateOrUpdateTaskModalProps) => {
  const navigation = useRouter();
  const task = getFragmentData(TaskFragmentDoc, taskFragment);

  const [name, setName] = useState(task?.name ?? defaultValues?.name ?? '');
  const [equipmentId, setEquipmentId] = useState<string | null>(task?.equipment?.id ?? defaultValues?.equipmentId ?? null);
  const [projectId, setProjectId] = useState<string | null>(task?.project?.id ?? defaultValues?.projectId ?? null);

  const [createTask] = useMutation(CreateTaskDocument);
  const [updateTask] = useMutation(UpdateTaskDocument);

  const doAddTask = async () => {
    if (task) {
      await updateTask({
        variables: {
          taskId: task.id,
          input: {
            name,
            equipmentId: { id: equipmentId },
            projectId: { id: projectId },
            status: null,
          }
        },
      });
    } else {
      const createTaskRes = await createTask({
        variables: {
          input: {
            name,
            equipmentId,
            projectId,
          }
        },
        update(cache) {
          cache.evict({ fieldName: 'tasks' })
        }
      });
      if (navigateOnCreate && createTaskRes.data) {
        const task = getFragmentData(TaskFragmentDoc, createTaskRes.data.createTask);
        navigation.navigate(`/authenticated/Tasks/task/${task.id}/(tabs)/details`)
      }
    }
  }

  const onSubmit = async () => {
    await doAddTask();
    onClose();
  }

  return (
    <Modal backdropClose title="Add task" onClose={onClose} content={(
      <View style={styles.container}>
        <View style={styles.row}>
          <Text>Name</Text>
          <View style={styles.flexOne}>
            <StyledTextInput value={name} onChangeText={setName} placeholder="Name" />
          </View>
        </View>
        <View style={styles.row}>
          <Text>Equipment</Text>
          <View style={styles.flexOne}>
            <EquipmentSelect value={equipmentId} onChange={setEquipmentId} />
          </View>
        </View>
        <View style={styles.row}>
          <Text>Project</Text>
          <View style={styles.flexOne}>
            <ProjectSelect value={equipmentId} onChange={setProjectId} />
          </View>
        </View>
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