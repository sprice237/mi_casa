import { StyleSheet, View } from 'react-native';
import { DeleteButton } from '../DeleteButton';
import { EditButton } from '../EditButton';
import { FragmentType, getFragmentData, DeleteRecurringTaskDocument, RecurringTaskFragmentDoc } from '$/gql';
import { useMutation } from '@apollo/client/react';
import { Dispatch } from 'react';
import { useFlagState } from '$/util/util';
import { RecurringTaskEditModal } from '../RecurringTaskEditModal';

type RecurringTasksListItemActionsProps = {
  itemWidth: number;
  recurringTask: FragmentType<typeof RecurringTaskFragmentDoc>;
  onPress: Dispatch<void>
};

export const RecurringTasksListItemActions = ({ itemWidth, recurringTask: recurringTaskFragment, onPress }: RecurringTasksListItemActionsProps) => {
  const { value: isEditModalVisible, setTrue: showEditModal, setFalse: hideEditModal } = useFlagState();
  const recurringTask = getFragmentData(RecurringTaskFragmentDoc, recurringTaskFragment);

  const [deleteRecurringTask] = useMutation(DeleteRecurringTaskDocument);

  const doDeleteTask = () => {
    onPress();
    deleteRecurringTask({
      variables: {
        recurringTaskId: recurringTask.id,
      },
      update(cache) {
        cache.evict({ fieldName: 'recurringTasks' })
      }
    })
  }

  return (
    <>
      {isEditModalVisible && <RecurringTaskEditModal recurringTask={recurringTaskFragment} onClose={hideEditModal} />}
      <View style={styles.container}>
        <View style={styles.actionsContainer}>
          <EditButton height="100%" onPress={showEditModal} width={itemWidth} />
          <DeleteButton height="100%" onPress={doDeleteTask} width={itemWidth} />
        </View>
      </View>
    </>
  );
}

RecurringTasksListItemActions.numLeftButtons = 1;
RecurringTasksListItemActions.numRightButtons = 2;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  actionsContainer: {
    display: 'flex', flexDirection: 'row'
  },
})