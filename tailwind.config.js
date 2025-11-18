/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B35', // Laranja principal
        secondary: '#F7931E', // Laranja secundário
        dark: '#2C3E50', // Cinza escuro
        light: '#ECF0F1', // Cinza claro
      },
    },
  },
  plugins: [],
}