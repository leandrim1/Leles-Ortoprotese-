/**
 * Cadastra as categorias e os cinco serviços informados pelo laboratório.
 * Só insere o que ainda não existe; rodar de novo não duplica nem sobrescreve.
 *
 * Preços, prazos e materiais ficam em branco de propósito: devem ser definidos
 * pelo Lab Leles no painel, não chutados aqui.
 */
import { neonSql } from '../src/server/db/neon';

const SERVICOS = [
  { slug: 'ortopedia-dentaria', name: 'Ortopedia dentária', categoria: 'ortopedia' },
  { slug: 'ortodontia-fixa-digital', name: 'Ortodontia fixa digital', categoria: 'ortodontia' },
  { slug: 'impressao-3d', name: 'Impressão 3D', categoria: 'digital' },
  { slug: 'placas-bruxismo', name: 'Placas para bruxismo', categoria: 'placas' },
  { slug: 'alinhadores', name: 'Alinhadores', categoria: 'alinhadores' },
];

const CATEGORIAS = [
  { slug: 'ortopedia', name: 'Ortopedia' },
  { slug: 'ortodontia', name: 'Ortodontia' },
  { slug: 'digital', name: 'Fluxo digital' },
  { slug: 'placas', name: 'Placas' },
  { slug: 'alinhadores', name: 'Alinhadores' },
];

const sql = neonSql();

for (const [i, c] of CATEGORIAS.entries()) {
  await sql.query(
    `INSERT INTO service_categories (slug, name, sort_order) VALUES ($1, $2, $3)
     ON CONFLICT (slug) DO NOTHING`,
    [c.slug, c.name, i],
  );
}

for (const [i, s] of SERVICOS.entries()) {
  await sql.query(
    `INSERT INTO services (slug, name, category_id, requires_quote, sort_order)
     VALUES ($1, $2, (SELECT id FROM service_categories WHERE slug = $3), true, $4)
     ON CONFLICT (slug) DO NOTHING`,
    [s.slug, s.name, s.categoria, i],
  );
}

// Horários informados pelo laboratório.
const HORARIOS: [number, string | null, string | null][] = [
  [0, null, null], [1, '07:30', '17:30'], [2, '07:30', '17:30'], [3, '07:30', '17:30'],
  [4, '07:00', '17:30'], [5, '07:30', '17:30'], [6, null, null],
];

for (const [weekday, opens, closes] of HORARIOS) {
  await sql.query(
    `INSERT INTO business_hours (weekday, opens_at, closes_at, closed)
     VALUES ($1, $2, $3, $4) ON CONFLICT (weekday) DO NOTHING`,
    [weekday, opens, closes, opens === null],
  );
}

console.log(`Catálogo semeado: ${CATEGORIAS.length} categorias, ${SERVICOS.length} serviços, horários.`);
