import { FragmentType, getFragmentData, NoteFragmentDoc } from '$/gql';
import { StyleSheet, Text, View } from 'react-native';

type NotesListItemProps = {
  note: FragmentType<typeof NoteFragmentDoc>;
  rowHeight: number;
};

export const NotesListItem = ({ note: noteFragment, rowHeight }: NotesListItemProps) => {
  const note = getFragmentData(NoteFragmentDoc, noteFragment)

  return (
    <View style={[styles.container, { height: rowHeight }]}>
      <View style={{ flex: 1 }}>
        <Text>{note.content}</Text>
      </View>
      <View style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        <Text>{note.createdAt.toISOString()}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#eee',
  },
  text: { margin: 6 }
});
