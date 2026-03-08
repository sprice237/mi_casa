import { ReactNode, useEffect } from 'react';
import { usePushNotifications } from "$/util/notifications";
import { FullScreenLoader } from '$/components/FullScreenLoader';

type AppNotificationsProviderProps = {
  children?: ReactNode
};

export const AppNotificationsProvider = ({ children }: AppNotificationsProviderProps) => {
  const { loaded: pushNotificationsLoaded, error: pushNotificationsError } = usePushNotifications();

  useEffect(() => {
    if (pushNotificationsError) {
      console.warn(pushNotificationsError);
    }
  }, [pushNotificationsError])

  if (!pushNotificationsLoaded) {
    return <FullScreenLoader message="Loading AppNotificationsProvider..." />;
  }

  return children;
}