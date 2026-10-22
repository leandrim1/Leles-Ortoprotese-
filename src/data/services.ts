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
 * As descrições são institucionais e devem ser validadas pelo Lab Leles antes de
 * receberem especificações técnicas, materiais ou prazos.
 */
export const services: Service[] = [
  {
    id: 'ortopedia-dentaria',
    name: 'Ortopedia dentária',
    tagline: 'Aparelhos ortopédicos',
    description:
      'Confecção de aparelhos de ortopedia dentária a partir do planejamento enviado pelo profissional, com acabamento cuidadoso em cada peça.',
    icon: Activity,
    image: ortopediaImg,
    imageSmall: ortopediaThumb,
    imageAlt: 'Aparelho ortopédico em acrílico azul com parafuso expansor, produzido no Lab Leles.',
    highlights: ['Trabalho sob prescrição do profissional', 'Acabamento conferido peça a peça'],
  },
  {
    id: 'ortodontia-fixa-digital',
    name: 'Ortodontia fixa digital',
    tagline: 'Fluxo digital',
    description:
      'Soluções de ortodontia fixa apoiadas em recursos digitais, do recebimento do caso à entrega do trabalho ao consultório.',
    icon: Layers,
    image: ortodontiaImg,
    imageSmall: ortodontiaThumb,
    imageAlt: 'Modelo odontológico impresso com estrutura metálica de ortodontia fixa.',
    highlights: ['Apoio de recursos digitais no planejamento', 'Adaptação verificada sobre modelo'],
  },
  {
    id: 'impressao-3d',
    name: 'Impressão 3D',
    tagline: 'Modelos e peças',
    description:
      'Impressão 3D aplicada à produção de modelos e peças odontológicas, ampliando as possibilidades de planejamento laboratorial.',
    icon: Printer,
    image: impressaoImg,
    imageSmall: impressaoThumb,
    imageAlt: 'Modelos odontológicos impressos em 3D com aparelho expansor instalado.',
    highlights: ['Modelos impressos para o fluxo de trabalho', 'Reprodução fiel da anatomia recebida'],
  },
  {
    id: 'placas-bruxismo',
    name: 'Placas para bruxismo',
    tagline: 'Placas miorrelaxantes',
    description:
      'Placas voltadas ao manejo do bruxismo, confeccionadas conforme a indicação do dentista responsável pelo caso.',
    icon: ShieldCheck,
    image: placasImg,
    imageSmall: placasThumb,
    imageAlt: 'Placas e peças em resina sobre modelos odontológicos.',
    highlights: ['Confecção conforme indicação clínica', 'Ajuste de oclusão sobre os modelos'],
  },
  {
    id: 'alinhadores',
    name: 'Alinhadores',
    tagline: 'Soluções estéticas',
    description:
      'Soluções laboratoriais relacionadas a alinhadores, executadas a partir do planejamento do profissional responsável pelo tratamento.',
    icon: Boxes,
    image: alinhadoresImg,
    imageSmall: alinhadoresThumb,
    imageAlt: 'Modelo odontológico impresso em 3D com peça metálica adaptada.',
    highlights: ['Execução a partir do planejamento recebido', 'Tratamento clínico conduzido pelo dentista'],
  },
];
