import { FragmentType, getFragmentData, RecurringTaskFragmentDoc, RecurringTasksDocument } from '$/gql';
import { ComponentProps, Dispatch } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@apollo/client/react';
import { SwipeListView } from 'react-native-swipe-list-view';
import { RecurringTasksListItem } from './RecurringTasksListItem';
import { Border } from './Border';
import { RecurringTasksListItemActions } from './RecurringTasksListItemActions';
import { AddTaskButton } from '../AddTaskButton';
import { useFlagState } from '$/util/util';
import { RecurringTaskEditModal } from '../RecurringTaskEditModal';

const ROW_HEIGHT = 60;

type RecurringTasksListProps = ComponentProps<typeof View> & {
  equipmentId?: string;
  onRecurringTaskPress?: Dispatch<FragmentType<typeof RecurringTaskFragmentDoc>>;
}

export const RecurringTasksList = ({ equipmentId, onRecurringTaskPress, ...props }: RecurringTasksListProps) => {
  const { value: isCreateModalVisible, setTrue: showCreateModal, setFalse: hideCreateModal } = useFlagState();
  const { data, refetch, loading } = useQuery(RecurringTasksDocument, { variables: { filter: { equipmentId: equipmentId ?? null } } });
  const recurringTasks = data?.recurringTasks;


  return (
    <>
      {isCreateModalVisible && <RecurringTaskEditModal onClose={hideCreateModal} defaultValues={{ equipmentId }} />}
      <View {...props} style={[props.style, styles.container]}>
        <SwipeListView
          style={styles.list}
          contentContainerStyle={styles.contentContainer}
          refreshing={loading}
          onRefresh={refetch}
          data={recurringTasks}
          keyExtractor={(recurringTaskFragment) => getFragmentData(RecurringTaskFragmentDoc, recurringTaskFragment).id}
          ItemSeparatorComponent={Border}
          renderItem={({ item: recurringTask }) => onRecurringTaskPress ?
            (
              <Pressable onPress={() => onRecurringTaskPress(recurringTask)}>
                <RecurringTasksListItem recurringTask={recurringTask} rowHeight={ROW_HEIGHT} />
              </Pressable>
            ) : <RecurringTasksListItem recurringTask={recurringTask} rowHeight={ROW_HEIGHT} />
          }
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

