import { Dispatch } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const dayOfWeekLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

type DayOfWeekButtonsProps<Multi extends boolean> = {
  multi?: Multi;
  value: Multi extends true ? number[] : (number | null);
  onChange: Dispatch<DayOfWeekButtonsProps<Multi>['value']>;
}

export const DayOfWeekButtons = <Multi extends boolean = false>({multi, value, onChange}: DayOfWeekButtonsProps<Multi>) => {
  return (
    <View style={styles.container}>
      {dayOfWeekLabels.map((label, index) => {
        const selected = multi ? (value as DayOfWeekButtonsProps<true>['value']).includes(index) : (value === index)

        const onPress = () => {
          if (multi) {
            const _onChange = onChange as Dispatch<DayOfWeekButtonsProps<true>['value']>;
            if (selected) {
              _onChange((value as DayOfWeekButtonsProps<true>['value']).filter(v => v !== index));
            } else {
              _onChange([...(value as DayOfWeekButtonsProps<true>['value']), index]);
            }
          } else {
            const _onChange = onChange as Dispatch<DayOfWeekButtonsProps<false>['value']>;
            _onChange(selected ? null : index as DayOfWeekButtonsProps<false>['value']);
          }
        }

        return (
          <Pressable key={index} style={[styles.button, selected && styles.buttonSelected]} onPress={onPress}>
            <Text>{label}</Text>
          </Pressable>
        )
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  button: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 100,
    padding: 5,
    height: 30,
    width: 30,
    backgroundColor: 'white'
  },
  buttonSelected: {
    backgroundColor: '#9ff',
  }
})