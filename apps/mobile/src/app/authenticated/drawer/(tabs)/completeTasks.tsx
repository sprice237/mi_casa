import { TasksList } from '$/components/TasksList';
import { useRegisterTitle } from '$/stores/titleStore';
import { StyleSheet, View } from 'react-native';

export default function CompleteTasks() {
  useRegisterTitle('Complete');

  return (
    <View style={styles.container}>
      <TasksList style={styles.list} status="COMPLETE" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, display: 'flex', flexDirection: 'column' },
  list: {
    flex: 1
  },
});