import { StyleSheet, View } from 'react-native';
import { DeleteButton } from '../DeleteButton';
import { FragmentType, getFragmentData, DeleteEquipmentAttachmentDocument, EquipmentAttachmentFragmentDoc } from '$/gql';
import { useMutation } from '@apollo/client/react';
import { Dispatch } from 'react';

type EquipmentAttachmentsListItemActionsProps = {
  itemWidth: number;
  equipmentAttachment: FragmentType<typeof EquipmentAttachmentFragmentDoc>;
  onPress: Dispatch<void>
};

export const EquipmentAttachmentsListItemActions = ({ itemWidth, equipmentAttachment: equipmentAttachmentFragment, onPress }: EquipmentAttachmentsListItemActionsProps) => {
  const equipmentAttachment = getFragmentData(EquipmentAttachmentFragmentDoc, equipmentAttachmentFragment);
  const [deleteEquipmentAttachment] = useMutation(DeleteEquipmentAttachmentDocument);

  const doDeleteEquipmentAttachment = () => {
    onPress();
    deleteEquipmentAttachment({
      variables: {
        equipmentAttachmentId: equipmentAttachment.id,
      },
      refetchQueries: ['EquipmentAttachments'],
    })
  }

  return (
    <View style={styles.container}>
      <View style={styles.actionsContainer}>
        <DeleteButton height="100%" onPress={doDeleteEquipmentAttachment} width={itemWidth} />
      </View>
    </View>
  );
}

EquipmentAttachmentsListItemActions.numLeftButtons = 0;
EquipmentAttachmentsListItemActions.numRightButtons = 1;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  actionsContainer: {
    display: 'flex', flexDirection: 'row'
  },
})