import { useCallback, useMemo, useState } from "react";

export const useFlagState = (initialState: boolean | (() => boolean) = false) => {
  const [value, setValue] = useState(initialState);

  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  const toggleValue = useCallback(() => setValue(pv => !pv), []);

  return useMemo(() => ({ value, setTrue, setFalse, setValue, toggleValue }), [value, setTrue, setFalse, setValue, toggleValue]);
}