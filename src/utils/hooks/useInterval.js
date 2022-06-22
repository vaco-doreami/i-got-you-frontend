import { useEffect, useRef } from "react";

export const useInterval = (countDown, interval) => {
  const countDownRef = useRef();

  useEffect(() => {
    countDownRef.current = countDown;
  }, [countDown]);

  useEffect(() => {
    function callback() {
      countDownRef.current();
    }

    if (interval !== null) {
      const timer = setInterval(callback, interval);

      return () => clearInterval(timer);
    }
  }, [interval]);
};
