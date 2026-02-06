import { DimensionValue, Pressable, StyleSheet, View } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { ComponentProps } from 'react';

type DeleteButtonProps = { width?: DimensionValue, height?: DimensionValue } & ComponentProps<typeof Pressable>;

export const DeleteButton = ({ width, height, ...props }: DeleteButtonProps) => {
  return (
    <Pressable {...props}>
      <View style={[styles.action, { width, height }]}>
        <AntDesign name='delete' size={25} color="white" />
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
    display: 'flex',
    flexDirection: 'row'
  },
  action: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
  },
});