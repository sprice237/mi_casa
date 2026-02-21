import { StyleSheet, View } from 'react-native';
import { DeleteButton } from '../DeleteButton';
import { EditButton } from '../EditButton';
import { FragmentType, getFragmentData, DeleteEquipmentDocument, EquipmentFragmentDoc } from '$/gql';
import { useMutation } from '@apollo/client/react';
import { Dispatch } from 'react';
import { useFlagState } from '$/util';
import { EquipmentEditModal } from '../EquipmentEditModal';

type EquipmentsListItemActionsProps = {
  itemWidth: number;
  equipment: FragmentType<typeof EquipmentFragmentDoc>;
  onPress: Dispatch<void>
};

export const EquipmentsListItemActions = ({ itemWidth, equipment: equipmentFragment, onPress }: EquipmentsListItemActionsProps) => {
  const { value: isEditModalVisible, setTrue: showEditModal, setFalse: hideEditModal } = useFlagState();
  const equipment = getFragmentData(EquipmentFragmentDoc, equipmentFragment);

  const [deleteEquipment] = useMutation(DeleteEquipmentDocument);

  const doDeleteTask = () => {
    onPress();
    deleteEquipment({
      variables: {
        equipmentId: equipment.id,
      },
      update(cache) {
        cache.evict({ fieldName: 'equipments' })
      }
    })
  }

  return (
    <>
      {isEditModalVisible && <EquipmentEditModal equipment={equipmentFragment} onClose={hideEditModal} />}
      <View style={styles.container}>
        <View style={styles.actionsContainer}>
          <EditButton height="100%" onPress={showEditModal} width={itemWidth} />
          <DeleteButton height="100%" onPress={doDeleteTask} width={itemWidth} />
        </View>
      </View>
    </>
  );
}

EquipmentsListItemActions.numLeftButtons = 1;
EquipmentsListItemActions.numRightButtons = 2;

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