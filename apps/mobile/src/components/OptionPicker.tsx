import { Dispatch, ReactNode, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Modal } from "./Modal";
import { Picker } from "@react-native-picker/picker";

type OptionPickerProps<T> = {
  options: readonly T[]
  value: T | null;
  emptyLabel?: string;
  hideEmpty?: boolean;
  onChange: Dispatch<OptionPickerProps<T>['value']>;
  getKey: (option: T) => string;
  getLabel: (option: T) => string;
  children: (option: T | null) => ReactNode;
}

export const OptionPicker = <T,>({ options, value, emptyLabel = '(None)', hideEmpty = false, onChange, getKey, getLabel, children }: OptionPickerProps<T>) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const open = () => {
    setIsPickerOpen(true);
  }

  const close = () => {
    setIsPickerOpen(false);
  }

  const setValue = (key: string | null) => {
    onChange(options.find(o => getKey(o) === key) ?? null);
  }

  return (
    <>
      <Pressable style={styles.container} onPress={open}>
        {children(value)}
      </Pressable>
      {isPickerOpen && (
        <Modal hideHeader backdropClose onClose={close} bodyStyle={{ padding: 0 }} content={(
          <View>
            <Picker
              mode="dropdown"
              selectedValue={value ? getKey(value) : null}
              onValueChange={(itemValue) =>
                setValue(itemValue)
              }
              itemStyle={{ color: 'black' }}>
              {!hideEmpty && <Picker.Item label={emptyLabel} value={null} />}
              {options.map(option => (
                <Picker.Item key={getKey(option)} label={getLabel(option)} value={getKey(option)} />
              ))}
            </Picker>
          </View>
        )}>
        </Modal>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 5
  },
})