import { getFragmentData, RecurringTaskDocument, RecurringTaskFragmentDoc, UpdateRecurringTaskDocument } from '$/gql';
import { ComponentProps } from 'react';
import { View } from 'react-native';
import { useMutation, useQuery } from '@apollo/client/react';
import { AttachmentsList } from '../attachments/AttachmentsList';

type RecurringTaskAttachmentsListProps = ComponentProps<typeof View> & {
  recurringTaskId: string;
}

export const RecurringTaskAttachmentsList = ({ recurringTaskId, ...viewProps }: RecurringTaskAttachmentsListProps) => {
  const { data, refetch, loading } = useQuery(RecurringTaskDocument, { variables: { recurringTaskId } });
  const [updateRecurringTask] = useMutation(UpdateRecurringTaskDocument, { variables: { recurringTaskId } });

  const attachments = getFragmentData(RecurringTaskFragmentDoc, data?.recurringTask)?.attachments ?? [];

  const onAttachmentCreate = async ({ id: attachmentId }: { id: string }) => {
    await updateRecurringTask({
      variables: {
        recurringTaskId,
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