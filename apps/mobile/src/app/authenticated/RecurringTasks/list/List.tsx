import { RecurringTasksList } from '$/components/RecurringTasksList/RecurringTasksList';
import { FragmentType, getFragmentData, RecurringTaskFragmentDoc } from '$/gql';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

export default function List() {
  const navigation = useRouter();

  const onRecurringTaskPress = (recurringTaskFragment: FragmentType<typeof RecurringTaskFragmentDoc>) => {
    const recurringTask = getFragmentData(RecurringTaskFragmentDoc, recurringTaskFragment);
    navigation.navigate(`/authenticated/RecurringTasks/item/${recurringTask.id}`)
  };

  return (
    <View style={styles.container}>
      <RecurringTasksList style={styles.listContainer} onRecurringTaskPress={onRecurringTaskPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  listContainer: {
    flex: 1
  },
});