# ⚡ Power Outages - Mauritius

A modern, real-time web application providing comprehensive power outage information for Mauritius residents. Built with Nuxt 4 and featuring dynamic social sharing, live status updates

![Power Outages Mauritius](https://power-outages-mauritius.netlify.app/og/home.png)

## 🌟 Features

### 🏠 Homepage

- **Live Schedule**: View today's and tomorrow's scheduled power outages
- **Real-time Updates**: Live countdown timers for ongoing outages
- **Interactive Navigation**: Browse historical outage data by date
- **Status Indicators**: Visual cues for upcoming, ongoing, and completed outages

### 📊 Statistics Dashboard

- **Comprehensive Analytics**: Interactive charts showing outage patterns
- **Time-based Analysis**: Outages by day of week, month, and hour
- **Geographic Insights**: Outage distribution by district
- **Data Visualization**: Powered by ApexCharts for rich, interactive displays

### 🔍 Individual Outage Details

- **Detailed Information**: Complete outage specifics including location, time, and affected areas
- **Live Status Tracking**: Real-time status updates (scheduled, ongoing, completed)
- **Countdown Timers**: Live countdown for when power will be cut or restored
- **Historical Context**: Clear indication of past outages to prevent confusion
- **Shareable Links**: Unique URLs for each outage with dynamic OG images

### 📱 Social Sharing & SEO

- **Dynamic OG Images**: Custom-generated social media previews for each page
- **SSR Support**: Server-side rendering for optimal SEO and performance
- **Meta Tags**: Comprehensive SEO meta tags for search engines
- **Twitter Cards**: Optimized Twitter sharing experience

## 🚀 Tech Stack

### Core Framework

- **Nuxt 3** - Vue.js framework with SSR/SSG support
- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe development

### UI & Styling

- **Tailwind CSS v4** - Utility-first CSS framework
- **@nuxt/icon** - Icon management system
- **ApexCharts** - Interactive data visualization
- **Vue3-ApexCharts** - Vue integration for ApexCharts

### Utilities & Libraries

- **@vueuse/nuxt** - Collection of Vue composition utilities
- **date-fns** - Modern JavaScript date utility library
- **@chenfengyuan/vue-countdown** - Vue countdown component

### Performance & SEO

- **nuxt-og-image** - Dynamic Open Graph image generation
- **ISR (Incremental Static Regeneration)** - Hybrid caching strategy
- **Netlify Deployment** - Optimized for edge deployment

## 🛠️ Development

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm/yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/MrSunshyne/mauritius-power-outages.git
cd mauritius-power-outages

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Available Scripts

```bash
# Development
pnpm dev          # Start development server
pnpm dev --port 3001  # Start on specific port

# Production
pnpm build        # Build for production
pnpm generate     # Generate static site
pnpm preview      # Preview production build

# Maintenance
pnpm postinstall  # Run after dependency installation
```

## 📊 Data Source

This application uses power outage data from [MrSunshyne/mauritius-dataset-electricity](https://github.com/MrSunshyne/mauritius-dataset-electricity), providing comprehensive and up-to-date information about scheduled power outages across Mauritius.

## 🎨 Design Features

- **Dark Theme**: Modern dark UI optimized for readability
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Interactive Elements**: Hover effects, smooth transitions, and loading states
- **Accessibility**: Semantic HTML, proper contrast ratios, and keyboard navigation
- **Performance**: Optimized images, lazy loading, and efficient caching

## 🌐 Deployment

The application is optimized for deployment on Netlify with:

- **Edge Functions**: Server-side rendering for dynamic content
- **ISR Caching**: 15-minute cache for outage pages, 1-hour cache for static pages
- **Automatic Builds**: Continuous deployment from GitHub
- **CDN Distribution**: Global content delivery for optimal performance

**Live Site**: [https://power-outages-mauritius.netlify.app](https://power-outages-mauritius.netlify.app)

## 📈 Performance

- **SSR/ISR Hybrid**: Optimal loading times with intelligent caching
- **Image Optimization**: Dynamic OG images generated on-demand
- **Bundle Optimization**: Tree-shaking and code splitting
- **SEO Optimized**: Perfect Lighthouse scores for search engines

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Candle Animation**: Inspired by [Codepen](https://codepen.io/comehope/details/LBPvON)
- **Background Gradients**: From [UIGradients](https://uigradients.com/)
- **Data Source**: [Mauritius Electricity Dataset](https://github.com/MrSunshyne/mauritius-dataset-electricity)
- **Community**: Nuxt and Vue.js communities for excellent tooling

---

**Stay powered up! ⚡** - Helping Mauritius residents stay informed about power outages.
