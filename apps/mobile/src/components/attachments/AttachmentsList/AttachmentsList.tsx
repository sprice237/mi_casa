import { AttachmentFragmentDoc, FragmentType, getFragmentData } from '$/gql';
import { ComponentProps, Dispatch, DispatchWithoutAction, useState } from 'react';
import { Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { Border } from './Border';
import { AddTaskButton } from '../../AddTaskButton';
import { useFlagState } from '$/util/util';
import { AttachmentCreateModal } from '../AttachmentCreateModal';
import { AttachmentsListItem } from './AttachmentsListItem';
import { AttachmentsListItemActions } from './AttachmentsListItemActions';
import { AttachmentViewModal } from '../AttachmentViewModal';

const ROW_HEIGHT = 60;

type AttachmentsListProps = ComponentProps<typeof View> & {
  attachments: FragmentType<typeof AttachmentFragmentDoc>[];
  loading: boolean;
  refetch: DispatchWithoutAction;
  onAttachmentCreate?: Dispatch<{ id: string }>;
}

export const AttachmentsList = ({ attachments, loading, refetch, onAttachmentCreate, ...viewProps }: AttachmentsListProps) => {
  const [attachmentToView, setAttachmentToView] = useState<FragmentType<typeof AttachmentFragmentDoc>>();

  const { value: isCreateModalVisible, setTrue: showCreateModal, setFalse: hideCreateModal } = useFlagState();

  const onCreateModalClose = () => {
    hideCreateModal();
    refetch();
  }

  return (
    <>
      {isCreateModalVisible && <AttachmentCreateModal onClose={onCreateModalClose} onCreate={onAttachmentCreate} />}
      {attachmentToView && <AttachmentViewModal attachmentId={getFragmentData(AttachmentFragmentDoc, attachmentToView).id} onClose={() => setAttachmentToView(undefined)} />}
      <View {...viewProps} style={[viewProps.style, styles.container]}>
        <SwipeListView
          style={styles.list}
          contentContainerStyle={styles.contentContainer}
          refreshing={loading}
          onRefresh={refetch}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}
          data={attachments}
          keyExtractor={(attachment) => getFragmentData(AttachmentFragmentDoc, attachment).id}
          ItemSeparatorComponent={Border}
          renderItem={({ item: attachment }) => (
            <Pressable onPress={() => setAttachmentToView(attachment)}>
              <AttachmentsListItem attachment={attachment} rowHeight={ROW_HEIGHT} />
            </Pressable>
          )}
          renderHiddenItem={({ item: attachment }, rowMap) => (
            <AttachmentsListItemActions itemWidth={ROW_HEIGHT} attachment={attachment}
              onPress={() => rowMap[getFragmentData(AttachmentFragmentDoc, attachment).id].closeRow()}
              onDeleted={refetch}
            />
          )}
          stopRightSwipe={-ROW_HEIGHT * AttachmentsListItemActions.numRightButtons}
          rightOpenValue={-ROW_HEIGHT * AttachmentsListItemActions.numRightButtons}
          ListEmptyComponent={() => <View><Text>Empty</Text></View>}
        />
        <AddTaskButton height={ROW_HEIGHT} label="Add attachment" onPress={showCreateModal} />
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

