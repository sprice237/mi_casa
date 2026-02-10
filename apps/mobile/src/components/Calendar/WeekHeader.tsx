import { StyleSheet, Text, View } from 'react-native';
import { eachDayOfInterval, startOfWeek, add, format, Day } from 'date-fns';
import { useMemo } from 'react';

type WeekHeaderProps = {
  date: Date;
  weekStartsOn: Day;
}

export const WeekHeader = ({ date, weekStartsOn }: WeekHeaderProps) => {
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
    height: 50,
  },
  dayName: {
    flex: 1
  }
});