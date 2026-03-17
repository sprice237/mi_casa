import { getFragmentData, ActivityFeedDocument, ActivityFeedFragmentDoc, ActivityFeedEntryFragmentDoc, AttachmentFragmentDoc } from '$/gql';
import { ComponentProps } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@apollo/client/react';
import { FullScreenLoader } from '../FullScreenLoader';
import { ActivityFeedEntry } from './ActivityFeedEntry';
import { AddTaskButton } from '../AddTaskButton';
import { useFlagState } from '$/util/util';
import { CreateActivityFeedEntryModal } from './CreateActivityFeedEntryModal';

type ActivityFeedProps = ComponentProps<typeof View> & {
  activityFeedId: string;
}

export const ActivityFeed = ({ activityFeedId, ...viewProps }: ActivityFeedProps) => {
  const { value: isCreateModalVisible, setTrue: showCreateModal, setFalse: hideCreateModal } = useFlagState();
  const { data, refetch, loading } = useQuery(ActivityFeedDocument, { variables: { activityFeedId } });
  const entries = getFragmentData(ActivityFeedFragmentDoc, data?.activityFeed)?.entries;

  const onCreateActivityFeedEntryModalClose = () => {
    hideCreateModal();
    refetch();
  }

  if (!entries) {
    return <FullScreenLoader />
  }

  return (
    <>
      {isCreateModalVisible && <CreateActivityFeedEntryModal activityFeedId={activityFeedId} onClose={onCreateActivityFeedEntryModalClose} />}
      <View {...viewProps} style={[styles.container, viewProps.style]}>
        <FlatList
          style={styles.list}
          data={entries}
          keyExtractor={entry => getFragmentData(ActivityFeedEntryFragmentDoc, entry).id}
          renderItem={({ item }) => (
            <ActivityFeedEntry activityFeedEntry={item} />
          )}
          onRefresh={refetch}
          refreshing={loading}
          ItemSeparatorComponent={() => <View style={{ height: 30 }} />}
        />
        <AddTaskButton label='Add entry' height={60} onPress={showCreateModal} />
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
    minHeight: '100%',
  },
  list: {
    flex: 1,
  }
});

