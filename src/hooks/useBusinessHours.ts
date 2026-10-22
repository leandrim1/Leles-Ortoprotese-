import { useEffect, useState } from 'react';
import { getOpenStatus } from '@/utils/businessHours';
import type { OpenStatus } from '@/types';

/** Situação de atendimento recalculada a cada minuto no navegador. */
export function useBusinessHours(): OpenStatus {
  const [status, setStatus] = useState<OpenStatus>(() => getOpenStatus());

  useEffect(() => {
    const update = () => setStatus(getOpenStatus());
    update();

    const interval = window.setInterval(update, 60_000);
    document.addEventListener('visibilitychange', update);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', update);
    };
  }, []);

  return status;
}
