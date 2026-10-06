/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#0b0f19',
          card: '#131b2e',
          border: '#1e293b',
          accent: '#00f0ff',
          alert: '#ff0055',
          warning: '#ffb700',
          success: '#00ff66'
        }
      }
    },
  },
  plugins: [],
}
