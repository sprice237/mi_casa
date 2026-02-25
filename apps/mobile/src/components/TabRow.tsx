import { ComponentProps, Dispatch } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type TabRowProps<T, K extends string> = Omit<ComponentProps<typeof View>, 'children'> & {
  options: readonly T[],
  getKey: (_: T) => K;
  getLabel: (_: T) => string;
  selected: K;
  onSelect: Dispatch<K>;
}

export const TabRow = <T, K extends string>({ options, getKey, getLabel, selected, onSelect, ...viewProps }: TabRowProps<T, K>) => {
  return (
    <View {...viewProps} style={[styles.row, viewProps.style]}>
      {options.map(option => (
        <Pressable
          key={getKey(option)}
          style={[styles.button, getKey(option) === selected ? styles.selectedButton : undefined]}
          onPress={() => onSelect(getKey(option))}
        >
          <Text>{getLabel(option)}</Text>
        </Pressable>
      ))}
    </View>

  )
}

const styles = StyleSheet.create({
  row: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  button: {
    height: 40,
    borderWidth: 1,
    borderColor: 'black',
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedButton: {
    backgroundColor: '#9ff',
  },
});