import { Pressable, StyleSheet, Text, View } from 'react-native';
import { startOfMonth, add, format } from 'date-fns';
import { utc, UTCDate } from '@date-fns/utc';
import { Dispatch } from 'react';

type HeaderProps = {
  month: UTCDate;
  onMonthChange: Dispatch<HeaderProps['month']>;
}

export const Header = ({ month, onMonthChange }: HeaderProps) => {
  const prevMonth = () => {
    onMonthChange(startOfMonth(add(month, { months: -1, }), { in: utc }));
  }

  const nextMonth = () => {
    onMonthChange(startOfMonth(add(month, { months: 1, }), { in: utc }));
  }

  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={prevMonth}>
        <Text>Prev</Text>
      </Pressable>
      <Text style={{ marginHorizontal: 20, fontWeight: 'bold' }}>{format(month, 'MMMM yyyy')}</Text>
      <Pressable style={styles.button} onPress={nextMonth}>
        <Text>Next</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { height: 50, display: 'flex', flexDirection: 'row', alignItems: 'center' },
  button: { borderWidth: 1, padding: 10, borderRadius: 5 },
});