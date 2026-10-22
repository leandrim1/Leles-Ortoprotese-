import { buildWhatsAppUrl, quoteMessage } from '@/utils/whatsapp';
import { useScrolled } from '@/hooks/useScrolled';
import { cn } from '@/utils/cn';

/**
 * Atalho fixo para o WhatsApp.
 * Aparece depois do hero e usa a mesma linguagem dos botões do site, em vez de
 * uma bolha flutuante com animação.
 */
export function WhatsAppFloat() {
  const isVisible = useScrolled(520);

  return (
    <a
      href={buildWhatsAppUrl(quoteMessage)}
      target="_blank"
      rel="noopener noreferrer"
      tabIndex={isVisible ? 0 : -1}
      aria-hidden={!isVisible}
      className={cn(
        'fixed bottom-0 right-4 z-40 inline-flex min-h-[40px] items-center rounded-t bg-wine px-4',
        'text-meta font-medium text-white transition-all hover:bg-wine-deep sm:right-8',
        isVisible ? 'translate-y-0' : 'pointer-events-none translate-y-full',
      )}
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      Falar no WhatsApp
    </a>
  );
}
