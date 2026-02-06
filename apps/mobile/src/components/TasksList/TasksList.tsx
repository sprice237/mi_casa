import { CreateTaskDocument, TasksDocument } from '$/gql';
import { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useMutation, useQuery } from '@apollo/client/react';
import { SwipeListView } from 'react-native-swipe-list-view';
import { TaskListItem } from './TasksListItem';
import { Border } from './Border';
import { TaskListItemActions } from './TasksListItemActions';
import { AddTaskButton } from '../AddTaskButton';

const ROW_HEIGHT = 60;

type EntriesListProps = ComponentProps<typeof View>;

export const TasksList = ({ ...props }: EntriesListProps) => {
  const { data, refetch, loading } = useQuery(TasksDocument);
  const tasks = data?.tasks;

  const [createTask] = useMutation(CreateTaskDocument);

  const doAddTask = () => {
    createTask({
      variables: {
        input: {
          name: 'New task'
        }
      },
      refetchQueries: [TasksDocument]
    })
  }

  return (
    <View {...props} style={[props.style, styles.container]}>
      <SwipeListView
        style={styles.list}
        refreshing={loading}
        onRefresh={refetch}
        data={tasks}
        ItemSeparatorComponent={Border}
        renderItem={({ item: task }) => (
          <TaskListItem task={task} rowHeight={ROW_HEIGHT} />
        )}
        renderHiddenItem={({ item: task }) => (
          <TaskListItemActions itemWidth={ROW_HEIGHT} task={task}
          />
        )}
        stopLeftSwipe={ROW_HEIGHT * TaskListItemActions.numLeftButtons}
        stopRightSwipe={-ROW_HEIGHT * TaskListItemActions.numRightButtons}
        leftOpenValue={ROW_HEIGHT * TaskListItemActions.numLeftButtons}
        rightOpenValue={-ROW_HEIGHT * TaskListItemActions.numRightButtons}
        ListEmptyComponent={() => <View><Text>Empty</Text></View>}
      />
      <AddTaskButton height={ROW_HEIGHT} onPress={doAddTask} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  list: {
    flex: 1
  }
});

