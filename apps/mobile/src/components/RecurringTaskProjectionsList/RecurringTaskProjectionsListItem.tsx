import { FragmentType, getFragmentData, RecurringTaskFragmentDoc, RecurringTaskProjectionFragmentDoc } from '$/gql';
import { StyleSheet, Text, View } from 'react-native';

type RecurringTaskProjectionsListItemProps = {
  recurringTaskProjection: FragmentType<typeof RecurringTaskProjectionFragmentDoc>;
  rowHeight: number;
};

export const RecurringTaskProjectionsListItem = ({ recurringTaskProjection: recurringTaskProjectionFragment, rowHeight }: RecurringTaskProjectionsListItemProps) => {
  const recurringTaskProjection = getFragmentData(RecurringTaskProjectionFragmentDoc, recurringTaskProjectionFragment)

  return (
    <View style={[styles.container, { height: rowHeight }]}>
      <View style={{ flex: 1 }}>
        <Text>{getFragmentData(RecurringTaskFragmentDoc, recurringTaskProjection.recurringTask).name}</Text>
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
