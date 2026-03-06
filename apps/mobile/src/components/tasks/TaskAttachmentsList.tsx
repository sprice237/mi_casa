import { getFragmentData, TaskDocument, TaskFragmentDoc, UpdateTaskDocument } from '$/gql';
import { ComponentProps } from 'react';
import { View } from 'react-native';
import { useMutation, useQuery } from '@apollo/client/react';
import { AttachmentsList } from '../attachments/AttachmentsList';

type TaskAttachmentsListProps = ComponentProps<typeof View> & {
  taskId: string;
}

export const TaskAttachmentsList = ({ taskId, ...viewProps }: TaskAttachmentsListProps) => {
  const { data, refetch, loading } = useQuery(TaskDocument, { variables: { taskId } });
  const [updateTask] = useMutation(UpdateTaskDocument, { variables: { taskId } });

  const attachments = getFragmentData(TaskFragmentDoc, data?.task)?.attachments ?? [];

  const onAttachmentCreate = async ({ id: attachmentId }: { id: string }) => {
    await updateTask({
      variables: {
        taskId,
        input: {
          attachmentIds: {
            attach: [attachmentId],
          },
        }
      }
    })
  }

  return (
    <AttachmentsList
      attachments={attachments}
      loading={loading}
      refetch={refetch}
      onAttachmentCreate={onAttachmentCreate}
      {...viewProps}
    />
  );
};