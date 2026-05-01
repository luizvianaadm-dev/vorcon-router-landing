/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0f172a', // slate-900 (Matrix background)
          whatsapp: '#25D366', // WhatsApp Green
          teal: '#128C7E', // WhatsApp Teal Dark
          blue: '#3b82f6', // Vorcon Blue
          glow: '#0ea5e9' // Aura Neon Blue
        }
      },
      animation: {
        'matrix-rain': 'matrix-rain 20s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'matrix-rain': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        }
      }
    },
  },
  plugins: [],
}
