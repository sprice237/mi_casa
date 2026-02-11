import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Dispatch, useMemo } from 'react';
import { buildCalendarWeeks } from './util';
import { Day } from 'date-fns';
import { DayBox } from './Day';
import { UTCDate } from '@date-fns/utc';

type DaysOfMonthProps = {
  month: UTCDate;
  weekStartsOn: Day;
  selectedDate: UTCDate | null;
  onSelectedDateChange: Dispatch<DaysOfMonthProps['selectedDate']>
  dateHasIndicator?: (date: UTCDate) => boolean;
}

export const DaysOfMonth = ({ month, weekStartsOn, selectedDate, onSelectedDateChange, dateHasIndicator }: DaysOfMonthProps) => {
  const calendarWeeks = useMemo(() => buildCalendarWeeks({ date: month, weekStartsOn }), [month]);

  return (
    <View style={styles.container}>
      {calendarWeeks.map((week, index) => (
        <View key={index} style={styles.week}>
          {week.map((date, dayIndex) => (
            <DayBox
              key={dayIndex}
              date={date}
              isSelected={!!selectedDate && !!date && date.getTime() === selectedDate.getTime()}
              onPress={() => onSelectedDateChange(date)}
              hasIndicator={date && dateHasIndicator && dateHasIndicator ? dateHasIndicator(date) : false} />
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
    flex: 1,
  },
  dayNumberContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: {
    backgroundColor: 'lightblue',
  }
});