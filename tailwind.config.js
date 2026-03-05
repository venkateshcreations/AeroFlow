/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0F4C8A',
          light: '#1A6FBF',
          50: '#E8F4FD',
        },
        accent: {
          DEFAULT: '#00C2A8',
          light: '#00E5C8',
        },
        dark: {
          DEFAULT: '#0A1628',
          mid: '#1C2E4A',
        },
        mid: '#3D5A80',
        sky: '#E8F4FD',
        'text-mid': '#4A6080',
        'text-light': '#8A9BB0',
        success: '#00B894',
        warn: '#FF6B35',
        danger: '#E84393',
        gold: '#FFB800',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      borderRadius: {
        xl: '16px',
        '2xl': '20px',
      },
      boxShadow: {
        card: '0 2px 24px rgba(15,76,138,0.08)',
        'card-hover': '0 20px 60px rgba(15,76,138,0.15)',
      },
    },
  },
  plugins: [],
};
