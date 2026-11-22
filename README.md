# ⚡ Power Outages Mauritius

Real-time power outage information for Mauritius residents. View scheduled outages, track live status, and browse historical data.

## Features

- **Live schedule** with today's and tomorrow's outages
- **Real-time countdown timers** for ongoing outages
- **Detailed outage pages** with status tracking
- **Dynamic social sharing** with custom OG images
- **SSR/ISR** for optimal performance and SEO

## Tech

- **Nuxt 4** with Vue 3 & TypeScript
- **Tailwind CSS v4** for styling
- **ApexCharts** for data visualization
- **nuxt-og-image** for dynamic social previews
- Deployed on **Cloudflare Pages** at https://courant.ramgolam.com

The first deploy, https://power-outages-mauritius.netlify.app, now only 301-redirects every
path (query string included) to courant.ramgolam.com. `netlify.toml` publishes `netlify-redirect/`
instead of building the app; that folder holds a `sw.js` that removes the old PWA service worker.

## Quick Start

```bash
# Install
pnpm install

# Run dev server
pnpm dev

# Build
pnpm build
```

## Data

Uses data from [mauritius-dataset-electricity](https://github.com/MrSunshyne/mauritius-dataset-electricity).

## Credits

- Candle animation from [Codepen](https://codepen.io/comehope/details/LBPvON)
