import { SectionHeading } from '@/components/ui/SectionHeading';
import { VideoPlayer } from '@/components/ui/VideoPlayer';
import { labVideos } from '@/data/videos';

export function WorkInMotion() {
  return (
    <section id="bastidores" aria-labelledby="bastidores-title" className="bg-paper-dim py-16 lg:py-24">
      <div className="container">
        <SectionHeading
          id="bastidores-title"
          index="05"
          label="Em vídeo"
          title="Duas peças conferidas sobre o modelo"
          intro="Gravações feitas no laboratório, na etapa em que a adaptação da peça é verificada antes da entrega."
        />

        <ul className="mt-12 grid gap-8 sm:grid-cols-2 sm:items-end lg:gap-10">
          {labVideos.map((video) => (
            <li key={video.id}>
              <VideoPlayer
                src={video.src}
                poster={video.poster}
                description={video.description}
                aspect={video.aspect}
              />
              <p className="mx-auto mt-3 w-fit max-w-measure text-meta text-ink-soft">{video.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
