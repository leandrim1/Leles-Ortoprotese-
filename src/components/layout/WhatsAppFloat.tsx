import { MessageCircle } from 'lucide-react';
import { buildWhatsAppUrl, quoteMessage } from '@/utils/whatsapp';
import { useScrolled } from '@/hooks/useScrolled';
import { cn } from '@/utils/cn';

/**
 * Botão flutuante do WhatsApp.
 * Aparece após a primeira rolagem e fica fora da área da navegação, no canto
 * inferior direito, respeitando a área segura em celulares.
 */
export function WhatsAppFloat() {
  const isVisible = useScrolled(320);

  return (
    <a
      href={buildWhatsAppUrl(quoteMessage)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com o Lab Leles pelo WhatsApp"
      tabIndex={isVisible ? 0 : -1}
      aria-hidden={!isVisible}
      className={cn(
        'group fixed bottom-5 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full',
        'bg-wine text-white shadow-wine transition-all duration-300 hover:bg-wine-soft',
        'sm:bottom-7 sm:right-7',
        isVisible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0',
      )}
      style={{ marginBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <span
        className="absolute inset-0 rounded-full bg-wine/40 animate-pulse-ring motion-reduce:hidden"
        aria-hidden="true"
      />
      <MessageCircle className="relative h-6 w-6" aria-hidden="true" />
      <span className="sr-only">WhatsApp</span>
    </a>
  );
}
