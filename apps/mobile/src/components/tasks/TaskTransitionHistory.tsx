import { getFragmentData, TaskTransitionFragmentDoc, FragmentType } from '$/gql';
import { ComponentProps } from 'react';
import { FlatList, View } from 'react-native';
import { TaskTransitionEntry } from './TaskTransitionEntry';

type TaskTransitionHistoryProps = ComponentProps<typeof View> & {
  transitions: readonly FragmentType<typeof TaskTransitionFragmentDoc>[];
}

export const TaskTransitionHistory = ({ transitions, ...viewProps }: TaskTransitionHistoryProps) => {
  return (
    <View {...viewProps}>
      <FlatList
        data={transitions}
        keyExtractor={item => getFragmentData(TaskTransitionFragmentDoc, item).id}
        renderItem={({ item }) => <TaskTransitionEntry transition={item} />}
        ItemSeparatorComponent={() => <View style={{ height: 30 }} />}
      />
    </View>
  );
};
