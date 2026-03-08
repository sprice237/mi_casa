import { useEffect, useState } from 'react';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Alert, Platform } from 'react-native';
import { useMutation } from '@apollo/client/react';
import { ReportExpoNotificationTokenDocument } from '$/gql';
import { useDeviceStore } from '$/stores/deviceStore';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function getExpoPushToken() {
  if (!Device.isDevice) {
    throw new Error('Must use physical device for push notifications');
  }

  if (Constants.executionEnvironment === ExecutionEnvironment.StoreClient) {
    throw new Error('Cannot use notifications with ExpoGo');
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    throw new Error('Permission not granted to get push token for push notification!');
  }

  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;

  if (!projectId) {
    throw new Error('Project ID not found');
  }

  const expoPushToken = (
    await Notifications.getExpoPushTokenAsync({
      projectId,
    })
  ).data;

  return expoPushToken;
}

export const usePushNotifications = () => {
  const deviceStore = useDeviceStore();
  const [reportExpoNotificationToken] = useMutation(ReportExpoNotificationTokenDocument);

  const [loaded, setLoaded] = useState(false);;

  const [error, setError] = useState<Error | unknown>();
  const [expoPushToken, setExpoPushToken] = useState<string>();

  useEffect(() => {
    if (!deviceStore.isLoaded) {
      console.warn('deviceStore is not available')
    }
    const abortController = new AbortController();
    const abortSignal = abortController.signal;

    setLoaded(false);
    setError(undefined);
    setExpoPushToken(undefined);

    if (!Device.isDevice) {
      Alert.alert('Notifications unavailable', 'Push notifications unavailable without physical device');
      setLoaded(true);
      return;
    }

    if (Constants.executionEnvironment === ExecutionEnvironment.StoreClient) {
      Alert.alert('Notifications unavailable', 'Push notifications unavailable with Expo Go');
      setLoaded(true);
      return;
    }

    (async () => {
      try {
        const token = await getExpoPushToken();

        if (abortSignal.aborted) {
          return;
        }

        if (Platform.OS !== 'ios' && Platform.OS !== 'android') {
          throw new Error('Only android and ios supported');
        }

        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
          });

          if (abortSignal.aborted) {
            return;
          }
        }

        await reportExpoNotificationToken({
          variables: {
            input: {
              deviceId: deviceStore.deviceId,
              expoPushTokenToken: token,
              platform: { ios: 'IOS' as const, android: 'ANDROID' as const }[Platform.OS]
            }
          }
        })
        setExpoPushToken(token);
      } catch (error) {
        if (abortSignal.aborted) {
          return;
        }

        setError(error);
      } finally {
        if (abortSignal.aborted) {
          return;
        }

        setLoaded(true);
      }
    })();

    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      // called when a notification is received while the app is running in the foreground
      console.log('notification received', notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      // called when the user opens the app via a notification
      console.log('notification response received', response);
    });

    return () => {
      abortController.abort();
      notificationListener.remove();
      responseListener.remove();
    };
  }, [deviceStore.isLoaded, deviceStore.deviceId]);

  return { loaded, error, expoPushToken };
}
