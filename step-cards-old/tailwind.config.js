/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Atkinson Hyperlegible', 'system-ui', 'sans-serif'],
      },
      colors: {
        surface: '#FAF9F7',
        card: '#FFFFFF',
        'card-done': '#F0F0EE',
        primary: '#1A1A1A',
        muted: '#6B7280',
        'step-num': '#9CA3AF',
        border: '#E5E7EB',
        active: '#60A5FA',
        help: '#F59E0B',
        'btn-primary': '#2563EB',
        'btn-secondary': '#F3F4F6',
      },
    },
  },
  plugins: [],
}
