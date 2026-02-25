import { ComponentProps, useCallback, useMemo, useState } from "react";
import { Keyboard, TouchableWithoutFeedback, View } from "react-native";

export const useFlagState = (initialState: boolean | (() => boolean) = false) => {
  const [value, setValue] = useState(initialState);

  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  const toggleValue = useCallback(() => setValue(pv => !pv), []);

  return useMemo(() => ({ value, setTrue, setFalse, setValue, toggleValue }), [value, setTrue, setFalse, setValue, toggleValue]);
}

export function DismissKeyboardAvoidingView(props: ComponentProps<typeof View>) {
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} accessible={false}>
      <View {...props} />
    </TouchableWithoutFeedback>
  )
}
