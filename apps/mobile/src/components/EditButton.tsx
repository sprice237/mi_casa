import { DimensionValue, Pressable, StyleSheet, View } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { ComponentProps } from 'react';

type EditButtonProps = { width?: DimensionValue, height?: DimensionValue } & ComponentProps<typeof Pressable>;

export const EditButton = ({ width, height, ...props }: EditButtonProps) => {
  return (
    <Pressable {...props}>
      <View style={[styles.action, { width, height }]}>
        <Feather name='edit-2' size={25} color="white" />
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
    backgroundColor: 'blue',
  },
});