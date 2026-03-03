import { StyleSheet, View } from 'react-native';
import { DeleteButton } from '../../DeleteButton';
import { FragmentType, getFragmentData, AttachmentFragmentDoc, DeleteAttachmentDocument } from '$/gql';
import { useMutation } from '@apollo/client/react';
import { Dispatch, DispatchWithoutAction } from 'react';

type AttachmentsListItemActionsProps = {
  itemWidth: number;
  attachment: FragmentType<typeof AttachmentFragmentDoc>;
  onPress: Dispatch<void>
  onDeleted?: DispatchWithoutAction;
};

export const AttachmentsListItemActions = ({ itemWidth, attachment: attachmentFragment, onPress, onDeleted }: AttachmentsListItemActionsProps) => {
  const attachment = getFragmentData(AttachmentFragmentDoc, attachmentFragment);
  const [deleteAttachment] = useMutation(DeleteAttachmentDocument);

  const doDeleteAttachment = async () => {
    onPress();
    await deleteAttachment({
      variables: {
        attachmentId: attachment.id,
      },
    });
    onDeleted?.();
  }

  return (
    <View style={styles.container}>
      <View style={styles.actionsContainer}>
        <DeleteButton height="100%" onPress={doDeleteAttachment} width={itemWidth} />
      </View>
    </View>
  );
}

AttachmentsListItemActions.numLeftButtons = 0;
AttachmentsListItemActions.numRightButtons = 1;

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