/**
 * Dados institucionais oficiais do Lab Leles.
 * Centralizados aqui para que alterações futuras não exijam mexer nos componentes.
 */

export const WHATSAPP_PHONE = '5534999753818';

export const site = {
  name: 'Lab Leles',
  legalName: 'Lab Leles — Ortoprótese',
  fullName: 'Lab Leles — Prótese Dentária',
  tagline: 'Laboratório de prótese dentária',
  shortDescription:
    'Laboratório de prótese dentária em Patos de Minas, Minas Gerais, com atendimento a profissionais da odontologia em todo o Brasil.',
  city: 'Patos de Minas',
  state: 'MG',
  address: {
    street: 'Rua Major Gote, 1317',
    district: 'Centro',
    city: 'Patos de Minas',
    state: 'MG',
    zip: '38700-001',
    get full() {
      return `${this.street} — ${this.district}, ${this.city} — ${this.state}, CEP ${this.zip}`;
    },
  },
  phoneDisplay: '(34) 99975-3818',
  whatsappUrl: `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}`,
  instagramHandle: '@lab_leles_ortoprotese',
  instagramUrl: 'https://www.instagram.com/lab_leles_ortoprotese/',
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Rua+Major+Gote%2C+1317+-+Centro%2C+Patos+de+Minas+-+MG%2C+38700-001',
  timeZone: 'America/Sao_Paulo',
} as const;

export const seo = {
  title: 'Lab Leles — Laboratório de Prótese Dentária em Patos de Minas/MG',
  description:
    'Laboratório de prótese dentária em Patos de Minas (MG). Ortopedia dentária, ortodontia fixa digital, impressão 3D, placas para bruxismo e alinhadores para dentistas e clínicas de todo o Brasil.',
  url: 'https://lableles.com.br',
  locale: 'pt_BR',
} as const;
