/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1.5rem', lg: '2.5rem' },
      screens: { '2xl': '1320px' },
    },
    extend: {
      colors: {
        // Vinho da marca, usado como acento e numa única área escura.
        wine: {
          DEFAULT: '#761B1D',
          deep: '#541315',
          dark: '#3A0D0E',
        },
        // Neutros quentes: papel de ficha técnica, não cinza de interface.
        paper: {
          DEFAULT: '#FBFAF7',
          dim: '#F2EFE9',
          deep: '#E8E4DB',
        },
        ink: {
          DEFAULT: '#1C1B19',
          soft: '#55534D',
          faint: '#6E6B65',
        },
        rule: {
          DEFAULT: '#DDD9D0',
          strong: '#C6C1B6',
        },
      },
      fontFamily: {
        // Archivo acompanha o peso condensado do logotipo; Plex Mono carrega
        // os dados técnicos (índices, horários, códigos).
        sans: ['Archivo', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        // Escala tipográfica fechada: nenhum título decide seu próprio tamanho.
        label: ['0.6875rem', { lineHeight: '1.2', letterSpacing: '0.1em' }],
        meta: ['0.75rem', { lineHeight: '1.5' }],
        body: ['0.9375rem', { lineHeight: '1.65' }],
        lead: ['1.0625rem', { lineHeight: '1.6' }],
        h4: ['1rem', { lineHeight: '1.35', letterSpacing: '-0.01em' }],
        h3: ['1.25rem', { lineHeight: '1.3', letterSpacing: '-0.015em' }],
        h2: ['1.875rem', { lineHeight: '1.18', letterSpacing: '-0.022em' }],
        'h2-lg': ['2.5rem', { lineHeight: '1.1', letterSpacing: '-0.028em' }],
        h1: ['2.5rem', { lineHeight: '1.08', letterSpacing: '-0.03em' }],
        'h1-lg': ['4rem', { lineHeight: '1.02', letterSpacing: '-0.035em' }],
      },
      borderRadius: {
        // Cantos quase retos: a forma vem da grade, não do arredondamento.
        DEFAULT: '2px',
        sm: '1px',
        md: '3px',
      },
      maxWidth: {
        measure: '62ch',
        'measure-sm': '46ch',
      },
      transitionDuration: { DEFAULT: '150ms' },
    },
  },
  plugins: [],
};
