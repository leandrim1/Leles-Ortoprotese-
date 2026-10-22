import { useRef, useState } from 'react';
import { Play } from 'lucide-react';
import { cn } from '@/utils/cn';

interface VideoPlayerProps {
  src: string;
  poster: string;
  /** Título curto exibido sobre o pôster. */
  title: string;
  /** Descrição do que aparece no vídeo, usada também como rótulo acessível. */
  description: string;
  /** Proporção natural do vídeo, por exemplo "3 / 4". */
  aspect: string;
  className?: string;
}

/**
 * Player leve para os vídeos do laboratório.
 * O vídeo só é baixado quando o visitante aperta play: até lá, exibe apenas o
 * frame de capa. Os controles nativos assumem depois do primeiro play.
 */
export function VideoPlayer({ src, poster, title, description, aspect, className }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  const handlePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    setHasStarted(true);
    void video.play().catch(() => {
      // Se o navegador bloquear a reprodução, os controles nativos continuam disponíveis.
    });
  };

  return (
    <figure
      className={cn(
        'group relative mx-auto w-fit overflow-hidden rounded-2xl bg-graphite ring-1 ring-white/10',
        className,
      )}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        preload="none"
        playsInline
        controls={hasStarted}
        aria-label={description}
        onEnded={() => setHasStarted(false)}
        className="block h-[380px] w-auto max-w-full object-cover sm:h-[420px] lg:h-[480px]"
        style={{ aspectRatio: aspect }}
      >
        Seu navegador não suporta a reprodução de vídeo.
      </video>

      {/* Camada de capa: some assim que o vídeo começa */}
      {!hasStarted && (
        <button
          type="button"
          onClick={handlePlay}
          aria-label={`Reproduzir vídeo: ${title}`}
          className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-graphite/35 transition-colors duration-300 hover:bg-graphite/20"
        >
          <span
            className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-wine text-white shadow-wine transition-transform duration-300 group-hover:scale-110"
            aria-hidden="true"
          >
            <Play className="ml-0.5 h-6 w-6 fill-current" />
          </span>

          <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-graphite to-transparent p-5 pt-10 text-left">
            <span className="block font-display text-sm font-semibold text-white">{title}</span>
          </span>
        </button>
      )}

      <figcaption className="sr-only">{description}</figcaption>
    </figure>
  );
}
