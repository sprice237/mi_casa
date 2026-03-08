import * as Sentry from '@sentry/react-native';
import { Dispatch, DispatchWithoutAction, useState } from 'react';
import { Alert, Button, StyleSheet, View } from 'react-native';
import { Modal } from '../Modal';
import { CreateAttachmentDocument, UpdateAttachmentDocument } from '$/gql';
import { useMutation } from '@apollo/client/react';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';

type AttachmentCreateModalProps = {
  onClose: DispatchWithoutAction;
  onCreate?: Dispatch<{ id: string }>;
}

export const AttachmentCreateModal = ({ onClose, onCreate }: AttachmentCreateModalProps) => {
  const [createAttachment] = useMutation(CreateAttachmentDocument);
  const [updateAttachment] = useMutation(UpdateAttachmentDocument);

  const [imagePickerAsset, setImagePickerAsset] = useState<ImagePicker.ImagePickerAsset | null>(null);

  const launchCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Permission to access the camera is required.');
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: 'images',
        allowsEditing: true,
      });

      if (result.canceled) {
        return;
      }

      const [asset] = result.assets;

      if (!asset) {
        return;
      }

      if (asset.mimeType !== 'image/jpeg') {
        Alert.alert('Error', `Cannot handle file of type ${asset.mimeType}`);
        Sentry.captureException(new Error(`Cannot handle file of type ${asset.mimeType}`));
        return;
      }

      setImagePickerAsset(asset);
    } catch (e) {
      Sentry.captureException(new Error(`Could not open camera`));
      Alert.alert('Error', 'Could not open camera');
    }
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Permission to access the media library is required.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
    });

    if (result.canceled) {
      return;
    }

    const [asset] = result.assets;

    if (!asset) {
      return;
    }

    if (asset.mimeType !== 'image/jpeg') {
      Alert.alert('Error', `Cannot handle file of type ${asset.mimeType}`);
      Sentry.captureException(new Error(`Cannot handle file of type ${asset.mimeType}`));
      return;
    }

    setImagePickerAsset(asset);
  };

  const uploadImage = async () => {
    if (!imagePickerAsset || !imagePickerAsset.mimeType) {
      return;
    }

    const { data: { createAttachment: payload } = {} } = await createAttachment({ variables: { input: { name: 'photo', contentType: imagePickerAsset.mimeType } } })
    if (!payload || !payload.presignedPostFields || typeof payload.presignedPostFields !== 'object') {
      return;
    }

    const formData = new FormData()

    Object.entries(payload.presignedPostFields).forEach(([key, value]) => {
      formData.append(key, value)
    })

    formData.append("file", {
      uri: imagePickerAsset.uri,
      name: 'photo',
      type: imagePickerAsset.mimeType
    } as any); // apparently react native supports this but the types aren't there

    const res = await fetch(payload.presignedPostUrl, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      Alert.alert('Error', 'The attachment was not added');
      Sentry.captureException(new Error(`Got ${res.status} when attempting to upload attachment`));
      return;
    }

    const { data: { updateAttachment: createdAttachment } = {} } = await updateAttachment({ variables: { input: { attachmentId: payload.id, isReady: true } } });

    if (!createdAttachment) {
      return;
    }

    onCreate?.(createdAttachment)
    onClose();
  }

  return (
    <Modal backdropClose title="Add attachment" onClose={onClose} content={(
      <View style={styles.container}>
        {!imagePickerAsset && (
          <>
            <Button onPress={launchCamera} title="Launch camera" />
            <Button onPress={pickImage} title="Pick image" />
          </>
        )}
        {imagePickerAsset && (
          <>
            <View style={{ width: '100%', height: 300 }}>
              <Image source={imagePickerAsset} style={{ width: '100%', flex: 1 }} contentFit="cover" />
            </View>
            <Button onPress={() => { setImagePickerAsset(null) }} title="Clear" />
            <Button onPress={uploadImage} title="Submit" />
          </>
        )}
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