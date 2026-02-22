import { StyleSheet, Text, View } from 'react-native';
import { add, startOfMonth } from 'date-fns';
import { utc, UTCDate } from '@date-fns/utc'
import { Suspense, useCallback, useMemo, useState } from 'react';
import { Calendar as CalendarComponent } from '$/components/Calendar';
import { useQuery } from '@apollo/client/react';
import { getFragmentData, RecurringTaskProjectionFragmentDoc, RecurringTaskProjectionsDocument } from '$/gql';
import { RecurringTaskProjectionsList } from '$/components/RecurringTaskProjectionsList';

export default function Calendar() {
  const [calendarDate, setCalendarDate] = useState(() => startOfMonth(new Date(), { in: utc }));
  const [detailDate, setDetailDate] = useState<UTCDate | null>(null);

  const { data: { recurringTaskProjections } = {} } = useQuery(RecurringTaskProjectionsDocument, {
    variables: {
      input: {
        startDate: calendarDate,
        endDate: new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 0),
        recurringTaskIds: null
      }
    }
  });

  const datesWithRecurringTask = useMemo(() => new Set((recurringTaskProjections ?? []).map(projection => getFragmentData(RecurringTaskProjectionFragmentDoc, projection).date.getTime())), [recurringTaskProjections]);
  const dateHasIndicator = useCallback((date: Date) => datesWithRecurringTask.has(date.getTime()), [datesWithRecurringTask]);

  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <CalendarComponent month={calendarDate} onMonthChange={setCalendarDate} selectedDate={detailDate} onSelectedDateChange={setDetailDate} dateHasIndicator={dateHasIndicator} />
      </View>
      <View style={styles.item}>
        {detailDate && (
          <Suspense fallback={<View><Text>Loading...</Text></View>}>
            <RecurringTaskProjectionsList startDate={detailDate} endDate={add(detailDate, { days: 1 })} />
          </Suspense>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  item: {
    flex: 1
  }
});