import { ProjectsList } from '$/components/ProjectsList';
import { StyleSheet, View } from 'react-native';

export default function Projects() {
  return (
    <View style={styles.container}>
      <ProjectsList style={styles.listContainer} />
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