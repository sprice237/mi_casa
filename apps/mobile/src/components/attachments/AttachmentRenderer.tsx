import { AttachmentDocument, AttachmentWithUrlFragmentDoc, getFragmentData, } from '$/gql';
import { useQuery } from '@apollo/client/react';
import { Image } from 'expo-image';
import { Text, View } from 'react-native';

type AttachmentRendererProps = {
  attachmentId: string;
}

export const AttachmentRenderer = ({ attachmentId }: AttachmentRendererProps) => {
  const { data: { attachment: attachmentFragment } = {}, error } = useQuery(AttachmentDocument, { variables: { attachmentId } });

  const attachment = getFragmentData(AttachmentWithUrlFragmentDoc, attachmentFragment);

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
    <Image source={attachment.url} style={{ width: '100%', flex: 1 }} contentFit="cover" />
  );
}