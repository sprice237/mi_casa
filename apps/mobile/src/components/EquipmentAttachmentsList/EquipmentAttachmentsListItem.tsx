import { FragmentType, getFragmentData, EquipmentNoteFragmentDoc, EquipmentAttachmentsQuery, EquipmentAttachmentFragmentDoc } from '$/gql';
import { StyleSheet, Text, View } from 'react-native';

type EquipmentAttachmentsListItemProps = {
  equipmentAttachment: FragmentType<typeof EquipmentAttachmentFragmentDoc>;
  rowHeight: number;
};

export const EquipmentAttachmentsListItem = ({ equipmentAttachment: equipmentAttachmentFragment, rowHeight }: EquipmentAttachmentsListItemProps) => {
  const equipmentAttachment = getFragmentData(EquipmentAttachmentFragmentDoc, equipmentAttachmentFragment);

  return (
    <View style={[styles.container, { height: rowHeight }]}>
      <View style={{ flex: 1 }}>
        <Text>{equipmentAttachment.createdAt.toISOString()}</Text>
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
