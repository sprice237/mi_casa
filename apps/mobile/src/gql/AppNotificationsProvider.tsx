import { ReactNode, useEffect } from 'react';
import { usePushNotifications } from "$/util/notifications";
import { FullScreenLoader } from '$/components/FullScreenLoader';
import { Alert } from 'react-native';

type AppNotificationsProviderProps = {
  children?: ReactNode
};

export const AppNotificationsProvider = ({ children }: AppNotificationsProviderProps) => {
  const { loaded: pushNotificationsLoaded, error: pushNotificationsError } = usePushNotifications();

  useEffect(() => {
    if (pushNotificationsError) {
      Alert.alert('Notifications error', pushNotificationsError instanceof Error ? `${pushNotificationsError.name}: ${pushNotificationsError.message}` : 'An unknown error occurred')
    }
  }, [pushNotificationsError])

  if (!pushNotificationsLoaded) {
    return <FullScreenLoader message="Loading AppNotificationsProvider..." />;
  }

  return children;
}