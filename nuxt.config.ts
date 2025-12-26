// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-12-26',
  devtools: { enabled: true },

  modules: [
    '@vueuse/nuxt',
    '@nuxt/icon',
    '@pinia/nuxt',
  ],

  // Static site generation (SPA mode to avoid SSR issues with vue-countdown and apexcharts)
  ssr: false,
  nitro: {
    preset: 'static',
  },

  // App configuration
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],
      meta: [
        { name: 'msapplication-TileColor', content: '#00aba9' },
        { name: 'theme-color', content: '#ffffff' },
      ],
      script: [
        // Dark mode initialization (prevents flash)
        {
          innerHTML: `(function(){const prefersDark=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches;const setting=localStorage.getItem("nuxt-color-mode")||"system";if(setting==="dark"||(prefersDark&&setting!=="light"))document.documentElement.classList.add("dark")})()`,
        },
        // GoatCounter
        {
          src: '//gc.zgo.at/count.js',
          async: true,
          'data-goatcounter': 'https://power-outages-mauritius.goatcounter.com/count',
        },
        // Umami Analytics
        {
          src: 'https://cloud.umami.is/script.js',
          defer: true,
          'data-website-id': '18b48648-e7d1-40f2-88e5-322e805d6536',
        },
      ],
    },
    pageTransition: { name: 'slide', mode: 'out-in' },
  },

  // CSS
  css: ['~/assets/css/main.css'],

  // PostCSS with Tailwind v4
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
    },
  },

  // TypeScript
  typescript: {
    strict: true,
  },

  // Auto-imports for custom composables
  imports: {
    dirs: ['composables', 'utils'],
  },

  // Icon configuration (Carbon icons)
  icon: {
    serverBundle: 'remote',
  },
})
