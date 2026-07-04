import { StyleSheet, View } from 'react-native';

export default function Task() {
  return (
    <View style={styles.container}>
      <View />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
});