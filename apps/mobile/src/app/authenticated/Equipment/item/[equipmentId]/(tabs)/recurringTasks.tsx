import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { RecurringTasksList } from '$/components/RecurringTasksList';

export default function Equipment() {
  const { equipmentId } = useLocalSearchParams<'/authenticated/Equipment/item/[equipmentId]/(tabs)/recurringTasks'>();
  if (!equipmentId) {
    throw new Error('must have equipmentId')
  }

  return (
    <View style={styles.container}>
      <RecurringTasksList style={styles.flexOne} equipmentId={equipmentId} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    gap: 10,
  },
  flexOne: {
    flex: 1,
  },
  listContainer: {
    flex: 1
  },
});