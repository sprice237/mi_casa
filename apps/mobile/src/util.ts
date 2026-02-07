import { useCallback, useMemo, useState } from "react";

export const useFlagState = (initialState: boolean | (() => boolean) = false) => {
  const [value, setValue] = useState(initialState);

  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  return useMemo(() => ({ value, setTrue, setFalse, setValue }), [value, setTrue, setFalse, setValue]);
}