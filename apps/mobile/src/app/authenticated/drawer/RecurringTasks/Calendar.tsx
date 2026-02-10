import { StyleSheet, View } from 'react-native';
import { startOfMonth } from 'date-fns';
import { useState } from 'react';
import { Calendar as CalendarComponent } from '$/components/Calendar';

export default function Calendar() {
  const [date, setDate] = useState(() => startOfMonth(new Date()));
  return (
    <View style={styles.container}>
      <CalendarComponent date={date} onDateChange={setDate} />
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
});