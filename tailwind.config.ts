import type { Config } from 'tailwindcss';

function rgb(variableName: string) {
  return `rgb(var(${variableName}) / <alpha-value>)`;
}

const config: Config = {
  content: ['./src/app/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'selector',
  theme: {
    extend: {
      colors: {
        background: {
          start: rgb('--background-start-rgb'),
          end: rgb('--background-end-rgb'),
        },
        text: {
          primary: rgb('--text-primary-rgb'),
          secondary: rgb('--text-secondary-rgb'),
        },
        border: {
          DEFAULT: rgb('--border-rgb'),
        },
        card: {
          background: rgb('--card-background-rgb'),
        },
        primary: {
          accent: rgb('--primary-accent-rgb'),
        },
        priority: {
          high: rgb('--priority-high-rgb'),
          medium: rgb('--priority-medium-rgb'),
          low: rgb('--priority-low-rgb'),
        },
      },
      borderColor: ({ theme }) => ({
        DEFAULT: theme('colors.border.DEFAULT'),
      }),
      boxShadow: {
        card: '0 4px 12px rgba(0, 0, 0, 0.05)',
        'card-dark': '0 6px 16px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
};

export default config;
