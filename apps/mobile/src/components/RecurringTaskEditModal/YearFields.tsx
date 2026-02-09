import { RecurringTaskRule } from '@mi_casa/common';
import { Dispatch } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StyledTextInput } from '../StyledTextInput';
import { MonthSelect } from '../MonthSelect';

type YearFieldsProps = {
  rule: Extract<RecurringTaskRule, { type: 'year' }>;
  onChange: Dispatch<YearFieldsProps['rule']>;
}

export const YearFields = ({ rule, onChange }: YearFieldsProps) => {
  return (
    <>
      <View style={styles.row}>
        <Text>Repeat every</Text>
        <View style={{ flex: 1 }}>
          <StyledTextInput value={String(rule.interval)} onChangeText={(text) => onChange({ ...rule, interval: Number(text) })} keyboardType="numeric" />
        </View>
        <Text>years</Text>
      </View>
      <View style={styles.row}>
        <Text>Month:</Text>
        <View style={{ flex: 1 }}>
          <MonthSelect value={rule.month} onChange={(month) => onChange({ ...rule, month })} />
        </View>
      </View>
      <View style={styles.row}>
        <Text>Day of month:</Text>
        <View style={{ flex: 1 }}>
          <StyledTextInput value={String(rule.dom)} onChangeText={(text) => onChange({ ...rule, dom: Number(text) })} keyboardType="numeric" />
        </View>
      </View>
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