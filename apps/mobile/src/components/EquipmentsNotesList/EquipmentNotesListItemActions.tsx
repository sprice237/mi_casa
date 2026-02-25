import { StyleSheet, View } from 'react-native';
import { DeleteButton } from '../DeleteButton';
import { FragmentType, getFragmentData, EquipmentNoteFragmentDoc, DeleteEquipmentNoteDocument } from '$/gql';
import { useMutation } from '@apollo/client/react';
import { Dispatch } from 'react';
import { EditButton } from '../EditButton';
import { EquipmentNoteEditModal } from '../EquipmentNoteEditModal';
import { useFlagState } from '$/util';

type EquipmentNotesListItemActionsProps = {
  itemWidth: number;
  equipmentId: string;
  equipmentNote: FragmentType<typeof EquipmentNoteFragmentDoc>;
  onPress: Dispatch<void>
};

export const EquipmentNotesListItemActions = ({ itemWidth, equipmentId, equipmentNote: equipmentNoteFragment, onPress }: EquipmentNotesListItemActionsProps) => {
  const { value: isEditModalVisible, setTrue: showEditModal, setFalse: hideEditModal } = useFlagState();
  const equipmentNote = getFragmentData(EquipmentNoteFragmentDoc, equipmentNoteFragment);

  const [deleteEquipmentNote] = useMutation(DeleteEquipmentNoteDocument);

  const doDeleteEquipmentNote = () => {
    onPress();
    deleteEquipmentNote({
      variables: {
        equipmentNoteId: equipmentNote.id,
      },
      refetchQueries: ['EquipmentNotes'],
    })
  }

  return (
    <>
      {isEditModalVisible && <EquipmentNoteEditModal equipmentId={equipmentId} equipmentNote={equipmentNoteFragment} onClose={hideEditModal} />}
      <View style={styles.container}>
        <View style={styles.actionsContainer}>
          <EditButton height="100%" onPress={showEditModal} width={itemWidth} />
          <DeleteButton height="100%" onPress={doDeleteEquipmentNote} width={itemWidth} />
        </View>
      </View>
    </>
  );
}

EquipmentNotesListItemActions.numLeftButtons = 0;
EquipmentNotesListItemActions.numRightButtons = 2;

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