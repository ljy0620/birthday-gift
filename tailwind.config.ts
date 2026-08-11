import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        blush: {
          50: '#fff7fb',
          100: '#ffeaf4',
          200: '#ffd2e8',
          300: '#ffb3d5',
          400: '#ff8abc',
          500: '#ff5fa0',
          600: '#f03686',
          700: '#c61e69',
          800: '#9e1b56',
          900: '#82194a'
        }
      },
      boxShadow: {
        soft: '0 18px 40px rgba(130, 25, 74, 0.12)'
      }
    }
  },
  plugins: []
};

export default config;
