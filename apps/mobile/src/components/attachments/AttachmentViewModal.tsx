import { DispatchWithoutAction } from 'react';
import { StyleSheet, View } from 'react-native';
import { Modal } from '../Modal';
import { AttachmentDocument, AttachmentWithUrlFragmentDoc, getFragmentData, } from '$/gql';
import { useQuery } from '@apollo/client/react';
import { Image } from 'expo-image';

type AttachmentViewModalProps = {
  attachmentId: string;
  onClose: DispatchWithoutAction;
}

export const AttachmentViewModal = ({ attachmentId, onClose }: AttachmentViewModalProps) => {
  const { data: { attachment: attachmentFragment } = {} } = useQuery(AttachmentDocument, { variables: { attachmentId } });

  const attachment = getFragmentData(AttachmentWithUrlFragmentDoc, attachmentFragment);

  return (
    <Modal backdropClose title="View attachment" onClose={onClose} content={(
      <View style={styles.container}>
        <View style={{ width: '100%', height: 300 }}>
          {attachment && (
            <Image source={attachment.url} style={{ width: '100%', flex: 1 }} contentFit="cover" />
          )}
        </View>
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