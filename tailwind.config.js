/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'krea-bg': '#0a0a0a',
        'krea-dark': '#1a1a1a',
        'krea-darker': '#0f0f0f',
        'krea-accent': '#6366f1',
        'krea-accent-light': '#818cf8',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(99, 102, 241, 0.7)' },
          '50%': { boxShadow: '0 0 0 10px rgba(99, 102, 241, 0)' },
        },
      },
    },
  },
  plugins: [],
};
