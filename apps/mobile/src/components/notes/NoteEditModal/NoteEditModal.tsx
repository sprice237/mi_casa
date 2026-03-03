import { Dispatch, DispatchWithoutAction } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { Modal } from '../../Modal';
import { StyledTextInput } from '../../StyledTextInput';
import { FragmentType, getFragmentData, NoteFragmentDoc, CreateNoteDocument, UpdateNoteDocument } from '$/gql';
import { useMutation } from '@apollo/client/react';
import { useForm } from '@tanstack/react-form';
import { NoteFormValues } from './form';

type NoteEditModalProps = {
  note?: FragmentType<typeof NoteFragmentDoc>;
  onClose: DispatchWithoutAction;
  onCreate?: Dispatch<FragmentType<typeof NoteFragmentDoc>>;
  onUpdate?: Dispatch<FragmentType<typeof NoteFragmentDoc>>;
}

export const NoteEditModal = ({ note: noteFragment, onClose, onCreate, onUpdate }: NoteEditModalProps) => {
  const [createNote] = useMutation(CreateNoteDocument);
  const [updateNote] = useMutation(UpdateNoteDocument);

  const note = getFragmentData(NoteFragmentDoc, noteFragment);

  const defaultValues: NoteFormValues = { content: note?.content ?? '' };
  const form = useForm({
    defaultValues, onSubmit: async ({ value: { content } }) => {

      if (note) {
        const { data: { updateNote: updatedNote } = {} } = await updateNote({
          variables: {
            noteId: note.id,
            input: {
              content,
            }
          },
        });
        if (updatedNote) {
          onUpdate?.(updatedNote);
        }
      } else {
        const { data: { createNote: createdNote } = {} } = await createNote({
          variables: {
            input: {
              content,
            }
          },
        });

        if (createdNote) {
          onCreate?.(createdNote);
        }
      }
      onClose();
    }
  });

  return (
    <Modal backdropClose title="Add note" onClose={onClose} content={(
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