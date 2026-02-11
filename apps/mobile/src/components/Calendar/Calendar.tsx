import { StyleSheet, View } from 'react-native';
import { WeekHeader } from './WeekHeader';
import { DaysOfMonth } from './DaysOfMonth';
import { Header } from './Header';
import { Dispatch } from 'react';
import { UTCDate } from '@date-fns/utc';

const weekStartsOn = 0; // Sunday

type CalendarProps = {
  month: UTCDate;
  onMonthChange: Dispatch<CalendarProps['month']>;
  selectedDate: UTCDate | null;
  onSelectedDateChange: Dispatch<CalendarProps['selectedDate']>
  dateHasIndicator?: (date: UTCDate) => boolean;
}

export const Calendar = ({ month, onMonthChange, selectedDate, onSelectedDateChange, dateHasIndicator }: CalendarProps) => {
  return (
    <View style={styles.container}>
      <Header month={month} onMonthChange={onMonthChange} />
      <WeekHeader weekStartsOn={weekStartsOn} />
      <DaysOfMonth month={month} weekStartsOn={weekStartsOn} selectedDate={selectedDate} onSelectedDateChange={onSelectedDateChange} dateHasIndicator={dateHasIndicator} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  calendarHeader: { height: 50, display: 'flex', flexDirection: 'row', alignItems: 'center' },
  button: { borderWidth: 1, padding: 10, borderRadius: 5 },
});