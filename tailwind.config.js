/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        body: ['"Space Grotesk"', 'sans-serif'],
        label: ['Syncopate', 'sans-serif'],
      },
      colors: {
        black: '#070709',
        surface: '#0E0D12',
        cream: '#F0EBE3',
        muted: '#6B6560',
        gold: '#C8A066',
        violet: '#9B7FE8',
        border: '#1A1820',
      }
    }
  },
  plugins: []
}
