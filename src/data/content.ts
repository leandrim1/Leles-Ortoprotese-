import {
  ClipboardCheck,
  Cpu,
  MapPin,
  MessageSquare,
  Microscope,
  PackageCheck,
  ScanLine,
  SearchCheck,
  Truck,
} from 'lucide-react';
import type { Differential, Pillar, ProcessStep } from '@/types';

/** Como o laboratório trabalha, na seção "O Laboratório". */
export const pillars: Pillar[] = [
  {
    id: 'prescricao',
    title: 'O caso é do dentista',
    description:
      'O laboratório executa o que vem na prescrição. Quando algo no modelo ou no pedido não fecha, avisamos antes de produzir.',
    icon: ClipboardCheck,
  },
  {
    id: 'digital',
    title: 'Digital quando o trabalho pede',
    description:
      'Parte dos casos passa por planejamento digital e impressão 3D. Outros seguem o fluxo convencional — o que define é o serviço.',
    icon: Cpu,
  },
  {
    id: 'contato',
    title: 'Contato direto',
    description:
      'Durante o trabalho você fala direto com o laboratório, pelo WhatsApp, com quem está acompanhando o caso.',
    icon: MessageSquare,
  },
];

/** Etapas do relacionamento, do primeiro contato à entrega. */
export const processSteps: ProcessStep[] = [
  {
    id: 'contato',
    step: 1,
    title: 'Contato',
    description: 'Você envia o caso pelo WhatsApp e informa qual serviço precisa.',
    icon: MessageSquare,
  },
  {
    id: 'alinhamento',
    step: 2,
    title: 'Alinhamento',
    description: 'Combinamos o serviço, os requisitos e o que precisa chegar ao laboratório.',
    icon: ScanLine,
  },
  {
    id: 'producao',
    step: 3,
    title: 'Produção',
    description: 'A peça é confeccionada seguindo o fluxo técnico do serviço contratado.',
    icon: Microscope,
  },
  {
    id: 'entrega',
    step: 4,
    title: 'Entrega',
    description: 'Combinamos a entrega e seguimos disponíveis durante o acompanhamento do caso.',
    icon: Truck,
  },
];

/** Diferenciais, descritos pelo que o laboratório faz. */
export const differentials: Differential[] = [
  {
    id: 'prescricao',
    title: 'Trabalho sob prescrição',
    description: 'O serviço segue o que o dentista especifica no caso. Nada é decidido pelo laboratório.',
    icon: ClipboardCheck,
  },
  {
    id: 'conferencia',
    title: 'Conferência sobre o modelo',
    description: 'A adaptação da peça é verificada sobre o modelo antes de sair do laboratório.',
    icon: SearchCheck,
  },
  {
    id: 'frentes',
    title: 'Cinco frentes de trabalho',
    description: 'Ortopedia, ortodontia fixa digital, impressão 3D, placas e alinhadores no mesmo lugar.',
    icon: PackageCheck,
  },
  {
    id: 'alcance',
    title: 'Atendimento a outras cidades',
    description: 'De Patos de Minas, atendemos profissionais de diversas regiões do Brasil.',
    icon: MapPin,
  },
];

/** Blocos da seção de tecnologia digital. */
export const technologyHighlights = [
  {
    id: 'modelagem',
    title: 'Modelagem digital',
    description: 'O caso é trabalhado em ambiente digital antes de ir para a produção.',
  },
  {
    id: 'modelos',
    title: 'Modelos impressos',
    description: 'Os modelos em 3D servem para montar a peça e conferir a adaptação.',
  },
  {
    id: 'impressao',
    title: 'Impressão 3D',
    description: 'Modelos e peças impressos entram no fluxo de trabalho do laboratório.',
  },
  {
    id: 'fluxo',
    title: 'Fluxo definido pelo serviço',
    description: 'Alguns trabalhos passam pelo digital do começo ao fim, outros seguem o convencional.',
  },
] as const;
