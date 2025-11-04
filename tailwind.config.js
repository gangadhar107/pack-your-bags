/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        mint: '#A7F3D0',
        teal: '#14B8A6',
        sky: '#38BDF8',
        orange: '#FB923C',
      },
      boxShadow: {
        soft: '0 8px 20px rgba(0,0,0,0.08)',
      },
      borderRadius: {
        xl: '1rem',
      },
      backgroundImage: {
        'mint-sky': 'linear-gradient(135deg, #D5FBE6 0%, #CFFAFE 40%, #BAE6FD 100%)',
        'teal-gradient': 'linear-gradient(135deg, #2dd4bf, #22c55e)',
        'orange-gradient': 'linear-gradient(135deg, #FDBA74, #FB923C)',
        'teal-sky': 'linear-gradient(135deg, #2dd4bf, #38bdf8)',
      },
    },
  },
  plugins: [],
}