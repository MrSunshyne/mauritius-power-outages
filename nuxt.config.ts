// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-12-26',
  devtools: { enabled: true },

  modules: [
    '@vueuse/nuxt',
    '@nuxt/icon',
  ],

  // Enable SSR for dynamic OG meta tags
  ssr: true,
  nitro: {
    preset: 'netlify',
  },

  // Hybrid rendering: static pages except dynamic outage pages
  routeRules: {
    // Homepage and statistics are static (ISR with 1 hour revalidation)
    '/': { isr: 3600 },
    '/statistics': { isr: 3600 },
    // Dynamic outage pages are server-rendered for OG tags
    '/outage/**': { ssr: true },
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
        // Default OG tags (overridden by pages)
        { property: 'og:site_name', content: 'Power Outages Mauritius' },
        { property: 'og:type', content: 'website' },
        { property: 'og:image', content: 'https://power-outages-mauritius.netlify.app/logo.png' },
        { name: 'twitter:card', content: 'summary' },
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
