import { useState, useEffect } from 'react';

const useDebounce = (value, delay, options = {}) => {
  const { leading = false, trailing = true } = options;
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    let timeoutId;

    if (leading) {
      setDebouncedValue(value);
    }

    if (trailing) {
      timeoutId = setTimeout(() => {
        if (!leading) {
          setDebouncedValue(value);
        }
      }, delay);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [value, delay, leading, trailing]);

  return debouncedValue;
};

export default useDebounce;
