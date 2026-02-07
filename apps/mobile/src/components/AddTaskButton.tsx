import { DimensionValue, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFlagState } from '$/util';
import { CreateOrUpdateTaskModal } from './CreateOrUpdateTaskModal';

type AddTaskButtonProps = { width?: DimensionValue, height?: DimensionValue };

export const AddTaskButton = ({ width, height, ...props }: AddTaskButtonProps) => {
  const { value: isModalVisible, setTrue: showModal, setFalse: hideModal } = useFlagState();

  return (
    <>
      {isModalVisible && <CreateOrUpdateTaskModal onClose={hideModal} />}
      <Pressable onPress={showModal}>
        <View style={[styles.action, { width, height }]}>
          <Text>Add new task</Text>
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
    backgroundColor: 'green',
  },
});