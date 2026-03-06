import { getFragmentData, NoteFragmentDoc, RecurringTaskDocument, RecurringTaskFragmentDoc, FragmentType, UpdateRecurringTaskDocument } from '$/gql';
import { ComponentProps } from 'react';
import { View } from 'react-native';
import { useMutation, useQuery } from '@apollo/client/react';
import { NotesList } from '../notes/NotesList';

type RecurringTaskNotesListProps = ComponentProps<typeof View> & {
  recurringTaskId: string;
}

export const RecurringTaskNotesList = ({ recurringTaskId, ...viewProps }: RecurringTaskNotesListProps) => {
  const { data, refetch, loading } = useQuery(RecurringTaskDocument, { variables: { recurringTaskId } });
  const [updateRecurringTask] = useMutation(UpdateRecurringTaskDocument, { variables: { recurringTaskId } });
  const notes = getFragmentData(RecurringTaskFragmentDoc, data?.recurringTask)?.notes ?? [];

  const onNoteCreate = async (createdNoteFragment: FragmentType<typeof NoteFragmentDoc>) => {
    const createdNote = getFragmentData(NoteFragmentDoc, createdNoteFragment);

    await updateRecurringTask({
      variables: { recurringTaskId, input: { name: null, attachmentIds: null, noteIds: { attach: [createdNote.id], detach: null } } }
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
