import { getFragmentData, RecurringTaskProjectionFragmentDoc, RecurringTaskProjectionsDocument } from '$/gql';
import { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useQuery, useSuspenseQuery } from '@apollo/client/react';
import { SwipeListView } from 'react-native-swipe-list-view';
import { RecurringTaskProjectionsListItem } from './RecurringTaskProjectionsListItem';
import { Border } from './Border';
import { UTCDate } from '@date-fns/utc';

const ROW_HEIGHT = 60;

type RecurringTaskProjectionsListProps = ComponentProps<typeof View> & {
  startDate: UTCDate;
  endDate: UTCDate;
}

export const RecurringTaskProjectionsList = ({ startDate, endDate, ...props }: RecurringTaskProjectionsListProps) => {
  const { data: { recurringTaskProjections } = {}, refetch } = useSuspenseQuery(RecurringTaskProjectionsDocument, { variables: { input: { startDate, endDate, recurringTaskIds: null } } });
  console.log({ startDate, endDate, recurringTaskProjections })

  return (
    <View {...props} style={[props.style, styles.container]}>
      <SwipeListView
        style={styles.list}
        contentContainerStyle={styles.contentContainer}
        refreshing={false}
        onRefresh={refetch}
        data={recurringTaskProjections}
        keyExtractor={(recurringTaskProjectionFragment) => getFragmentData(RecurringTaskProjectionFragmentDoc, recurringTaskProjectionFragment).id}
        ItemSeparatorComponent={Border}
        renderItem={({ item: recurringTaskProjection }) => (
          <RecurringTaskProjectionsListItem recurringTaskProjection={recurringTaskProjection} rowHeight={ROW_HEIGHT} />
        )}
        ListEmptyComponent={() => <View><Text>Empty</Text></View>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  contentContainer: {
    // flex: 1,
    minHeight: '100%'
  },
  list: {
    flex: 1,
  }
});

