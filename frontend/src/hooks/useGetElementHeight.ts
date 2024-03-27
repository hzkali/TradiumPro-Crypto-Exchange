import { useLayoutEffect, useRef, useState } from "react";

export const useGetElementHeight = (minHeight: number) => {
  const ref = useRef<any>(null);
  const [height, setHeight] = useState(minHeight);

  useLayoutEffect(() => {
    setHeight(ref.current?.clientHeight);
  }, []);

  return {
    ref,
    height,
  };
};
