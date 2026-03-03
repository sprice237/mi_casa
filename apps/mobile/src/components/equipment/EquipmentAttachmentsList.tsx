import { EquipmentDocument, EquipmentFragmentDoc, getFragmentData, UpdateEquipmentDocument } from '$/gql';
import { ComponentProps } from 'react';
import { View } from 'react-native';
import { useMutation, useQuery } from '@apollo/client/react';
import { AttachmentsList } from '../attachments/AttachmentsList';

type EquipmentAttachmentsListProps = ComponentProps<typeof View> & {
  equipmentId: string;
}

export const EquipmentAttachmentsList = ({ equipmentId, ...viewProps }: EquipmentAttachmentsListProps) => {
  const { data, refetch, loading } = useQuery(EquipmentDocument, { variables: { equipmentId } });
  const [updateEquipment] = useMutation(UpdateEquipmentDocument, { variables: { equipmentId } });

  const attachments = getFragmentData(EquipmentFragmentDoc, data?.equipment)?.attachments ?? [];

  const onAttachmentCreate = async ({ id: attachmentId }: { id: string }) => {
    await updateEquipment({
      variables: { equipmentId, input: { name: null, attachmentIds: { attach: [attachmentId], detach: null }, noteIds: null } }
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