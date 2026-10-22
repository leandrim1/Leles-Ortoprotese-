import { useRef, useState } from 'react';
import { Play } from 'lucide-react';
import { cn } from '@/utils/cn';

interface VideoPlayerProps {
  src: string;
  poster: string;
  /** Rótulo acessível e legenda do vídeo. */
  description: string;
  /** Proporção natural do vídeo, por exemplo "3 / 4". */
  aspect: string;
  className?: string;
}

/**
 * Player mínimo: o vídeo só é baixado quando o visitante aperta play.
 * Até lá exibe apenas o frame de capa.
 */
export function VideoPlayer({ src, poster, description, aspect, className }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  const handlePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    setHasStarted(true);
    void video.play().catch(() => {
      // Se o navegador bloquear, os controles nativos seguem disponíveis.
    });
  };

  return (
    <div className={cn('relative mx-auto w-fit bg-ink', className)}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        preload="none"
        playsInline
        controls={hasStarted}
        aria-label={description}
        onEnded={() => setHasStarted(false)}
        className="block h-[400px] w-auto max-w-full object-cover sm:h-[440px] lg:h-[520px]"
        style={{ aspectRatio: aspect }}
      >
        Seu navegador não suporta a reprodução de vídeo.
      </video>

      {!hasStarted && (
        <button
          type="button"
          onClick={handlePlay}
          aria-label={`Reproduzir vídeo: ${description}`}
          className="group absolute inset-0 flex items-end p-4"
        >
          <span className="inline-flex items-center gap-2.5 bg-paper px-3.5 py-2.5 text-meta font-medium text-ink transition-colors group-hover:bg-wine group-hover:text-white">
            <Play className="h-3 w-3 fill-current" aria-hidden="true" />
            Reproduzir
          </span>
        </button>
      )}
    </div>
  );
}
