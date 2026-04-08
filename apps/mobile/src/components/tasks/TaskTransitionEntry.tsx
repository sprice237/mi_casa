import { getFragmentData, TaskTransitionFragmentDoc, UserFragmentDoc, FragmentType } from '$/gql';
import { ComponentProps } from 'react';
import { Text, View } from 'react-native';
import { format } from 'date-fns/format';
import { TaskStatus } from '$/gql';

const statusLabels: Record<TaskStatus, string> = {
  READY_TO_BEGIN: 'Ready to Begin',
  IN_PROGRESS: 'In Progress',
  COMPLETE: 'Complete',
};

type TaskTransitionEntryProps = ComponentProps<typeof View> & {
  transition: FragmentType<typeof TaskTransitionFragmentDoc>;
}

export const TaskTransitionEntry = ({ transition: transitionFragment, ...viewProps }: TaskTransitionEntryProps) => {
  const transition = getFragmentData(TaskTransitionFragmentDoc, transitionFragment);
  const performedBy = transition.performedBy
    ? getFragmentData(UserFragmentDoc, transition.performedBy)
    : null;

  return (
    <View {...viewProps}>
      <Text>{format(transition.createdAt, 'PPPPp')}</Text>
      <Text>{statusLabels[transition.nextStatus]}</Text>
      {performedBy && <Text>{performedBy.username}</Text>}
    </View>
  );
};
