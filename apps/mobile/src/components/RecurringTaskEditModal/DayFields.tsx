import { RecurringTaskRule } from '@mi_casa/common';
import { Dispatch } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StyledTextInput } from '../StyledTextInput';



type DayFieldsProps = {
  rule: Extract<RecurringTaskRule, { type: 'day' }>;
  onChange: Dispatch<DayFieldsProps['rule']>;
}

export const DayFields = ({ rule, onChange }: DayFieldsProps) => {
  return (
    <>
      <View style={styles.row}>
        <Text>Repeat every</Text>
        <View style={{ flex: 1 }}>
          <StyledTextInput value={String(rule.interval)} onChangeText={(text) => onChange({ ...rule, interval: Number(text) })} keyboardType="numeric" />
        </View>
        <Text>days</Text>
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