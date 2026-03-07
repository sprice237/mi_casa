import * as SplashScreen from 'expo-splash-screen';
import { ReactNode, useEffect } from 'react';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

type SplashGuardProps = {
  loaded: boolean;
  children: ReactNode;
}

export const SplashGuard = ({ loaded, children }: SplashGuardProps) => {
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return children;
}