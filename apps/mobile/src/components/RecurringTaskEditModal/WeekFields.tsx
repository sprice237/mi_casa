import { RecurringTaskRule } from '@mi_casa/common';
import { Dispatch } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StyledTextInput } from '../StyledTextInput';
import { DayOfWeekButtons } from './DayOfWeekButtons';



type WeekFieldsProps = {
  rule: Extract<RecurringTaskRule, { type: 'week' }>;
  onChange: Dispatch<WeekFieldsProps['rule']>;
}

export const WeekFields = ({ rule, onChange }: WeekFieldsProps) => {
  return (
    <>
      <View style={styles.row}>
        <Text>Repeat every</Text>
        <View style={{ flex: 1 }}>
          <StyledTextInput value={String(rule.interval)} onChangeText={(text) => onChange({ ...rule, interval: Number(text) })} keyboardType="numeric" />
        </View>
        <Text>weeks</Text>
      </View>
      <DayOfWeekButtons multi value={rule.dow} onChange={(dow) => onChange({ ...rule, dow })} />
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