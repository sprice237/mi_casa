import { StyleSheet, View } from 'react-native';
import { DeleteButton } from '../DeleteButton';
import { EditTaskButton } from '../EditButton';
import { CompleteTaskButton } from '../CompleteTaskButton';
import { FragmentType, getFragmentData, TaskFragmentDoc, UpdateTaskDocument, DeleteTaskDocument, TasksDocument } from '$/gql';
import { StartTaskButton } from '../StartTaskButton';
import { useMutation } from '@apollo/client/react';
import { Dispatch } from 'react';

type TaskListItemActionsProps = {
  itemWidth: number;
  task: FragmentType<typeof TaskFragmentDoc>;
  onPress: Dispatch<void>
};

export const TaskListItemActions = ({ itemWidth, task: taskFragment, onPress }: TaskListItemActionsProps) => {
  const task = getFragmentData(TaskFragmentDoc, taskFragment);

  const [updateTask] = useMutation(UpdateTaskDocument);
  const [deleteTask] = useMutation(DeleteTaskDocument);

  const doStartTask = () => {
    onPress();
    updateTask({
      variables: {
        taskId: task.id,
        input: {
          name: null,
          status: 'IN_PROGRESS'
        }
      },
      update(cache) {
        cache.evict({ fieldName: 'tasks' })
      }
    })
  }

  const doCompleteTask = () => {
    onPress();
    updateTask({
      variables: {
        taskId: task.id,
        input: {
          name: null,
          status: 'COMPLETE'
        }
      },
      update(cache) {
        cache.evict({ fieldName: 'tasks' })
      }
    })
  }

  const doDeleteTask = () => {
    onPress();
    deleteTask({
      variables: {
        taskId: task.id,
      },
      update(cache) {
        cache.evict({ fieldName: 'tasks' })
      }
    })
  }

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
        <EditTaskButton height="100%" onPress={onPress} task={taskFragment} width={itemWidth} />
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