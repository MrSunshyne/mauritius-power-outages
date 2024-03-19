const colors = require('tailwindcss/colors')
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  safelist: ['prose', 'prose-sm', 'm-auto', 'text-left', 'container'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        ...colors,
      },
      typography: {
        DEFAULT: {
          css: {
            color: 'var(--text-0)',
          },
        },
      },
      screens: {
        '2xl': '1536px',
      },
      maxWidth: {
        '8xl': '100rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/typography'),
  ],
}
