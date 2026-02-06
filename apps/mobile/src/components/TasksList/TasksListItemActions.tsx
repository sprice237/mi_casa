import { StyleSheet, View } from 'react-native';
import { DeleteButton } from '../DeleteButton';
import { EditButton } from '../EditButton';
import { CompleteTaskButton } from '../CompleteTaskButton';
import { FragmentType, getFragmentData, TaskFragmentDoc, UpdateTaskDocument, DeleteTaskDocument, TasksDocument } from '$/gql';
import { StartTaskButton } from '../StartTaskButton';
import { useMutation } from '@apollo/client/react';

type TaskListItemActionsProps = {
  itemWidth: number;
  task: FragmentType<typeof TaskFragmentDoc>;
};

export const TaskListItemActions = ({ itemWidth, task: taskFragment }: TaskListItemActionsProps) => {
  const task = getFragmentData(TaskFragmentDoc, taskFragment);

  const [updateTask] = useMutation(UpdateTaskDocument);
  const [deleteTask] = useMutation(DeleteTaskDocument);

  const doStartTask = () => {
    updateTask({
      variables: {
        taskId: task.id,
        input: {
          status: 'IN_PROGRESS'
        }
      }
    })
  }

  const doCompleteTask = () => {
    updateTask({
      variables: {
        taskId: task.id,
        input: {
          status: 'COMPLETE'
        }
      }
    })
  }

  const doDeleteTask = () => {
    deleteTask({
      variables: {
        taskId: task.id,
      },
      refetchQueries: [TasksDocument]
    })
  }


  const onUpdate = () => { };

  return (
    <View style={styles.container}>
      <View style={styles.actionsContainer}>
        {task.status === 'READY_TO_BEGIN' && (
          <StartTaskButton height="100%" onPress={doStartTask} width={itemWidth} />
        )}
        {task.status === 'IN_PROGRESS' && (
          <CompleteTaskButton height="100%" onPress={doCompleteTask} width={itemWidth} />
        )}
      </View>
      <View style={styles.actionsContainer}>
        <EditButton height="100%" onPress={onUpdate} width={itemWidth} />
        <DeleteButton height="100%" onPress={doDeleteTask} width={itemWidth} />
      </View>
    </View>
  );
}

TaskListItemActions.numLeftButtons = 1;
TaskListItemActions.numRightButtons = 2;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  actionsContainer: {
    display: 'flex', flexDirection: 'row'
  },
})