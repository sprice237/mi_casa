import Drawer from 'expo-router/drawer';
import { ReactNode } from 'react';
import { AppDrawerContent } from './AppDrawerContent';

type AppDrawerProps = {
  children?: ReactNode;
}

export const AppDrawer = ({ children }: AppDrawerProps) => {
  return (
    <Drawer drawerContent={AppDrawerContent}>
      {children}
    </Drawer>
  )
}