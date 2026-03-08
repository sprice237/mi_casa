import { ReactNode, useEffect } from 'react';
import { usePushNotifications } from "$/util/notifications";

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
    return null;
  }

  return children;
}