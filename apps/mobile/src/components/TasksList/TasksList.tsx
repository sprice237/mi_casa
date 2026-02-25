import { getFragmentData, TaskFragmentDoc, TasksDocument, TaskStatus } from '$/gql';
import { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@apollo/client/react';
import { SwipeListView } from 'react-native-swipe-list-view';
import { TaskListItem } from './TasksListItem';
import { Border } from './Border';
import { TaskListItemActions } from './TasksListItemActions';
import { AddTaskButton } from '../AddTaskButton';
import { useFlagState } from '$/util';
import { CreateOrUpdateTaskModal } from '../CreateOrUpdateTaskModal';

const ROW_HEIGHT = 60;

type EntriesListProps = ComponentProps<typeof View> & {
  status?: TaskStatus;
  showAddTaskButton?: boolean;
  equipmentId?: string;
};

export const TasksList = ({ status, showAddTaskButton, equipmentId, ...props }: EntriesListProps) => {
  const { value: isCreateModalVisible, setTrue: showCreateModal, setFalse: hideCreateModal } = useFlagState();
  const { data, refetch, loading } = useQuery(TasksDocument, { variables: { filter: { status: status ?? null, equipmentId: equipmentId ?? null } } });
  const tasks = data?.tasks;

  return (
    <>
      {isCreateModalVisible && <CreateOrUpdateTaskModal onClose={hideCreateModal} defaultValues={{ equipmentId }} />}
      <View {...props} style={[props.style, styles.container]}>
        <SwipeListView
          style={styles.list}
          contentContainerStyle={styles.contentContainer}
          refreshing={loading}
          onRefresh={refetch}
          data={tasks}
          keyExtractor={(taskFragment) => getFragmentData(TaskFragmentDoc, taskFragment).id}
          ItemSeparatorComponent={Border}
          renderItem={({ item: task }) => (
            <TaskListItem task={task} rowHeight={ROW_HEIGHT} />
          )}
          renderHiddenItem={({ item: task }, rowMap) => (
            <TaskListItemActions itemWidth={ROW_HEIGHT} task={task}
              onPress={() => rowMap[getFragmentData(TaskFragmentDoc, task).id].closeRow()}
            />
          )}
          stopLeftSwipe={ROW_HEIGHT * TaskListItemActions.numLeftButtons}
          stopRightSwipe={-ROW_HEIGHT * TaskListItemActions.numRightButtons}
          leftOpenValue={ROW_HEIGHT * TaskListItemActions.numLeftButtons}
          rightOpenValue={-ROW_HEIGHT * TaskListItemActions.numRightButtons}
          ListEmptyComponent={() => <View><Text>Empty</Text></View>}
        />
        {showAddTaskButton && <AddTaskButton height={ROW_HEIGHT} onPress={showCreateModal} />}
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

