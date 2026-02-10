import { StyleSheet, View } from 'react-native';
import { WeekHeader } from './WeekHeader';
import { DaysOfMonth } from './DaysOfMonth';
import { Header } from './Header';

const weekStartsOn = 0; // Sunday

type CalendarProps = {
  date: Date;
  onDateChange: (date: Date) => void;
}

export const Calendar = ({ date, onDateChange }: CalendarProps) => {
  return (
    <View style={styles.container}>
      <Header date={date} onDateChange={onDateChange} />
      <WeekHeader date={date} weekStartsOn={weekStartsOn} />
      <DaysOfMonth date={date} weekStartsOn={weekStartsOn} />
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