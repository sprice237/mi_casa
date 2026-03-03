import { StyleSheet, View } from 'react-native';
import { DeleteButton } from '../../DeleteButton';
import { FragmentType, getFragmentData, NoteFragmentDoc, DeleteNoteDocument } from '$/gql';
import { useMutation } from '@apollo/client/react';
import { DispatchWithoutAction } from 'react';
import { EditButton } from '../../EditButton';
import { NoteEditModal } from '../NoteEditModal';
import { useFlagState } from '$/util';

type NotesListItemActionsProps = {
  itemWidth: number;
  note: FragmentType<typeof NoteFragmentDoc>;
  onPress: DispatchWithoutAction
  onUpdated?: DispatchWithoutAction;
  onDeleted?: DispatchWithoutAction;
};

export const NotesListItemActions = ({ itemWidth, note: noteFragment, onPress, onUpdated, onDeleted }: NotesListItemActionsProps) => {
  const { value: isEditModalVisible, setTrue: showEditModal, setFalse: hideEditModal } = useFlagState();
  const note = getFragmentData(NoteFragmentDoc, noteFragment);

  const [deleteNote] = useMutation(DeleteNoteDocument);

  const doEditNote = () => {
    onPress();
    showEditModal();
  }

  const doDeleteNote = async () => {
    onPress();
    await deleteNote({
      variables: {
        noteId: note.id,
      },
    });
    onDeleted?.();
  }

  const doHideEditModal = () => {
    hideEditModal();
    onUpdated?.();
  }

  return (
    <>
      {isEditModalVisible && <NoteEditModal note={noteFragment} onClose={doHideEditModal} />}
      <View style={styles.container}>
        <View style={styles.actionsContainer}>
          <EditButton height="100%" onPress={doEditNote} width={itemWidth} />
          <DeleteButton height="100%" onPress={doDeleteNote} width={itemWidth} />
        </View>
      </View>
    </>
  );
}

NotesListItemActions.numLeftButtons = 0;
NotesListItemActions.numRightButtons = 2;

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