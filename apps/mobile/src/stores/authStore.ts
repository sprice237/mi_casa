import { Dispatch } from 'react';
import { create } from 'zustand';
import { persist, createJSONStorage } from "zustand/middleware"
import AsyncStorage from '@react-native-async-storage/async-storage';

type State = {
  username: string | null;
}

type Action = {
  updateUsername: Dispatch<State['username']>
}

export const useAuthStore = create(persist<State & Action>(
  (set) => ({
    username: null,
    updateUsername: (username) => set(() => ({ username })),
  }),
  {
    name: 'auth',
    storage: createJSONStorage(() => AsyncStorage),
  }
))