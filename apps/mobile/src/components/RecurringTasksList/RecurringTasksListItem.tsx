import { FragmentType, getFragmentData, RecurringTaskFragmentDoc } from '$/gql';
import { StyleSheet, Text, View } from 'react-native';

type RecurringTasksListItemProps = {
  recurringTask: FragmentType<typeof RecurringTaskFragmentDoc>;
  rowHeight: number;
};

export const RecurringTasksListItem = ({ recurringTask: recurringTaskFragment, rowHeight }: RecurringTasksListItemProps) => {
  const recurringTask = getFragmentData(RecurringTaskFragmentDoc, recurringTaskFragment)

  return (
    <View style={[styles.container, { height: rowHeight }]}>
      <View style={{ flex: 1 }}>
        <Text>{recurringTask.name}</Text>
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
