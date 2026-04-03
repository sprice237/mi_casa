import { TasksList } from '$/components/TasksList';
import { StyleSheet, View } from 'react-native';

export default function TodoTasks() {
  return (
    <View style={styles.container}>
      <TasksList style={styles.list} status="READY_TO_BEGIN" showAddTaskButton navigateOnTaskPress />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, display: 'flex', flexDirection: 'column' },
  list: {
    flex: 1
  },
});