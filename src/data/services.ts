import { Activity, Boxes, Layers, Printer, ShieldCheck } from 'lucide-react';
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
 * Materiais, prazos e indicações clínicas são combinados caso a caso e não
 * aparecem aqui enquanto não forem confirmados pelo Lab Leles.
 */
export const services: Service[] = [
  {
    id: 'ortopedia-dentaria',
    name: 'Ortopedia dentária',
    tagline: 'Aparelhos ortopédicos',
    description:
      'Aparelhos ortopédicos confeccionados a partir dos modelos e da prescrição enviados pelo dentista.',
    icon: Activity,
    image: ortopediaImg,
    imageSmall: ortopediaThumb,
    imageAlt: 'Aparelho ortopédico em acrílico azul com parafuso expansor, produzido no Lab Leles.',
    highlights: ['Modelos e prescrição enviados pelo dentista', 'Adaptação conferida sobre o modelo'],
  },
  {
    id: 'ortodontia-fixa-digital',
    name: 'Ortodontia fixa digital',
    tagline: 'Fluxo digital',
    description:
      'Trabalhos de ortodontia fixa planejados em ambiente digital e executados sobre modelos impressos.',
    icon: Layers,
    image: ortodontiaImg,
    imageSmall: ortodontiaThumb,
    imageAlt: 'Modelo odontológico impresso com estrutura metálica de ortodontia fixa.',
    highlights: ['Planejamento em ambiente digital', 'Montagem sobre modelo impresso'],
  },
  {
    id: 'impressao-3d',
    name: 'Impressão 3D',
    tagline: 'Modelos e peças',
    description:
      'Impressão de modelos e peças odontológicas que entram no fluxo de trabalho do laboratório.',
    icon: Printer,
    image: impressaoImg,
    imageSmall: impressaoThumb,
    imageAlt: 'Modelos odontológicos impressos em 3D com aparelho expansor instalado.',
    highlights: ['Modelos e peças para o fluxo do laboratório', 'Reprodução fiel da anatomia recebida'],
  },
  {
    id: 'placas-bruxismo',
    name: 'Placas para bruxismo',
    tagline: 'Sob indicação clínica',
    description:
      'Placas confeccionadas conforme a indicação do dentista responsável pelo caso.',
    icon: ShieldCheck,
    image: placasImg,
    imageSmall: placasThumb,
    imageAlt: 'Placas e peças em resina sobre modelos odontológicos.',
    highlights: ['Confecção conforme indicação clínica', 'Ajuste de oclusão sobre os modelos'],
  },
  {
    id: 'alinhadores',
    name: 'Alinhadores',
    tagline: 'Planejamento do dentista',
    description:
      'Execução laboratorial de alinhadores a partir do planejamento enviado. O tratamento é conduzido pelo dentista.',
    icon: Boxes,
    image: alinhadoresImg,
    imageSmall: alinhadoresThumb,
    imageAlt: 'Modelo odontológico impresso em 3D com peça metálica adaptada.',
    highlights: ['Execução a partir do planejamento recebido', 'Tratamento clínico conduzido pelo dentista'],
  },
];
