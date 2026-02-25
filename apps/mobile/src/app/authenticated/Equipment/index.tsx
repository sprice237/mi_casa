import { EquipmentsList } from '$/components/EquipmentsList';
import { EquipmentFragmentDoc, FragmentType, getFragmentData } from '$/gql';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

export default function Equipments() {
  const navigation = useRouter();

  const onEquipmentPress = (equipmentFragment: FragmentType<typeof EquipmentFragmentDoc>) => {
    const equipment = getFragmentData(EquipmentFragmentDoc, equipmentFragment);
    navigation.navigate(`/authenticated/Equipment/${equipment.id}`)
  };

  return (
    <View style={styles.container}>
      <EquipmentsList style={styles.listContainer} onEquipmentPress={onEquipmentPress} />
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