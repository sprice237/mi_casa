import { ReactFormExtendedApi } from "@tanstack/react-form";
import { isEqual } from "lodash";
import { ComponentProps, useCallback, useEffect, useMemo, useRef, useState } from "react";
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

export function useFormAutoSubmitEffect(form: ReactFormExtendedApi<any, any, any, any, any, any, any, any, any, any, any, any>, timeout: number = 100) {
  const timeoutRef = useRef<number | null>(null);

  useEffect(function autoSubmitForm() {
    const unsubscribe = form.store.subscribe(
      ({ currentVal, prevVal }) => {
        if (isEqual(currentVal.values, prevVal.values)) {
          return;
        }

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }

        timeoutRef.current = setTimeout(() => {
          timeoutRef.current = null;
          form.handleSubmit();
        }, 100);
      }
    );

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      unsubscribe();
    }
  }, [form, timeout]);
}