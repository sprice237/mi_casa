import { Dispatch } from 'react';
import { create } from 'zustand';
import { persist } from "zustand/middleware"
import * as SecureStore from 'expo-secure-store';

type State = {
  auth: {
    token: string;
    username: string;
  } | null;
}

type Action = {
  updateAuth: Dispatch<State['auth']>
}

export const useAuthStore = create<State & Action>()(persist(
  (set) => ({
    auth: null,
    updateAuth: (auth) => set(() => ({ auth })),
  }),
  {
    name: 'auth',
    partialize: (state) => ({
      auth: state.auth,
    }),
    storage: {
      getItem: async (name) => {
        const authRaw = await SecureStore.getItemAsync(`${name}.auth`);
        const auth = authRaw && authRaw.length ? JSON.parse(authRaw) : null
        return { state: { auth } };
      },
      setItem: async (name, value) => {
        const authRaw = value.state.auth ? JSON.stringify(value.state.auth) : ''
        await SecureStore.setItemAsync(`${name}.auth`, authRaw);
      },
      removeItem: async (name) => {
        await SecureStore.deleteItemAsync(`${name}.auth`);
      }
    },
  }
))