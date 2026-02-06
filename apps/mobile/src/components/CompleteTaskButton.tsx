import { DimensionValue, Pressable, StyleSheet, View } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { ComponentProps } from 'react';

type CompleteTaskButtonProps = { width?: DimensionValue, height?: DimensionValue } & ComponentProps<typeof Pressable>;

export const CompleteTaskButton = ({ width, height, ...props }: CompleteTaskButtonProps) => {
  return (
    <Pressable {...props}>
      <View style={[styles.action, { width, height }]}>
        <Feather name='check' size={25} color="white" />
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