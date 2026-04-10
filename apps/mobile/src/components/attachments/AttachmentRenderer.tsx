import { AttachmentDocument, AttachmentWithUrlFragmentDoc, getFragmentData, } from '$/gql';
import { useQuery } from '@apollo/client/react';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import RNModal from 'react-native-modal'
import { Zoomable } from '@likashefqet/react-native-image-zoom';
import * as Sharing from 'expo-sharing';
import { Directory, File, Paths } from 'expo-file-system';

type AttachmentRendererProps = {
  attachmentId: string;
}

export const AttachmentRenderer = ({ attachmentId }: AttachmentRendererProps) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
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

  const shareImage = async () => {
    const destinationDir = new Directory(Paths.cache, 'images');
    destinationDir.create({ idempotent: true });

    const destinationFile = new File(destinationDir, `${attachment.id}.jpg`);
    try {
      destinationFile.delete();
    } catch (_) {
      // don't care
    }

    const output = await File.downloadFileAsync(attachment.url, destinationFile, { idempotent: true });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(output.uri, { dialogTitle: 'Share this image', mimeType: 'image/jpeg', UTI: 'public.jpeg' });
    }
  };

  return (
    <>
      <Pressable onPress={() => setIsFullScreen(true)} style={{ width: '100%', flex: 1 }}>
        <Image source={attachment.url} style={{ width: '100%', flex: 1 }} contentFit="cover" />
      </Pressable>
      {isFullScreen && (
        <RNModal isVisible backdropOpacity={1} backdropColor='black' onDismiss={() => setIsFullScreen(false)} onBackdropPress={() => setIsFullScreen(false)} style={{ padding: 0, margin: 0, display: 'flex', flexDirection: 'column' }}>
          <View style={{ width: '100%', flex: 1 }}>
            <Zoomable isDoubleTapEnabled>
              <Image source={attachment.url} style={{ width: '100%', flex: 1 }} contentFit="contain" />
            </Zoomable>
          </View>
          <Pressable onPress={shareImage} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: 60, backgroundColor: '#ccc' }}>
            <Text>Share</Text>
          </Pressable>
          <Pressable onPress={() => setIsFullScreen(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: 60, backgroundColor: '#ccc' }}>
            <Text>Close</Text>
          </Pressable>
        </RNModal >
      )}
    </>
  );
}