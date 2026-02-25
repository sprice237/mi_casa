import { DispatchWithoutAction } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { Modal } from '../Modal';
import { StyledTextInput } from '../StyledTextInput';
import { FragmentType, getFragmentData, EquipmentNoteFragmentDoc, CreateEquipmentNoteDocument, UpdateEquipmentNoteDocument } from '$/gql';
import { useMutation } from '@apollo/client/react';
import { useForm } from '@tanstack/react-form';
import { EquipmentNoteFormValues } from './form';

type EquipmentNoteEditModalProps = {
  equipmentId: string;
  equipmentNote?: FragmentType<typeof EquipmentNoteFragmentDoc>;
  onClose: DispatchWithoutAction;
}

export const EquipmentNoteEditModal = ({ equipmentId, equipmentNote: equipmentNoteFragment, onClose }: EquipmentNoteEditModalProps) => {
  const [createEquipmentNote] = useMutation(CreateEquipmentNoteDocument);
  const [updateEquipmentNote] = useMutation(UpdateEquipmentNoteDocument);

  const equipmentNote = getFragmentData(EquipmentNoteFragmentDoc, equipmentNoteFragment);

  const defaultValues: EquipmentNoteFormValues = { content: equipmentNote?.content ?? '' };
  const form = useForm({
    defaultValues, onSubmit: async ({ value: { content } }) => {

      if (equipmentNote) {
        await updateEquipmentNote({
          variables: {
            equipmentNoteId: equipmentNote.id,
            input: {
              content,
            }
          },
        });
      } else {
        await createEquipmentNote({
          variables: {
            input: {
              equipmentId,
              content,
            }
          },
          refetchQueries: ['EquipmentNotes'],
        });

      }
      onClose();
    }
  });

  return (
    <Modal backdropClose title="Add equipment note" onClose={onClose} content={(
      <View style={styles.container}>
        <form.Field name="content">
          {field => <StyledTextInput value={field.state.value} onChangeText={e => field.setValue(e)} />}
        </form.Field>
        <Button onPress={form.handleSubmit} title="Submit" />
      </View>
    )} />
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    padding: 10,
    gap: 10
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  }
})