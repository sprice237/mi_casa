import { FragmentType, getFragmentData, EquipmentFragmentDoc } from '$/gql';
import { StyleSheet, Text, View } from 'react-native';

type EquipmentsListItemProps = {
  equipment: FragmentType<typeof EquipmentFragmentDoc>;
  rowHeight: number;
};

export const EquipmentsListItem = ({ equipment: equipmentFragment, rowHeight }: EquipmentsListItemProps) => {
  const equipment = getFragmentData(EquipmentFragmentDoc, equipmentFragment)

  return (
    <View style={[styles.container, { height: rowHeight }]}>
      <View style={{ flex: 1 }}>
        <Text>{equipment.name}</Text>
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
