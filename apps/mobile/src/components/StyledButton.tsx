import { ComponentProps, DispatchWithoutAction, useState } from 'react';
import { Pressable, StyleProp, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';

type StyledButtonProps = {
  text: string;
  onPress: DispatchWithoutAction;
  pressableStyle?: StyleProp<ViewStyle>;
  pressableInStyle?: StyleProp<ViewStyle>;
  pressableOutStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  textInStyle?: StyleProp<TextStyle>;
  textOutStyle?: StyleProp<TextStyle>;
};

export const StyledButton = ({ text, onPress, pressableStyle, pressableInStyle, pressableOutStyle, textStyle, textInStyle, textOutStyle }: StyledButtonProps) => {
  const [isPressIn, setIsPressIn] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.pressable,
        isPressIn ? [styles.pressableIn] : [styles.pressableOut],
        pressableStyle,
        isPressIn ? [pressableInStyle] : [pressableOutStyle],
      ]}
      onPressIn={() => setIsPressIn(true)}
      onPressOut={() => setIsPressIn(false)}
    >
      <Text style={[styles.text, isPressIn ? [styles.textPressIn, textInStyle] : [styles.textPressOut, textOutStyle], textStyle]}>
        {text}
      </Text>
    </Pressable>
  );
};

const inColor = '#666';
const outColor = '#000';

const styles = StyleSheet.create({
  pressable: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 10,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  pressableIn: {
    borderColor: inColor,
  },
  pressableOut: {
    borderColor: outColor,
  },
  text: {},
  textPressIn: {
    color: inColor
  },
  textPressOut: {
    color: outColor
  },
});