import type { GalleryItem } from '@/types';

import aparelhoContencao from '@/assets/gallery/aparelho-contencao.webp';
import aparelhoContencaoSm from '@/assets/gallery/aparelho-contencao-sm.webp';
import coroasModelos from '@/assets/gallery/coroas-modelos.webp';
import coroasModelosSm from '@/assets/gallery/coroas-modelos-sm.webp';
import impressao3d from '@/assets/gallery/impressao-3d-expansor.webp';
import impressao3dSm from '@/assets/gallery/impressao-3d-expansor-sm.webp';
import modelo3dBanda from '@/assets/gallery/modelo-3d-banda.webp';
import modelo3dBandaSm from '@/assets/gallery/modelo-3d-banda-sm.webp';
import modeloGesso from '@/assets/gallery/modelo-gesso-arco.webp';
import modeloGessoSm from '@/assets/gallery/modelo-gesso-arco-sm.webp';
import ortodontiaDigital from '@/assets/gallery/ortodontia-digital.webp';
import ortodontiaDigitalSm from '@/assets/gallery/ortodontia-digital-sm.webp';
import placaOrtopedica from '@/assets/gallery/placa-ortopedica.webp';
import placaOrtopedicaSm from '@/assets/gallery/placa-ortopedica-sm.webp';
import proteseParcial from '@/assets/gallery/protese-parcial.webp';
import proteseParcialSm from '@/assets/gallery/protese-parcial-sm.webp';
import protesesResina from '@/assets/gallery/proteses-resina.webp';
import protesesResinaSm from '@/assets/gallery/proteses-resina-sm.webp';

/** Fotografias de trabalhos enviadas pelo próprio laboratório. */
export const galleryItems: GalleryItem[] = [
  {
    id: 'ortodontia-digital',
    src: ortodontiaDigital,
    thumb: ortodontiaDigitalSm,
    alt: 'Modelo odontológico impresso com estrutura metálica de ortodontia fixa adaptada.',
    caption: 'Estrutura de ortodontia fixa adaptada sobre modelo impresso',
    category: 'Ortodontia fixa digital',
  },
  {
    id: 'placa-ortopedica',
    src: placaOrtopedica,
    thumb: placaOrtopedicaSm,
    alt: 'Aparelho ortopédico em acrílico azul com parafuso expansor.',
    caption: 'Aparelho ortopédico em acrílico com parafuso expansor',
    category: 'Ortopedia dentária',
  },
  {
    id: 'impressao-3d-expansor',
    src: impressao3d,
    thumb: impressao3dSm,
    alt: 'Modelos odontológicos impressos em 3D, um deles com aparelho expansor instalado.',
    caption: 'Modelos impressos em 3D com aparelho instalado',
    category: 'Impressão 3D',
  },
  {
    id: 'aparelho-contencao',
    src: aparelhoContencao,
    thumb: aparelhoContencaoSm,
    alt: 'Modelo impresso em 3D com aparelho de fios metálicos e bandas.',
    caption: 'Aparelho em fio metálico montado sobre modelo impresso',
    category: 'Ortodontia',
  },
  {
    id: 'proteses-resina',
    src: protesesResina,
    thumb: protesesResinaSm,
    alt: 'Conjunto de peças em resina e acrílico sobre modelos odontológicos.',
    caption: 'Peças em resina e acrílico finalizadas',
    category: 'Prótese dentária',
  },
  {
    id: 'modelo-3d-banda',
    src: modelo3dBanda,
    thumb: modelo3dBandaSm,
    alt: 'Modelo odontológico impresso em 3D com peça metálica adaptada.',
    caption: 'Peça metálica adaptada sobre modelo impresso',
    category: 'Impressão 3D',
  },
  {
    id: 'protese-parcial',
    src: proteseParcial,
    thumb: proteseParcialSm,
    alt: 'Prótese parcial em resina posicionada sobre modelo odontológico.',
    caption: 'Prótese parcial sobre modelo de trabalho',
    category: 'Prótese dentária',
  },
  {
    id: 'coroas-modelos',
    src: coroasModelos,
    thumb: coroasModelosSm,
    alt: 'Modelos odontológicos em gesso com peças metálicas adaptadas.',
    caption: 'Peças metálicas adaptadas sobre modelos de gesso',
    category: 'Trabalho laboratorial',
  },
  {
    id: 'modelo-gesso-arco',
    src: modeloGesso,
    thumb: modeloGessoSm,
    alt: 'Modelo odontológico em gesso com arco metálico adaptado.',
    caption: 'Arco metálico adaptado sobre modelo em gesso',
    category: 'Trabalho laboratorial',
  },
];
