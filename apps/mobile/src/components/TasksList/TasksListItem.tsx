import { FragmentType, getFragmentData, TaskFragmentDoc } from '$/gql';
import { StyleSheet, Text, View } from 'react-native';

type TaskListItemProps = {
  task: FragmentType<typeof TaskFragmentDoc>;
  rowHeight: number;
};

export const TaskListItem = ({ task: taskFragment, rowHeight }: TaskListItemProps) => {
  const task = getFragmentData(TaskFragmentDoc, taskFragment)

  return (
    <View style={[styles.container, { height: rowHeight }]}>
      <View style={{ flex: 1 }}>
        <Text>{task.name}</Text>
        <Text>{task.status}</Text>
      </View>
      <View style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#eee',
  },
  text: { margin: 6 }
});
