import { DimensionValue, Pressable, StyleSheet, Text, View } from 'react-native';
import { ComponentProps } from 'react';

type AddTaskButtonProps = { label?: string; width?: DimensionValue, height?: DimensionValue } & Omit<ComponentProps<typeof Pressable>, 'children'>;

export const AddTaskButton = ({ label = 'Add new task', width, height, ...props }: AddTaskButtonProps) => {
  return (
    <Pressable {...props}>
      <View style={[styles.action, { width, height }]}>
        <Text>{label}</Text>
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