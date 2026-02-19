import { Dispatch } from 'react';
import { create } from 'zustand';
import { persist } from "zustand/middleware"
import * as SecureStore from 'expo-secure-store';

type State = {
  username: string | null;
  apiUri: string | null;
}

type Action = {
  updateUsername: Dispatch<State['username']>
  updateApiUri: Dispatch<State['apiUri']>
}

export const useAuthStore = create<State & Action>()(persist(
  (set) => ({
    username: null,
    apiUri: null,
    updateUsername: (username) => set(() => ({ username })),
    updateApiUri: (apiUri) => set(() => ({ apiUri })),
  }),
  {
    name: 'auth',
    partialize: (state) => ({
      username: state.username,
      apiUri: state.apiUri,
    }),
    storage: {
      getItem: async (name) => {
        const username = (await SecureStore.getItemAsync(`${name}.username`)) || null;
        const apiUri = (await SecureStore.getItemAsync(`${name}.apiUri`)) || null;
        return { state: { username, apiUri } };
      },
      setItem: async (name, value) => {
        await SecureStore.setItemAsync(`${name}.username`, value.state.username ?? '');
        await SecureStore.setItemAsync(`${name}.apiUri`, value.state.apiUri ?? '');
      },
      removeItem: async (name) => {
        await SecureStore.deleteItemAsync(`${name}.username`);
        await SecureStore.deleteItemAsync(`${name}.apiUri`);
      }
    },
  }
))