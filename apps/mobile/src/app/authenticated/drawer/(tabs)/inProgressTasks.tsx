import { TasksList } from '$/components/TasksList';
import { useRegisterTitle } from '$/stores/titleStore';
import { StyleSheet, View } from 'react-native';

export default function InProgressTasks() {
  useRegisterTitle('In progress');

  return (
    <View style={styles.container}>
      <TasksList style={styles.list} status="IN_PROGRESS" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, display: 'flex', flexDirection: 'column' },
  list: {
    flex: 1
  },
});