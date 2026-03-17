import * as Sentry from '@sentry/react-native';
import { Dispatch, DispatchWithoutAction, useState } from 'react';
import { Alert, Button, Pressable, StyleSheet, Text, View } from 'react-native';
import { Modal } from '../../Modal';
import { StyledTextInput } from '../../StyledTextInput';
import { FragmentType, ActivityFeedEntryFragmentDoc, CreateActivityFeedEntryDocument } from '$/gql';
import { useMutation } from '@apollo/client/react';
import { useForm } from '@tanstack/react-form';
import { NoteFormValues } from './form';
import { ImagePickerAsset } from 'expo-image-picker';
import { Image } from 'expo-image';
import AntDesign from '@expo/vector-icons/AntDesign';
import { launchCamera, useUploadImage } from './util';
import { useFlagState } from '$/util/util';
import { FullScreenLoader } from '$/components/FullScreenLoader';

type CreateActivityFeedEntryModalProps = {
  activityFeedId: string;
  onClose: DispatchWithoutAction;
  onCreate?: Dispatch<FragmentType<typeof ActivityFeedEntryFragmentDoc>>;
}

export const CreateActivityFeedEntryModal = ({ activityFeedId, onClose, onCreate }: CreateActivityFeedEntryModalProps) => {
  const { value: isLoading, setTrue: setLoading, setFalse: clearLoading } = useFlagState();

  const [createActivityFeedEntry] = useMutation(CreateActivityFeedEntryDocument);
  const uploadImage = useUploadImage();
  const [imagePickerAssets, setImagePickerAssets] = useState<ImagePickerAsset[]>([]);

  const defaultValues: NoteFormValues = { note: '' };
  const form = useForm({
    defaultValues,
    onSubmit: async ({ value: { note } }) => {
      const attachmentIds: string[] = [];

      setLoading();

      try {
        for (const imagePickerAsset of imagePickerAssets) {
          const attachment = await uploadImage(imagePickerAsset);
          attachmentIds.push(attachment.id);
        }
      } catch (e) {
        clearLoading();
        Sentry.captureException(e);
        Alert.alert('Image error', e instanceof Error ? e.message : 'Unknown error');
        return;
      }

      let createdActivityFeedEntry;
      try {
        createdActivityFeedEntry = (await createActivityFeedEntry({
          variables: {
            input: {
              activityFeedId,
              note,
              attachmentIds
            }
          },
        })).data?.createActivityFeedEntry;

        if (!createdActivityFeedEntry) {
          throw new Error('Missing created activity feed entry');
        }
      } catch (e) {
        clearLoading();
        Sentry.captureException(e);
        Alert.alert('Save error', e instanceof Error ? e.message : 'Unknown error');
        return;
      }

      if (createdActivityFeedEntry) {
        clearLoading();
        onCreate?.(createdActivityFeedEntry);
        onClose();
      }
    }
  });

  const doLaunchCamera = async () => {
    const imagePickerAsset = await launchCamera();

    if (!imagePickerAsset) {
      return;
    }

    setImagePickerAssets([...imagePickerAssets, imagePickerAsset])
  }

  const removeAsset = (imagePickerAssetToRemove: ImagePickerAsset) => {
    setImagePickerAssets(prev => prev.filter(x => x !== imagePickerAssetToRemove));
  }

  return (
    <Modal backdropClose title="Add entry" onClose={onClose} content={(
      <View style={styles.container}>
        {isLoading && <FullScreenLoader />}
        <Text>Notes</Text>
        <form.Field name="note">
          {field => <StyledTextInput value={field.state.value} onChangeText={e => field.setValue(e)} multiline numberOfLines={4} style={{ height: 80 }} />}
        </form.Field>
        <Text>Attachments</Text>
        {imagePickerAssets.map((imagePickerAsset) => (
          <View key={imagePickerAsset.uri} style={{ display: 'flex', flexDirection: 'row', width: '100%', gap: 4 }}>
            <Image source={imagePickerAsset} style={{ height: 50, width: 50 }} />
            <Text style={{ flex: 1 }}>{imagePickerAsset.uri.split('/').at(-1)}</Text>
            <Pressable onPress={() => removeAsset(imagePickerAsset)}><AntDesign name="delete" size={24} color="black" /></Pressable>
          </View>
        ))}
        <Button onPress={doLaunchCamera} title="Launch Camera" />
        <Button onPress={form.handleSubmit} title="Submit" />
      </View>
    )} />
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    padding: 10,
    gap: 10
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  }
})
