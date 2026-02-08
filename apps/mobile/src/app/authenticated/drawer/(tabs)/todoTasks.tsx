import { TasksList } from '$/components/TasksList';
import { useRegisterTitle } from '$/stores/titleStore';
import { StyleSheet, View } from 'react-native';

export default function TodoTasks() {
  useRegisterTitle('To do');

  return (
    <View style={styles.container}>
      <TasksList style={styles.list} status="READY_TO_BEGIN" showAddTaskButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, display: 'flex', flexDirection: 'column' },
  list: {
    flex: 1
  },
});