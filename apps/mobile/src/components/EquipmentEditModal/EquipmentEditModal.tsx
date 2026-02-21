import { DispatchWithoutAction, useState } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { Modal } from '../Modal';
import { StyledTextInput } from '../StyledTextInput';
import { CreateEquipmentDocument, UpdateEquipmentDocument, FragmentType, getFragmentData, EquipmentFragmentDoc } from '$/gql';
import { useMutation } from '@apollo/client/react';

type EquipmentEditModalProps = {
  equipment?: FragmentType<typeof EquipmentFragmentDoc>;
  onClose: DispatchWithoutAction;
}

export const EquipmentEditModal = ({ equipment: equipmentFragment, onClose }: EquipmentEditModalProps) => {
  const equipment = getFragmentData(EquipmentFragmentDoc, equipmentFragment);

  const [name, setName] = useState(equipment?.name ?? '');

  const [createEquipment] = useMutation(CreateEquipmentDocument);
  const [updateEquipment] = useMutation(UpdateEquipmentDocument);

  const doAddEquipment = async () => {
    if (equipment) {

      await updateEquipment({
        variables: {
          equipmentId: equipment.id,
          input: {
            name,
          }
        },
      });
    } else {
      await createEquipment({
        variables: {
          input: {
            name,
          }
        },
        update(cache) {
          cache.evict({ fieldName: 'equipments' })
        }
      });

    }
  }

  const onSubmit = async () => {
    await doAddEquipment();
    onClose();
  }

  return (
    <Modal backdropClose title="Add equipment" onClose={onClose} content={(
      <View style={styles.container}>
        <StyledTextInput value={name} onChangeText={setName} placeholder="Name" />
        <Button onPress={onSubmit} title="Submit" />
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