import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['var(--font-press-start)', 'var(--font-dot-gothic)', 'cursive'],
      },
      colors: {
        retro: {
          base: '#dbeafe', // Cool light blue-gray (Nintendo menu style)
          dark: '#1e293b', // Dark slate
          card: '#ffffff',
          border: '#000000',
          primary: '#2563eb', // Royal Blue
          secondary: '#7c3aed', // Deep Purple
          accent: '#06b6d4', // Cyan
        },
        mario: {
          sky: '#6b8cff',
          ground: '#e45c10',
          brick: '#c46237',
          pipe: '#00c300',
          coin: '#fbad08',
          cloud: '#ffffff',
          mountain: '#00a34b',
          peach: '#ffdab9',
          warm: '#f8dcb4',
        },
        pixel: {
          cyan: '#22d3ee',
          purple: '#a855f7',
          pink: '#ec4899',
          orange: '#ef7d57',
        }
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(34, 211, 238, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(168, 85, 247, 0.8)' },
        }
      }
    },
  },
  plugins: [],
} satisfies Config;
