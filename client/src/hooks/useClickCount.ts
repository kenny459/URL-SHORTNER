import { useEffect, useState } from 'react';

const useClickCount = (shortCode: string | null, initialCount: number) => {
  const [clickCount, setClickCount] = useState(initialCount);

  useEffect(() => {
    if (!shortCode) return;

    const apiBase = import.meta.env.VITE_API_BASE_URL;
    const url = `${apiBase}/${shortCode}/live`;

    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.clickCount !== undefined) {
        setClickCount(data.clickCount);
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    // Cleanup on unmount
    return () => {
      eventSource.close();
    };
  }, [shortCode]);

  return clickCount;
};

export default useClickCount;