/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        bg: '#07080c',
        surface: '#0d0f15',
        panel: '#131620',
        'alt-bg': '#0a0b10',
        orange: {
          DEFAULT: '#e06218',
          hover: '#f07828',
          dark: '#c8520e',
        },
        cream: '#dde0e8',
        silver: '#9aa0b0',
        muted: '#616878',
        'border-orange': 'rgba(224, 98, 24, 0.2)',
        'border-subtle': 'rgba(224, 98, 24, 0.08)',
        'border-light': 'rgba(224, 98, 24, 0.12)',
        'border-strong': 'rgba(224, 98, 24, 0.3)',
      },
      fontFamily: {
        bebas: ['"Bebas Neue"', 'sans-serif'],
        'barlow-condensed': ['"Barlow Condensed"', 'sans-serif'],
        barlow: ['Barlow', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
