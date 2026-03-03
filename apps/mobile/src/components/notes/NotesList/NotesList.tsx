import { getFragmentData, NoteFragmentDoc, FragmentType } from '$/gql';
import { ComponentProps, Dispatch, DispatchWithoutAction } from 'react';
import { RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { NotesListItem } from './NotesListItem';
import { Border } from './Border';
import { NotesListItemActions } from './NotesListItemActions';
import { AddTaskButton } from '../../AddTaskButton';
import { useFlagState } from '$/util';
import { NoteEditModal } from '../NoteEditModal';

const ROW_HEIGHT = 60;

type NotesListProps = ComponentProps<typeof View> & {
  notes: FragmentType<typeof NoteFragmentDoc>[];
  loading: boolean;
  refetch: DispatchWithoutAction;
  onNoteCreate?: Dispatch<FragmentType<typeof NoteFragmentDoc>>;
}

export const NotesList = ({ notes, loading, refetch, onNoteCreate, ...viewProps }: NotesListProps) => {
  const { value: isCreateModalVisible, setTrue: showCreateModal, setFalse: hideCreateModal } = useFlagState();

  const onCreateModalClose = () => {
    hideCreateModal();
    refetch();
  }

  return (
    <>
      {isCreateModalVisible && <NoteEditModal onClose={onCreateModalClose} onCreate={onNoteCreate} />}
      <View {...viewProps} style={[viewProps.style, styles.container]}>
        <SwipeListView
          style={styles.list}
          contentContainerStyle={styles.contentContainer}
          refreshing={loading}
          onRefresh={refetch}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}
          data={notes}
          keyExtractor={(noteFragment) => getFragmentData(NoteFragmentDoc, noteFragment).id}
          ItemSeparatorComponent={Border}
          renderItem={({ item: note }) => <NotesListItem note={note} rowHeight={ROW_HEIGHT} />}
          renderHiddenItem={({ item: note }, rowMap) => (
            <NotesListItemActions itemWidth={ROW_HEIGHT} note={note}
              onPress={() => rowMap[getFragmentData(NoteFragmentDoc, note).id].closeRow()}
              onDeleted={refetch}
            />
          )}
          stopRightSwipe={-ROW_HEIGHT * NotesListItemActions.numRightButtons}
          rightOpenValue={-ROW_HEIGHT * NotesListItemActions.numRightButtons}
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

