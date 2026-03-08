import { create } from 'zustand';
import { persist } from "zustand/middleware"
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';

type State = {
  isLoaded: boolean;
  deviceId: string;
}

export const useDeviceStore = create<State>()(persist(
  () => ({
    isLoaded: false as boolean,
    deviceId: '',
  }),
  {
    name: 'auth',
    partialize: (state) => ({
      deviceId: state.deviceId,
    }),
    storage: {
      getItem: async (name) => {
        let deviceId = await SecureStore.getItemAsync(`${name}.deviceId`);

        if (!deviceId) {
          deviceId = Crypto.randomUUID();
          await SecureStore.setItemAsync(`${name}.deviceId`, deviceId);
        }

        return { state: { isLoaded: true, deviceId } };
      },
      setItem: async (name, value) => {
        await SecureStore.setItemAsync(`${name}.deviceId`, value.state.deviceId);
      },
      removeItem: async (name) => {
        await SecureStore.deleteItemAsync(`${name}.deviceId`);
      }
    },
  }
))