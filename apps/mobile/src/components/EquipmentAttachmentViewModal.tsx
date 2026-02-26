import { DispatchWithoutAction } from 'react';
import { StyleSheet, View } from 'react-native';
import { Modal } from './Modal';
import { EquipmentAttachmentDocument, EquipmentAttachmentWithUrlFragmentDoc, getFragmentData, } from '$/gql';
import { useQuery } from '@apollo/client/react';
import { Image } from 'expo-image';

type EquipmentAttachmentViewModalProps = {
  equipmentAttachmentId: string;
  onClose: DispatchWithoutAction;
}

export const EquipmentAttachmentViewModal = ({ equipmentAttachmentId, onClose }: EquipmentAttachmentViewModalProps) => {
  const { data: { equipmentAttachment: equipmentAttachmentFragment } = {} } = useQuery(EquipmentAttachmentDocument, { variables: { equipmentAttachmentId } });

  const equipmentAttachment = getFragmentData(EquipmentAttachmentWithUrlFragmentDoc, equipmentAttachmentFragment);

  return (
    <Modal backdropClose title="Add attachment" onClose={onClose} content={(
      <View style={styles.container}>
        <View style={{ width: '100%', height: 300 }}>
          {equipmentAttachment && (
            <Image source={equipmentAttachment.url} style={{ width: '100%', flex: 1 }} contentFit="cover" />
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