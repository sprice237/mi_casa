import { DimensionValue, Pressable, StyleSheet, Text, View } from 'react-native';
import { ComponentProps } from 'react';

type AddTaskButtonProps = { width?: DimensionValue, height?: DimensionValue } & ComponentProps<typeof Pressable>;

export const AddTaskButton = ({ width, height, ...props }: AddTaskButtonProps) => {
  return (
    <Pressable {...props}>
      <View style={[styles.action, { width, height }]}>
        <Text>Add new task</Text>
      </View>
    </Pressable>
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