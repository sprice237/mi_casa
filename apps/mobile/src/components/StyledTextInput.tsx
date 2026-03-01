import { ComponentProps } from 'react';
import {
  StyleSheet,
  TextInput,
} from 'react-native';

type StyledTextInputProps = ComponentProps<typeof TextInput>;

export const StyledTextInput = (props: StyledTextInputProps) => {
  return (
    <TextInput
      placeholderTextColor="grey"
      {...props}
      style={[styles.textInput, props.style]}
    />
  );
}

const styles = StyleSheet.create({
  textInput: {
    height: 40,
    width: '100%',
    borderWidth: 1,
    padding: 10,
  },
});