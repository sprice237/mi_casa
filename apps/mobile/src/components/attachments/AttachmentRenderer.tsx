import { AttachmentWithThumbnailUrlDocument, AttachmentWithThumbnailUrlFragmentDoc, getFragmentData, } from '$/gql';
import { useQuery } from '@apollo/client/react';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { AttachmentRendererFullScreen } from './AttachmentRendererFullScreen';

type AttachmentRendererProps = {
  attachmentId: string;
}

export const AttachmentRenderer = ({ attachmentId }: AttachmentRendererProps) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { data: { attachment: attachmentFragment } = {}, error } = useQuery(AttachmentWithThumbnailUrlDocument, { variables: { attachmentId } });

  const attachment = getFragmentData(AttachmentWithThumbnailUrlFragmentDoc, attachmentFragment);

  if (error) {
    return (
      <View style={{ width: '100%', flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Text>Could not load image</Text>
      </View>
    )
  }

  if (!attachment) {
    return null;
  }

  return (
    <>
      <Pressable onPress={() => setIsFullScreen(true)} style={{ width: '100%', flex: 1 }}>
        <Image source={attachment.thumbnailUrl} style={{ width: '100%', flex: 1 }} contentFit="cover" />
      </Pressable>
      {isFullScreen && (
        <AttachmentRendererFullScreen attachmentId={attachmentId} onClose={() => setIsFullScreen(false)} />
      )}
    </>
  );
}