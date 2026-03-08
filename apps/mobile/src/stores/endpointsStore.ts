import { Dispatch } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist } from "zustand/middleware"
import AsyncStorage from '@react-native-async-storage/async-storage';

type State = {
  apiUri: string;
  authApiUri: string;
}

type Action = {
  updateApiUri: Dispatch<State['apiUri']>
  updateAuthApiUri: Dispatch<State['authApiUri']>
}

export const useEndpointsStore = create<State & Action>()(
  persist(
    (set) => ({
      apiUri: process.env.EXPO_PUBLIC_DEFAULT_API_URI ?? '',
      authApiUri: process.env.EXPO_PUBLIC_DEFAULT_AUTH_API_URI ?? '',
      updateApiUri: (apiUri) => set(() => ({ apiUri })),
      updateAuthApiUri: (authApiUri) => set(() => ({ authApiUri })),
    }),
    {
      name: 'endpoints',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
