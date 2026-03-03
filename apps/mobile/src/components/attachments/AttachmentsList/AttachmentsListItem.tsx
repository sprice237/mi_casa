import { FragmentType, getFragmentData, AttachmentFragmentDoc } from '$/gql';
import { StyleSheet, Text, View } from 'react-native';

type AttachmentsListItemProps = {
  attachment: FragmentType<typeof AttachmentFragmentDoc>;
  rowHeight: number;
};

export const AttachmentsListItem = ({ attachment: attachmentFragment, rowHeight }: AttachmentsListItemProps) => {
  const attachment = getFragmentData(AttachmentFragmentDoc, attachmentFragment);

  return (
    <View style={[styles.container, { height: rowHeight }]}>
      <View style={{ flex: 1 }}>
        <Text>{attachment.createdAt.toISOString()}</Text>
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
