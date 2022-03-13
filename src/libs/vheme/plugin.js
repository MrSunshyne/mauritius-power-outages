const plugin = require('tailwindcss/plugin')
const paletteGenerator = require('@bobthered/tailwindcss-palette-generator')

module.exports = plugin.withOptions(
  (options) => {
    return function({ addUtilities, e, theme, variants }) {
      // const classPrefix = options.classPrefix ?? 'bg-gradient'
      // const gradients = theme('gradients', {})
      // const gradientVariants = variants('gradients', [])

      // const utilities = _.map(gradients, ([start, end], name) => ({
      //     [`.${e(`${classPrefix}-${name}`)}`]: {
      //         backgroundImage: `linear-gradient(to right, ${start}, ${end})`
      //     }
      // }))

      // addUtilities(utilities, gradientVariants)
    }
  },
  (options) => {
    return {
      theme: {
        colors: theme => ({
          secondary: {
            DEFAULT: '#ff0000',
            350: '#ff0000',
          },
          primary: paletteGenerator('#60976c', 'hsl').primary,
          layer: {
            DEFAULT: 'var(--layer-200)',
            100: 'var(--layer-100)',
            200: 'var(--layer-200)',
            300: 'var(--layer-300)',
            400: 'var(--layer-400)',
          },
          text: {
            DEFAULT: 'var(--text-100)',
            100: 'var(--text-100)',
            200: 'var(--text-200)',
            300: 'var(--text-300)',
            400: 'var(--text-400)',
          },
          border: {
            DEFAULT: 'var(--border-100)',
            100: 'var(--border-100)',
            200: 'var(--border-200)',
            300: 'var(--border-300)',
          },

        }),
      },
      variants: {
        gradients: ['responsive', 'hover'],
      },
    }
  },
)
