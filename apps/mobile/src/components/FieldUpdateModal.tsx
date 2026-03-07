import { Dispatch, useState } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { useFlagState } from '$/util/util';
import { Modal } from './Modal';
import { StyledTextInput } from './StyledTextInput';
import { StyledButton } from './StyledButton';

type FieldUpdateModalProps = {
  type: 'text';
  value: string;
  onChange: Dispatch<string>
}

export const FieldUpdateModal = ({ value, onChange }: FieldUpdateModalProps) => {
  const { value: isModalVisible, setTrue: showModal, setFalse: hideModal } = useFlagState();
  const [workingValue, setWorkingValue] = useState(value);

  const doLaunchModal = () => {
    setWorkingValue(value);
    showModal();
  }

  const doSubmit = () => {
    onChange(workingValue);
    hideModal();
  }

  return (
    <>
      {isModalVisible &&
        <Modal backdropClose title="Update field" onClose={hideModal} content={(
          <View style={styles.modalContainer}>
            <StyledTextInput value={workingValue} onChangeText={setWorkingValue} />
            <Button onPress={doSubmit} title="Submit" />
          </View>
        )} />
      }
      <StyledButton text={value} onPress={doLaunchModal} />
    </>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    display: 'flex',
    flexDirection: 'column',
    padding: 10,
    gap: 10
  },
});

