import { FragmentType, getFragmentData, EquipmentNoteFragmentDoc } from '$/gql';
import { StyleSheet, Text, View } from 'react-native';

type EquipmentNotesListItemProps = {
  equipmentNote: FragmentType<typeof EquipmentNoteFragmentDoc>;
  rowHeight: number;
};

export const EquipmentNotesListItem = ({ equipmentNote: equipmentNoteFragment, rowHeight }: EquipmentNotesListItemProps) => {
  const equipmentNote = getFragmentData(EquipmentNoteFragmentDoc, equipmentNoteFragment)

  return (
    <View style={[styles.container, { height: rowHeight }]}>
      <View style={{ flex: 1 }}>
        <Text>{equipmentNote.content}</Text>
      </View>
      <View style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        <Text>{equipmentNote.createdAt.toISOString()}</Text>
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
