import { useEffect, useState } from 'react';

export function useDeviceCapability() {
  const [lowPower, setLowPower] = useState(false);

  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    setLowPower(Boolean(connection?.saveData || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4)));
  }, []);

  return { lowPower };
}
