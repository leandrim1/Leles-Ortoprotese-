import ortopediaVideo from '@/assets/video/ortopedia-adaptacao.mp4';
import ortopediaPoster from '@/assets/video/poster-ortopedia.webp';
import contencaoVideo from '@/assets/video/contencao-adaptacao.mp4';
import contencaoPoster from '@/assets/video/poster-contencao.webp';
import type { LabVideo } from '@/types';

/**
 * Vídeos gravados no próprio laboratório.
 * As descrições relatam apenas o que aparece em cena, sem classificação clínica.
 */
export const labVideos: LabVideo[] = [
  {
    id: 'ortopedia-adaptacao',
    src: ortopediaVideo,
    poster: ortopediaPoster,
    title: 'Aparelho ortopédico sobre modelo impresso',
    description: 'Aparelho em acrílico com parafuso expansor adaptado sobre modelo impresso em 3D.',
    aspect: '3 / 4',
  },
  {
    id: 'contencao-adaptacao',
    src: contencaoVideo,
    poster: contencaoPoster,
    title: 'Placa em resina com fio metálico',
    description: 'Placa em resina transparente com fio metálico adaptada sobre modelo em gesso.',
    aspect: '9 / 16',
  },
];
