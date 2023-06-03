import { useEffect, useState } from "react";

function getWindowSize() {
  const { innerWidth, innerHeight } = window;
  return { innerWidth, innerHeight };
}

export const useWindow = () => {
  const [width, setWidth] = useState(getWindowSize().innerWidth);
  const [height, setHeight] = useState(getWindowSize().innerHeight);

  useEffect(() => {
    const windowResizeHandler = () => {
      setWidth(getWindowSize().innerWidth);
      setHeight(getWindowSize().innerHeight);
    };

    window.addEventListener("resize", windowResizeHandler);

    return () => {
      window.removeEventListener("resize", windowResizeHandler);
    };
  }, []);

  return { width, height };
};
