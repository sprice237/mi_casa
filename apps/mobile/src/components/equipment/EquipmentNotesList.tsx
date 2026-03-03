import { getFragmentData, NoteFragmentDoc, EquipmentDocument, EquipmentFragmentDoc, FragmentType, UpdateEquipmentDocument } from '$/gql';
import { ComponentProps } from 'react';
import { View } from 'react-native';
import { useMutation, useQuery } from '@apollo/client/react';
import { NotesList } from '../notes/NotesList';

type EquipmentNotesListProps = ComponentProps<typeof View> & {
  equipmentId: string;
}

export const EquipmentNotesList = ({ equipmentId, ...viewProps }: EquipmentNotesListProps) => {
  const { data, refetch, loading } = useQuery(EquipmentDocument, { variables: { equipmentId } });
  const [updateEquipment] = useMutation(UpdateEquipmentDocument, { variables: { equipmentId } });
  const notes = getFragmentData(EquipmentFragmentDoc, data?.equipment)?.notes ?? [];

  const onNoteCreate = async (createdNoteFragment: FragmentType<typeof NoteFragmentDoc>) => {
    const createdNote = getFragmentData(NoteFragmentDoc, createdNoteFragment);

    await updateEquipment({
      variables: { equipmentId, input: { name: null, attachmentIds: null, noteIds: { attach: [createdNote.id], detach: null } } }
    })
  }

  return (
    <NotesList
      notes={notes}
      loading={loading}
      refetch={refetch}
      onNoteCreate={onNoteCreate}
      {...viewProps}
    />
  );
};
