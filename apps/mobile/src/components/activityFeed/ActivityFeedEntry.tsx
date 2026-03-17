import { getFragmentData, ActivityFeedEntryFragmentDoc, AttachmentFragmentDoc, FragmentType } from '$/gql';
import { ComponentProps } from 'react';
import { Text, View } from 'react-native';
import { AttachmentRenderer } from '../attachments/AttachmentRenderer';
import { format } from 'date-fns/format';

type ActivityFeedEntryProps = ComponentProps<typeof View> & {
  activityFeedEntry: FragmentType<typeof ActivityFeedEntryFragmentDoc>;
}

export const ActivityFeedEntry = ({ activityFeedEntry: activityFeedEntryFragment, ...viewProps }: ActivityFeedEntryProps) => {
  const activityFeedEntry = getFragmentData(ActivityFeedEntryFragmentDoc, activityFeedEntryFragment);

  return (
    <View {...viewProps}>
      <Text>{format(activityFeedEntry.createdAt, 'PPPPp')}</Text>
      {activityFeedEntry.note && (
        <Text>{activityFeedEntry.note}</Text>
      )}
      {activityFeedEntry.attachments && activityFeedEntry.attachments.length > 0 && (
        <View>
          {activityFeedEntry.attachments.map(attachmentFragment => {
            const attachment = getFragmentData(AttachmentFragmentDoc, attachmentFragment);
            return (
              <View key={attachment.id} style={{ width: '100%', height: 300 }}>
                <AttachmentRenderer attachmentId={attachment.id} />
              </View>
            )
          })}
        </View>
      )}
    </View>
  );
};