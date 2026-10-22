import {
  Crosshair,
  Cpu,
  Handshake,
  Layers3,
  MessageSquare,
  Microscope,
  PackageCheck,
  ScanLine,
  Sparkles,
  Truck,
} from 'lucide-react';
import type { Differential, Pillar, ProcessStep } from '@/types';

/** Pilares institucionais da seção "O Laboratório". */
export const pillars: Pillar[] = [
  {
    id: 'precisao',
    title: 'Precisão',
    description: 'Atenção aos detalhes em cada etapa do processo de fabricação.',
    icon: Crosshair,
  },
  {
    id: 'tecnologia',
    title: 'Tecnologia',
    description: 'Recursos digitais aplicados à produção de soluções protéticas.',
    icon: Cpu,
  },
  {
    id: 'parceria',
    title: 'Parceria',
    description: 'Relacionamento próximo com dentistas e clínicas para facilitar o fluxo de trabalho.',
    icon: Handshake,
  },
];

/** Visão geral do fluxo de relacionamento com o profissional. */
export const processSteps: ProcessStep[] = [
  {
    id: 'contato',
    step: 1,
    title: 'Contato profissional',
    description: 'O dentista entra em contato com o laboratório para apresentar o caso.',
    icon: MessageSquare,
  },
  {
    id: 'alinhamento',
    step: 2,
    title: 'Alinhamento do trabalho',
    description: 'São definidos o serviço solicitado e os requisitos necessários para a execução.',
    icon: ScanLine,
  },
  {
    id: 'producao',
    step: 3,
    title: 'Produção laboratorial',
    description: 'O trabalho segue o fluxo técnico aplicável ao serviço contratado.',
    icon: Microscope,
  },
  {
    id: 'entrega',
    step: 4,
    title: 'Entrega e acompanhamento',
    description: 'O laboratório combina a entrega e mantém o contato conforme o processo estabelecido.',
    icon: Truck,
  },
];

/** Diferenciais institucionais de posicionamento. */
export const differentials: Differential[] = [
  {
    id: 'digital',
    title: 'Atuação com tecnologia digital',
    description: 'Recursos digitais e impressão 3D integrados ao trabalho protético do laboratório.',
    icon: Layers3,
  },
  {
    id: 'detalhes',
    title: 'Atenção aos detalhes',
    description: 'Conferência cuidadosa do acabamento e da adaptação de cada peça produzida.',
    icon: Sparkles,
  },
  {
    id: 'solucoes',
    title: 'Variedade de soluções',
    description: 'Ortopedia, ortodontia digital, impressão 3D, placas e alinhadores em um só laboratório.',
    icon: PackageCheck,
  },
  {
    id: 'alcance',
    title: 'Atendimento a diferentes localidades',
    description: 'De Patos de Minas, atendemos profissionais de diversas regiões do Brasil.',
    icon: Truck,
  },
];

/** Blocos visuais da seção de tecnologia digital. */
export const technologyHighlights = [
  {
    id: 'modelagem',
    title: 'Modelagem odontológica digital',
    description: 'O caso recebido é trabalhado em ambiente digital antes de seguir para a produção.',
  },
  {
    id: 'modelos',
    title: 'Modelos tridimensionais',
    description: 'Modelos em três dimensões apoiam a conferência da anatomia e da adaptação das peças.',
  },
  {
    id: 'impressao',
    title: 'Impressão 3D',
    description: 'A impressão 3D materializa modelos e peças que integram o fluxo laboratorial.',
  },
  {
    id: 'producao',
    title: 'Planejamento e produção',
    description: 'Planejamento e produção caminham juntos, do recebimento do caso à entrega do trabalho.',
  },
] as const;
