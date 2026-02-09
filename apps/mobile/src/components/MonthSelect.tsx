import { Dispatch } from 'react';
import { StyleSheet, Text } from 'react-native';
import { OptionPicker } from './OptionPicker';

const monthValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

const monthLabelsByValue: Record<typeof monthValues[number], string> = {
  1: 'January',
  2: 'February',
  3: 'March',
  4: 'April',
  5: 'May',
  6: 'June',
  7: 'July',
  8: 'August',
  9: 'September',
  10: 'October',
  11: 'November',
  12: 'December'
};

type MonthSelectProps<AllowNull> = {
  allowNull?: AllowNull;
  value: AllowNull extends true ? (number | null) : number;
  onChange: Dispatch<MonthSelectProps<AllowNull>['value']>
}

export const MonthSelect = <AllowNull extends boolean = false>({ allowNull, value, onChange }: MonthSelectProps<AllowNull>) => {
  return (
    <OptionPicker
      options={monthValues}
      value={value}
      onChange={x => { if (x !== null && x !== undefined || allowNull) { onChange(x as never) } }}
      getKey={option => option?.toString() ?? ''}
      getLabel={option => monthLabelsByValue[option as never] ?? ''}
      hideEmpty={!allowNull}
    >
      {option => <Text>{monthLabelsByValue[option as never] ?? 'None'}</Text>}
    </OptionPicker>
  );
}