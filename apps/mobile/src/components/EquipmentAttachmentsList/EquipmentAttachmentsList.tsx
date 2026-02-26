import { EquipmentAttachmentFragmentDoc, EquipmentAttachmentsDocument, FragmentType, getFragmentData } from '$/gql';
import { ComponentProps, Dispatch, useState } from 'react';
import { Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@apollo/client/react';
import { SwipeListView } from 'react-native-swipe-list-view';
import { Border } from './Border';
import { AddTaskButton } from '../AddTaskButton';
import { useFlagState } from '$/util';
import { EquipmentAttachmentCreateModal } from '../EquipmentAttachmentCreateModal';
import { EquipmentAttachmentsListItem } from './EquipmentAttachmentsListItem';
import { EquipmentAttachmentsListItemActions } from './EquipmentAttachmentsListItemActions';
import { EquipmentAttachmentViewModal } from '../EquipmentAttachmentViewModal';

const ROW_HEIGHT = 60;

type EquipmentAttachmentsListProps = ComponentProps<typeof View> & {
  equipmentId: string;
  onEquipmentAttachmentPress?: Dispatch<FragmentType<typeof EquipmentAttachmentFragmentDoc>>
}

export const EquipmentAttachmentsList = ({ equipmentId, onEquipmentAttachmentPress, ...viewProps }: EquipmentAttachmentsListProps) => {
  const { data, refetch, loading } = useQuery(EquipmentAttachmentsDocument, { variables: { equipmentId } });
  const [equipmentAttachmentToView, setEquipmentAttachmentToView] = useState<FragmentType<typeof EquipmentAttachmentFragmentDoc>>();

  const { value: isCreateModalVisible, setTrue: showCreateModal, setFalse: hideCreateModal } = useFlagState();
  const equipmentAttachments = data?.equipmentAttachments;

  return (
    <>
      {isCreateModalVisible && <EquipmentAttachmentCreateModal equipmentId={equipmentId} onClose={hideCreateModal} />}
      {equipmentAttachmentToView && <EquipmentAttachmentViewModal equipmentAttachmentId={getFragmentData(EquipmentAttachmentFragmentDoc, equipmentAttachmentToView).id} onClose={() => setEquipmentAttachmentToView(undefined)} />}
      <View {...viewProps} style={[viewProps.style, styles.container]}>
        <SwipeListView
          style={styles.list}
          contentContainerStyle={styles.contentContainer}
          refreshing={loading}
          onRefresh={refetch}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}
          data={equipmentAttachments}
          keyExtractor={(equipmentAttachment) => getFragmentData(EquipmentAttachmentFragmentDoc, equipmentAttachment).id}
          ItemSeparatorComponent={Border}
          renderItem={({ item: equipmentAttachment }) => (
            <Pressable onPress={() => setEquipmentAttachmentToView(equipmentAttachment)}>
              <EquipmentAttachmentsListItem equipmentAttachment={equipmentAttachment} rowHeight={ROW_HEIGHT} />
            </Pressable>
          )}
          renderHiddenItem={({ item: equipmentAttachment }, rowMap) => (
            <EquipmentAttachmentsListItemActions itemWidth={ROW_HEIGHT} equipmentAttachment={equipmentAttachment}
              onPress={() => rowMap[getFragmentData(EquipmentAttachmentFragmentDoc, equipmentAttachment).id].closeRow()}
            />
          )}
          stopRightSwipe={-ROW_HEIGHT * EquipmentAttachmentsListItemActions.numRightButtons}
          rightOpenValue={-ROW_HEIGHT * EquipmentAttachmentsListItemActions.numRightButtons}
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

