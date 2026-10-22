import type { Practice, ProcessStep } from '@/types';

/**
 * Como o laboratório trabalha.
 * Afirmações sobre a operação, não adjetivos de marketing.
 */
export const practices: Practice[] = [
  {
    id: 'prescricao',
    title: 'O caso é do dentista',
    description:
      'O laboratório executa o que vem na prescrição. Quando algo no modelo ou no pedido não fecha, avisamos antes de produzir.',
  },
  {
    id: 'digital',
    title: 'Digital quando o trabalho pede',
    description:
      'Parte dos casos passa por planejamento digital e impressão 3D. Outros seguem o fluxo convencional — o que define é o serviço.',
  },
  {
    id: 'contato',
    title: 'Contato direto',
    description:
      'Durante o trabalho você fala direto com o laboratório, pelo WhatsApp, com quem está acompanhando o caso.',
  },
];

/** Etapas do relacionamento, do primeiro contato à entrega. */
export const processSteps: ProcessStep[] = [
  {
    id: 'contato',
    step: '01',
    title: 'Contato',
    description: 'Você envia o caso pelo WhatsApp e informa qual serviço precisa.',
  },
  {
    id: 'alinhamento',
    step: '02',
    title: 'Alinhamento',
    description: 'Combinamos o serviço, os requisitos e o que precisa chegar ao laboratório.',
  },
  {
    id: 'producao',
    step: '03',
    title: 'Produção',
    description: 'A peça é confeccionada seguindo o fluxo técnico do serviço contratado.',
  },
  {
    id: 'entrega',
    step: '04',
    title: 'Entrega',
    description: 'Combinamos a entrega e seguimos disponíveis durante o acompanhamento do caso.',
  },
];
