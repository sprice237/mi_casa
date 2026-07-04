import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSuspenseQuery } from '@apollo/client/react';
import { getFragmentData, TaskDocument, TaskFragmentDoc, UpdateTaskDocument } from '$/gql';
import { ActivityFeed } from '$/components/activityFeed/ActivityFeed';


export default function Task() {
  const { taskId } = useLocalSearchParams<'/authenticated/Tasks/task/[taskId]/(tabs)/activity'>();
  if (!taskId) {
    throw new Error('must have taskId')
  }


  const { data: { task: taskFragment }, refetch } = useSuspenseQuery(TaskDocument, { variables: { taskId } });
  const task = getFragmentData(TaskFragmentDoc, taskFragment);

  return (
    <View style={styles.container}>
      <ActivityFeed style={styles.flexOne} activityFeedId={task.activityFeedId} />
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