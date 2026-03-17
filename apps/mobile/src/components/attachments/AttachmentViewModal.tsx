import { DispatchWithoutAction } from 'react';
import { StyleSheet, View } from 'react-native';
import { Modal } from '../Modal';
import { AttachmentRenderer } from './AttachmentRenderer';

type AttachmentViewModalProps = {
  attachmentId: string;
  onClose: DispatchWithoutAction;
}

export const AttachmentViewModal = ({ attachmentId, onClose }: AttachmentViewModalProps) => {
  return (
    <Modal backdropClose title="View attachment" onClose={onClose} content={(
      <View style={styles.container}>
        <View style={{ width: '100%', height: 300 }}>
          <AttachmentRenderer attachmentId={attachmentId} />
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