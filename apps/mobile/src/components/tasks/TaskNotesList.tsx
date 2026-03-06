import { getFragmentData, NoteFragmentDoc, TaskDocument, TaskFragmentDoc, FragmentType, UpdateTaskDocument } from '$/gql';
import { ComponentProps } from 'react';
import { View } from 'react-native';
import { useMutation, useQuery } from '@apollo/client/react';
import { NotesList } from '../notes/NotesList';

type TaskNotesListProps = ComponentProps<typeof View> & {
  taskId: string;
}

export const TaskNotesList = ({ taskId, ...viewProps }: TaskNotesListProps) => {
  const { data, refetch, loading } = useQuery(TaskDocument, { variables: { taskId } });
  const [updateTask] = useMutation(UpdateTaskDocument, { variables: { taskId } });
  const notes = getFragmentData(TaskFragmentDoc, data?.task)?.notes ?? [];

  const onNoteCreate = async (createdNoteFragment: FragmentType<typeof NoteFragmentDoc>) => {
    const createdNote = getFragmentData(NoteFragmentDoc, createdNoteFragment);

    await updateTask({
      variables: { taskId, input: { name: null, attachmentIds: null, noteIds: { attach: [createdNote.id], detach: null } } }
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
