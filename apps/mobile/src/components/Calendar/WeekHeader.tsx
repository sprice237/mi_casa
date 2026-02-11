import { StyleSheet, Text, View } from 'react-native';
import { eachDayOfInterval, startOfWeek, add, format, Day } from 'date-fns';
import { useMemo } from 'react';

type WeekHeaderProps = {
  weekStartsOn: Day;
}

const date = new Date();

export const WeekHeader = ({ weekStartsOn }: WeekHeaderProps) => {
  const daysOfWeek = useMemo(() => {
    const firstDayOfWeek = startOfWeek(date, { weekStartsOn });

    return eachDayOfInterval({
      start: firstDayOfWeek,
      end: add(firstDayOfWeek, { days: 6 }),
    }).map((day) => format(day, 'EEE'));
  }, [date])

  return (
    <View style={styles.weekHeader}>
      {daysOfWeek.map((dayName) => (
        <View key={dayName} style={styles.dayName}>
          <Text>{dayName}</Text>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  weekHeader: {
    display: 'flex',
    flexDirection: 'row',
    height: 20,
  },
  dayName: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  }
});