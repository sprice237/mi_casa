import { StyleSheet, Text, View } from 'react-native';
import { useMemo } from 'react';
import { buildCalendarWeeks } from './util';
import { Day } from 'date-fns';

type DaysOfMonthProps = {
  date: Date;
  weekStartsOn: Day;
}

export const DaysOfMonth = ({ date, weekStartsOn }: DaysOfMonthProps) => {
  const calendarWeeks = useMemo(() => buildCalendarWeeks({ date, weekStartsOn }), [date]);

  return (
    <View style={styles.container}>
      {calendarWeeks.map((week, index) => (
        <View key={index} style={styles.week}>
          {week.map((day, dayIndex) => (
            <View key={dayIndex} style={styles.day}>
              {day !== null ? <Text>{day}</Text> : null}
            </View>
          ))}
        </View>
      ))}
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
  week: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },
  day: {
    flex: 1
  }
});