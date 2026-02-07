import { DispatchWithoutAction, useState } from 'react';
import { Button, View } from 'react-native';
import { Modal } from './Modal';
import { StyledTextInput } from './StyledTextInput';
import { CreateTaskDocument, UpdateTaskDocument, FragmentType, getFragmentData, TaskFragmentDoc, TasksDocument } from '$/gql';
import { useMutation } from '@apollo/client/react';

type CreateOrUpdateTaskModalProps = {
  task?: FragmentType<typeof TaskFragmentDoc>;
  onClose: DispatchWithoutAction;
}

export const CreateOrUpdateTaskModal = ({ task: taskFragment, onClose }: CreateOrUpdateTaskModalProps) => {
  const task = getFragmentData(TaskFragmentDoc, taskFragment);

  const [name, setName] = useState(task?.name ?? '');

  const [createTask] = useMutation(CreateTaskDocument);
  const [updateTask] = useMutation(UpdateTaskDocument);

  const doAddTask = async () => {
    if (task) {

      await updateTask({
        variables: {
          taskId: task.id,
          input: {
            name,
            status: null,
          }
        },
      });
    } else {
      await createTask({
        variables: {
          input: {
            name
          }
        },
        refetchQueries: [TasksDocument]
      });

    }
  }

  const onSubmit = async () => {
    await doAddTask();
    onClose();
  }

  return (
    <Modal backdropClose title="Add task" onClose={onClose} content={(
      <View style={{ display: 'flex', flexDirection: 'column' }}>
        <StyledTextInput value={name} onChangeText={setName} placeholder="Name" />
        <Button onPress={onSubmit} title="Submit" />
      </View>
    )} />
  );
}