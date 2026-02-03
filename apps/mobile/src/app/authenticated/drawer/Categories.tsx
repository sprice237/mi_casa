import { StyleSheet, Text, View } from 'react-native';

export default function Categories() {
  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        <Text>Categories</Text>
      </View>
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
  buttonContainer: {
    height: 60
  },
});