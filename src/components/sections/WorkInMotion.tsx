import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { VideoPlayer } from '@/components/ui/VideoPlayer';
import { labVideos } from '@/data/videos';

export function WorkInMotion() {
  return (
    <section
      id="bastidores"
      aria-labelledby="bastidores-title"
      className="on-wine section-padding relative overflow-hidden bg-wine-gradient text-white"
    >
      <div className="absolute inset-0 grid-texture opacity-50" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -right-32 top-1/4 h-96 w-96 rounded-full bg-white/[0.06] blur-3xl"
        aria-hidden="true"
      />

      <div className="container relative">
        <Reveal>
          <SectionHeading
            id="bastidores-title"
            eyebrow="Bastidores"
            title="O acabamento visto de perto."
            tone="light"
            description="Registros feitos no laboratório durante a conferência da adaptação das peças sobre os modelos de trabalho."
          />
        </Reveal>

        <ul className="mx-auto mt-14 grid max-w-3xl gap-6 sm:grid-cols-2 sm:items-start sm:gap-8">
          {labVideos.map((video, index) => (
            <Reveal as="li" key={video.id} delay={index * 110}>
              <VideoPlayer
                src={video.src}
                poster={video.poster}
                title={video.title}
                description={video.description}
                aspect={video.aspect}
              />

              <p className="mt-4 text-center text-sm leading-relaxed text-steel">{video.description}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
