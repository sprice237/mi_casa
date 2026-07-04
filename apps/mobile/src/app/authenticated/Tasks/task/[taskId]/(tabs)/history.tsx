import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSuspenseQuery } from '@apollo/client/react';
import { getFragmentData, TaskDocument, TaskFragmentDoc } from '$/gql';
import { TaskTransitionHistory } from '$/components/tasks/TaskTransitionHistory';

export default function Task() {
  const { taskId } = useLocalSearchParams<'/authenticated/Tasks/task/[taskId]/history'>();
  if (!taskId) {
    throw new Error('must have taskId')
  }

  const { data: { task: taskFragment } } = useSuspenseQuery(TaskDocument, { variables: { taskId } });
  const task = getFragmentData(TaskFragmentDoc, taskFragment);


  return (
    <View style={styles.container}>
      <TaskTransitionHistory style={styles.flexOne} transitions={task.transitions} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  flexOne: {
    flex: 1,
  },
});