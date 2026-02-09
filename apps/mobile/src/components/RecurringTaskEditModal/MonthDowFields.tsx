import { RecurringTaskRule } from '@mi_casa/common';
import { Dispatch } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StyledTextInput } from '../StyledTextInput';
import { DayOfWeekButtons } from './DayOfWeekButtons';

type MonthDowFieldsProps = {
  rule: Extract<RecurringTaskRule, { type: 'month_dow' }>;
  onChange: Dispatch<MonthDowFieldsProps['rule']>;
}

export const MonthDowFields = ({ rule, onChange }: MonthDowFieldsProps) => {
  return (
    <>
      <View style={styles.row}>
        <Text>Repeat every</Text>
        <View style={{ flex: 1 }}>
          <StyledTextInput value={String(rule.interval)} onChangeText={(text) => onChange({ ...rule, interval: Number(text) })} keyboardType="numeric" />
        </View>
        <Text>months</Text>
      </View>
      <View style={styles.row}>
        <Text>Week of month:</Text>
        <View style={{ flex: 1 }}>
          <StyledTextInput value={String(rule.wom)} onChangeText={(text) => onChange({ ...rule, wom: Number(text) })} keyboardType="numeric" />
        </View>
      </View>
      <DayOfWeekButtons value={rule.dow} onChange={(dow) => dow !== null && onChange({ ...rule, dow })} />
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  }
})