import { getFragmentData, EquipmentNotesDocument, EquipmentNoteFragmentDoc } from '$/gql';
import { ComponentProps } from 'react';
import { RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@apollo/client/react';
import { SwipeListView } from 'react-native-swipe-list-view';
import { EquipmentNotesListItem } from './EquipmentNotesListItem';
import { Border } from './Border';
import { EquipmentNotesListItemActions } from './EquipmentNotesListItemActions';
import { AddTaskButton } from '../AddTaskButton';
import { useFlagState } from '$/util';
import { EquipmentNoteEditModal } from '../EquipmentNoteEditModal';

const ROW_HEIGHT = 60;

type EquipmentNotesListProps = ComponentProps<typeof View> & {
  equipmentId: string;
}

export const EquipmentNotesList = ({ equipmentId, ...viewProps }: EquipmentNotesListProps) => {
  const { value: isCreateModalVisible, setTrue: showCreateModal, setFalse: hideCreateModal } = useFlagState();
  const { data, refetch, loading } = useQuery(EquipmentNotesDocument, { variables: { equipmentId } });
  const equipmentNotes = data?.equipment.equipmentNotes;


  return (
    <>
      {isCreateModalVisible && <EquipmentNoteEditModal equipmentId={equipmentId} onClose={hideCreateModal} />}
      <View {...viewProps} style={[viewProps.style, styles.container]}>
        <SwipeListView
          style={styles.list}
          contentContainerStyle={styles.contentContainer}
          refreshing={loading}
          onRefresh={refetch}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}
          data={equipmentNotes}
          keyExtractor={(equipmentNoteFragment) => getFragmentData(EquipmentNoteFragmentDoc, equipmentNoteFragment).id}
          ItemSeparatorComponent={Border}
          renderItem={({ item: equipmentNote }) => <EquipmentNotesListItem equipmentNote={equipmentNote} rowHeight={ROW_HEIGHT} />}
          renderHiddenItem={({ item: equipmentNote }, rowMap) => (
            <EquipmentNotesListItemActions itemWidth={ROW_HEIGHT} equipmentId={equipmentId} equipmentNote={equipmentNote}
              onPress={() => rowMap[getFragmentData(EquipmentNoteFragmentDoc, equipmentNote).id].closeRow()}
            />
          )}
          stopRightSwipe={-ROW_HEIGHT * EquipmentNotesListItemActions.numRightButtons}
          rightOpenValue={-ROW_HEIGHT * EquipmentNotesListItemActions.numRightButtons}
          ListEmptyComponent={() => <View><Text>Empty</Text></View>}
        />
        <AddTaskButton height={ROW_HEIGHT} label="Add new note" onPress={showCreateModal} />
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

