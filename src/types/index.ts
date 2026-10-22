/** Item de navegação por âncora da página institucional. */
export interface NavItem {
  /** Rótulo exibido no menu. */
  label: string;
  /** Id da seção correspondente, sem o "#". */
  sectionId: string;
}

/** Serviço oferecido pelo laboratório. */
export interface Service {
  id: string;
  /** Índice de dois dígitos usado na listagem. */
  index: string;
  name: string;
  description: string;
  image: string;
  imageSmall: string;
  /** Texto alternativo da imagem. */
  imageAlt: string;
}

/** Afirmação sobre como o laboratório trabalha. */
export interface Practice {
  id: string;
  title: string;
  description: string;
}

/** Etapa do fluxo de trabalho com o profissional. */
export interface ProcessStep {
  id: string;
  /** Índice de dois dígitos, por exemplo "01". */
  step: string;
  title: string;
  description: string;
}

/** Imagem da galeria de trabalhos. */
export interface GalleryItem {
  id: string;
  /** Versão ampliada, usada no modal. */
  src: string;
  /** Versão reduzida, usada na grade. */
  thumb: string;
  alt: string;
  caption: string;
  /** Categoria usada apenas como legenda contextual. */
  category: string;
}

/** Vídeo gravado no laboratório, exibido com frame de capa. */
export interface LabVideo {
  id: string;
  src: string;
  /** Frame escolhido como capa do vídeo. */
  poster: string;
  title: string;
  description: string;
  /** Proporção natural do vídeo, por exemplo "3 / 4". */
  aspect: string;
}

/** Dias da semana no formato usado pelo horário de funcionamento. */
export type WeekdayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** Horário de funcionamento de um dia da semana. */
export interface BusinessDay {
  /** 0 = domingo ... 6 = sábado, igual a Date#getDay. */
  weekday: WeekdayIndex;
  label: string;
  shortLabel: string;
  /** Abertura em minutos desde a meia-noite. `null` quando fechado. */
  opensAt: number | null;
  /** Fechamento em minutos desde a meia-noite. `null` quando fechado. */
  closesAt: number | null;
}

/** Situação de atendimento calculada no navegador. */
export interface OpenStatus {
  isOpen: boolean;
  /** Dia da semana atual no fuso do laboratório. */
  today: BusinessDay;
  /** Minutos desde a meia-noite no fuso do laboratório. */
  nowMinutes: number;
  /** Mensagem curta sobre o próximo horário de atendimento. */
  nextChange: string;
}

/** Campos do formulário visual de contato. */
export interface ContactFormValues {
  name: string;
  clinic: string;
  phone: string;
  email: string;
  service: string;
  message: string;
}

/** Erros de validação por campo do formulário. */
export type ContactFormErrors = Partial<Record<keyof ContactFormValues, string>>;
