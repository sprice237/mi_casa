import { EquipmentsList } from '$/components/EquipmentsList';
import { StyleSheet, View } from 'react-native';

export default function Equipments() {
  return (
    <View style={styles.container}>
      <EquipmentsList style={styles.listContainer} />
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