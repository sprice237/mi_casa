import { Dispatch, useEffect } from 'react';
import { create } from 'zustand';
import { useIsFocused } from "@react-navigation/native";

type State = {
  title: string;
  updateTitle: Dispatch<State['title']>
}

export const useTitleStore = create<State>(
  (set) => ({
    title: '',
    updateTitle: (title) => set(() => ({ title })),
  }),
);

export const useTitle = () => {
  return useTitleStore((store) => store.title);
}

export const useRegisterTitle = (title: string) => {
  const isFocused = useIsFocused();
  const updateTitle = useTitleStore((store) => store.updateTitle);

  useEffect(() => {
    if (isFocused) {
      updateTitle(title);
    }

  }, [title, isFocused]);
}