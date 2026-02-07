import { DimensionValue, Pressable, StyleSheet, View } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { FragmentType, TaskFragmentDoc } from '$/gql';
import { useFlagState } from '$/util';
import { CreateOrUpdateTaskModal } from './CreateOrUpdateTaskModal';
import { Dispatch } from 'react';

type EditTaskButtonProps = { task: FragmentType<typeof TaskFragmentDoc>; width?: DimensionValue, height?: DimensionValue, onPress?: Dispatch<void> };

export const EditTaskButton = ({ task, width, height, onPress }: EditTaskButtonProps) => {
  const { value: isModalVisible, setTrue: showModal, setFalse: hideModal } = useFlagState();
  return (
    <>
      {isModalVisible && <CreateOrUpdateTaskModal task={task} onClose={hideModal} />}
      <Pressable onPress={() => {
        showModal();
        onPress?.();
      }}>
        <View style={[styles.action, { width, height }]}>
          <Feather name='edit-2' size={25} color="white" />
        </View>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  actionsContainer: {
    display: 'flex', flexDirection: 'row'
  },
  action: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'blue',
  },
});