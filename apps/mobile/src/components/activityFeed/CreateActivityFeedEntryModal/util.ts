import * as Sentry from '@sentry/react-native';
import { Alert } from 'react-native';
import { launchCameraAsync, requestCameraPermissionsAsync, requestMediaLibraryPermissionsAsync, launchImageLibraryAsync, ImagePickerResult } from 'expo-image-picker';
import { useMutation } from '@apollo/client/react';
import { CreateAttachmentDocument, UpdateAttachmentDocument } from '$/gql';
import { useCallback } from 'react';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

export const launchCamera = async (): Promise<{ mimeType: string, uri: string } | undefined> => {
  const permissionResult = await requestCameraPermissionsAsync();

  if (!permissionResult.granted) {
    Alert.alert('Permission required', 'Permission to access the camera is required.');
    return;
  }

  try {
    const result = await launchCameraAsync({
      mediaTypes: 'images',
    });

    return await handleImagePickerResult(result);
  } catch (e) {
    Sentry.captureException(new Error(`Could not open camera`));
    Alert.alert('Error', 'Could not open camera');
  }
}


export const pickImage = async () => {
  const permissionResult = await requestMediaLibraryPermissionsAsync();

  if (!permissionResult.granted) {
    Alert.alert('Permission required', 'Permission to access the media library is required.');
    return;
  }

  try {
    const result = await launchImageLibraryAsync({
      mediaTypes: 'images',
    });

    return await handleImagePickerResult(result);
  } catch (e) {
    Sentry.captureException(new Error(`Could not open camera`));
    Alert.alert('Error', 'Could not open camera');
  }
};

const handleImagePickerResult = async (result: ImagePickerResult): Promise<{ mimeType: string, uri: string } | undefined> => {
  if (result.canceled) {
    return;
  }

  if (result.canceled) {
    return;
  }

  const [asset] = result.assets;

  if (!asset) {
    return;
  }

  switch (asset.mimeType) {
    case 'image/heic':
    case 'image/heif':
      try {
        const manipResult = await manipulateAsync(
          asset.uri,
          [],
          { compress: 0.8, format: SaveFormat.JPEG }
        );

        return {
          uri: manipResult.uri,
          mimeType: 'image/jpeg',
        };
      } catch (e) {
        Sentry.captureException(new Error(`Failed to convert HEIC image to JPEG`));
        Alert.alert('Error', 'Failed to process selected image');
        return;
      }
    case 'image/jpeg':
      return {
        uri: asset.uri,
        mimeType: 'image/jpeg',
      };
    case 'image/png':
      return {
        uri: asset.uri,
        mimeType: 'image/png',
      };
    default:
      Alert.alert('Error', `Cannot handle file of type ${asset.mimeType}`);
      Sentry.captureException(new Error(`Cannot handle file of type ${asset.mimeType}`));
      return;
  }
};



export const useUploadImage = () => {
  const [createAttachment] = useMutation(CreateAttachmentDocument);
  const [updateAttachment] = useMutation(UpdateAttachmentDocument);

  const uploadImage = useCallback(async (imagePickerAsset: { mimeType: string, uri: string }) => {
    if (!imagePickerAsset.mimeType) {
      throw new Error('Image is missing mime type');
    }

    const { data: { createAttachment: payload } = {} } = await createAttachment({ variables: { input: { name: 'photo', contentType: imagePickerAsset.mimeType } } })
    if (!payload || !payload.presignedPostFields || typeof payload.presignedPostFields !== 'object') {
      throw new Error('Attachment is missing presigned post fields');
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
      throw new Error(`Got ${res.status} when attempting to upload attachment`);
    }

    const { data: { updateAttachment: createdAttachment } = {} } = await updateAttachment({ variables: { input: { attachmentId: payload.id, isReady: true } } });

    if (!createdAttachment) {
      throw new Error('Did not find created/updated attachment')
    }

    return createdAttachment;
  }, [createAttachment, updateAttachment]);

  return uploadImage
}