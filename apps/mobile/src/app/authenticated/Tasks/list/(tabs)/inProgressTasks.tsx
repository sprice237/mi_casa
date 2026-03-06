import { TasksList } from '$/components/TasksList';
import { FragmentType, getFragmentData, TaskFragmentDoc } from '$/gql';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

export default function InProgressTasks() {
  const navigation = useRouter();

  const onTaskPress = (taskFragment: FragmentType<typeof TaskFragmentDoc>) => {
    const task = getFragmentData(TaskFragmentDoc, taskFragment);
    navigation.navigate(`/authenticated/Tasks/task/${task.id}`)
  };

  return (
    <View style={styles.container}>
      <TasksList style={styles.list} status="IN_PROGRESS" onTaskPress={onTaskPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, display: 'flex', flexDirection: 'column' },
  list: {
    flex: 1
  },
});