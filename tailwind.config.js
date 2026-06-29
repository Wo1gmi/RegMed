/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sidebar: '#0D1B2E',
        mainbg: '#0F172A',
        card: '#1E293B',
        border: '#334155',
        azure: '#06B6D4',
        'azure-active': '#164E63',
        green: '#22C55E',
        yellow: '#EAB308',
        red: '#EF4444',
        primary: '#F1F5F9',
        muted: '#94A3B8',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
