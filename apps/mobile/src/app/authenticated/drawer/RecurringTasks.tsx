import { RecurringTasksList } from '$/components/RecurringTasksList/RecurringTasksList';
import { StyleSheet, View } from 'react-native';

export default function Categories() {
  return (
    <View style={styles.container}>
      <RecurringTasksList style={styles.listContainer} />
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