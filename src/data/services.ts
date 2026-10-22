import type { Service } from '@/types';

import ortopediaImg from '@/assets/gallery/placa-ortopedica.webp';
import ortopediaThumb from '@/assets/gallery/placa-ortopedica-sm.webp';
import ortodontiaImg from '@/assets/gallery/ortodontia-digital.webp';
import ortodontiaThumb from '@/assets/gallery/ortodontia-digital-sm.webp';
import impressaoImg from '@/assets/gallery/impressao-3d-expansor.webp';
import impressaoThumb from '@/assets/gallery/impressao-3d-expansor-sm.webp';
import placasImg from '@/assets/gallery/proteses-resina.webp';
import placasThumb from '@/assets/gallery/proteses-resina-sm.webp';
import alinhadoresImg from '@/assets/gallery/modelo-3d-banda.webp';
import alinhadoresThumb from '@/assets/gallery/modelo-3d-banda-sm.webp';

/**
 * Serviços informados pelo laboratório.
 * As descrições dizem o que o laboratório executa e de onde vem a prescrição.
 * Materiais, prazos e indicações clínicas são definidos caso a caso e não
 * aparecem aqui enquanto não forem confirmados pelo Lab Leles.
 */
export const services: Service[] = [
  {
    id: 'ortopedia-dentaria',
    index: '01',
    name: 'Ortopedia dentária',
    description:
      'Aparelhos ortopédicos confeccionados a partir dos modelos e da prescrição enviados pelo dentista.',
    image: ortopediaImg,
    imageSmall: ortopediaThumb,
    imageAlt: 'Aparelho ortopédico em acrílico azul com parafuso expansor.',
  },
  {
    id: 'ortodontia-fixa-digital',
    index: '02',
    name: 'Ortodontia fixa digital',
    description:
      'Trabalhos de ortodontia fixa planejados em ambiente digital e executados sobre modelos impressos.',
    image: ortodontiaImg,
    imageSmall: ortodontiaThumb,
    imageAlt: 'Modelo impresso com estrutura metálica de ortodontia fixa adaptada.',
  },
  {
    id: 'impressao-3d',
    index: '03',
    name: 'Impressão 3D',
    description: 'Impressão de modelos e peças odontológicas que entram no fluxo de trabalho do laboratório.',
    image: impressaoImg,
    imageSmall: impressaoThumb,
    imageAlt: 'Modelos odontológicos impressos em 3D com aparelho expansor instalado.',
  },
  {
    id: 'placas-bruxismo',
    index: '04',
    name: 'Placas para bruxismo',
    description: 'Placas confeccionadas conforme a indicação do dentista responsável pelo caso.',
    image: placasImg,
    imageSmall: placasThumb,
    imageAlt: 'Peças em resina e acrílico finalizadas sobre modelos odontológicos.',
  },
  {
    id: 'alinhadores',
    index: '05',
    name: 'Alinhadores',
    description:
      'Execução laboratorial de alinhadores a partir do planejamento enviado. O tratamento é conduzido pelo dentista.',
    image: alinhadoresImg,
    imageSmall: alinhadoresThumb,
    imageAlt: 'Modelo odontológico impresso em 3D com peça metálica adaptada.',
  },
];
