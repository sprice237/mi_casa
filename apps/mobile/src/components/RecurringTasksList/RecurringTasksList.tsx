import { getFragmentData, RecurringTaskFragmentDoc, RecurringTasksDocument } from '$/gql';
import { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@apollo/client/react';
import { SwipeListView } from 'react-native-swipe-list-view';
import { RecurringTasksListItem } from './RecurringTasksListItem';
import { Border } from './Border';
import { RecurringTasksListItemActions } from './RecurringTasksListItemActions';
import { AddTaskButton } from '../AddTaskButton';
import { useFlagState } from '$/util';
import { RecurringTaskEditModal } from '../RecurringTaskEditModal';

const ROW_HEIGHT = 60;

type RecurringTasksListProps = ComponentProps<typeof View>

export const RecurringTasksList = ({ ...props }: RecurringTasksListProps) => {
  const { value: isCreateModalVisible, setTrue: showCreateModal, setFalse: hideCreateModal } = useFlagState();
  const { data, refetch, loading } = useQuery(RecurringTasksDocument);
  const recurringTasks = data?.recurringTasks;


  return (
    <>
      {isCreateModalVisible && <RecurringTaskEditModal onClose={hideCreateModal} />}
      <View {...props} style={[props.style, styles.container]}>
        <SwipeListView
          style={styles.list}
          contentContainerStyle={styles.contentContainer}
          refreshing={loading}
          onRefresh={refetch}
          data={recurringTasks}
          keyExtractor={(recurringTaskFragment) => getFragmentData(RecurringTaskFragmentDoc, recurringTaskFragment).id}
          ItemSeparatorComponent={Border}
          renderItem={({ item: task }) => (
            <RecurringTasksListItem recurringTask={task} rowHeight={ROW_HEIGHT} />
          )}
          renderHiddenItem={({ item: recurringTask }, rowMap) => (
            <RecurringTasksListItemActions itemWidth={ROW_HEIGHT} recurringTask={recurringTask}
              onPress={() => rowMap[getFragmentData(RecurringTaskFragmentDoc, recurringTask).id].closeRow()}
            />
          )}
          stopRightSwipe={-ROW_HEIGHT * RecurringTasksListItemActions.numRightButtons}
          rightOpenValue={-ROW_HEIGHT * RecurringTasksListItemActions.numRightButtons}
          ListEmptyComponent={() => <View><Text>Empty</Text></View>}
        />
        <AddTaskButton height={ROW_HEIGHT} label="Add new recurring task" onPress={showCreateModal} />
      </View>

    </>
  );
};

const styles = StyleSheet.create({
  container: {
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

