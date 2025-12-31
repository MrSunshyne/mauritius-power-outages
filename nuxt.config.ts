// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-12-26',
  devtools: { enabled: true },

  modules: [
    '@vueuse/nuxt',
    '@nuxt/icon',
     'nuxt-og-image',
     '@vite-pwa/nuxt',
  ],

  // Enable SSR for dynamic OG meta tags
  ssr: true,
  nitro: {
    preset: 'netlify',
  },

  // Hybrid rendering: static pages except dynamic outage pages
  routeRules: {
    '/': { isr: 3600 },
    '/statistics': { isr: 3600 },
    '/outage/**': { isr: 900 },
    '/day/**': { isr: 86400 },
    '/locality/**': { isr: 86400 },
  },

  // Site config for OG Image module
  site: {
    url: 'https://power-outages-mauritius.netlify.app',
    name: 'Power Outages Mauritius',
  },

  // PWA configuration
  pwa: {
    registerType: 'prompt',
    
    manifest: {
      name: 'Power Outages Mauritius',
      short_name: 'Power Outages',
      description: 'Track scheduled power outages across Mauritius',
      theme_color: '#020024',
      background_color: '#020024',
      display: 'standalone',
      orientation: 'portrait-primary',
      scope: '/',
      start_url: '/?source=pwa',
      id: '/',
      lang: 'en',
      icons: [
        // Android icons (multiple sizes for different screen densities)
        {
          src: '/AppImages/android/android-launchericon-48-48.png',
          sizes: '48x48',
          type: 'image/png',
        },
        {
          src: '/AppImages/android/android-launchericon-72-72.png',
          sizes: '72x72',
          type: 'image/png',
        },
        {
          src: '/AppImages/android/android-launchericon-96-96.png',
          sizes: '96x96',
          type: 'image/png',
        },
        {
          src: '/AppImages/android/android-launchericon-144-144.png',
          sizes: '144x144',
          type: 'image/png',
        },
        {
          src: '/AppImages/android/android-launchericon-192-192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/AppImages/android/android-launchericon-512-512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        // Maskable icon for Android adaptive icons
        {
          src: '/maskable-icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    },
    
    workbox: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
      navigateFallbackDenylist: [/^\/api/, /^\/_/],
      runtimeCaching: [
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'images-cache',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24 * 30,
            },
          },
        },
        {
          urlPattern: /\.(?:woff|woff2|ttf|eot)$/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'fonts-cache',
            expiration: {
              maxEntries: 20,
              maxAgeSeconds: 60 * 60 * 24 * 365,
            },
          },
        },
        {
          urlPattern: /^https:\/\/raw\.githubusercontent\.com\/.*/i,
          handler: 'NetworkOnly',
        },
      ],
    },
    
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 3600, // Check for updates every hour
    },
    
    // Required for Netlify deployment
    registerWebManifestInRouteRules: true,
  },

  // OG Image configuration
  ogImage: {
    defaults: {
      width: 1200,
      height: 630,
      // Cache for 24 hours
      cacheMaxAgeSeconds: 60 * 60 * 24,
    },
  },

  // App configuration
  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        // iOS icons (multiple sizes for different devices)
        { rel: 'apple-touch-icon', href: '/AppImages/ios/180.png' },
        { rel: 'apple-touch-icon', sizes: '152x152', href: '/AppImages/ios/152.png' },
        { rel: 'apple-touch-icon', sizes: '167x167', href: '/AppImages/ios/167.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/AppImages/ios/180.png' },
      ],
      meta: [
        // Basic meta
        { name: 'msapplication-TileColor', content: '#020024' },
        { name: 'theme-color', content: '#020024' },
        { name: 'robots', content: 'index, follow' },
        { name: 'author', content: 'Power Outages Mauritius' },
        // Apple PWA meta tags
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'apple-mobile-web-app-title', content: 'Power Outages' },
        // Default OG tags (overridden by pages)
        { property: 'og:site_name', content: 'Power Outages Mauritius' },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'en_MU' },
        // og:image will be set automatically by nuxt-og-image
        // Twitter defaults
        { name: 'twitter:card', content: 'summary_large_image' },
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
    // Disable global page transition - we'll handle transitions at component level
    pageTransition: false,
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

  // Runtime config for environment variables
  // Nuxt automatically maps NUXT_PUBLIC_* env vars to runtimeConfig.public.*
  runtimeConfig: {
    public: {
      enableMockData: false, // default value, can be overridden by NUXT_PUBLIC_ENABLE_MOCK_DATA
    },
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
