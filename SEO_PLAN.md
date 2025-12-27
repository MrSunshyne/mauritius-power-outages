# SEO Implementation Plan - Power Outages Mauritius

> **Website URL:** https://power-outages-mauritius.netlify.app  
> **Brand Name:** Power Outages Mauritius  
> **Target Audience:** Residents of Mauritius seeking power outage information  
> **Last Updated:** December 2024

---

## Table of Contents

1. [Global SEO Configuration](#1-global-seo-configuration)
2. [Homepage (/)](#2-homepage-)
3. [Statistics Page (/statistics)](#3-statistics-page-statistics)
4. [Dynamic Outage Page (/outage/[id])](#4-dynamic-outage-page-outageid)
5. [OG Image Specifications](#5-og-image-specifications)
6. [Technical Implementation](#6-technical-implementation)
7. [Future Enhancements](#7-future-enhancements)

---

## 1. Global SEO Configuration

### Target Keywords (Primary)
- power outage mauritius
- ceb power cut
- electricity outage mauritius
- load shedding mauritius
- power cut schedule mauritius

### Target Keywords (Secondary)
- mauritius electricity
- ceb outage schedule
- power failure mauritius
- blackout mauritius
- when will power come back mauritius

### Brand Information
| Attribute | Value |
|-----------|-------|
| Site Name | Power Outages Mauritius |
| Default OG Image | 1200x630px (1.91:1 ratio) |
| Theme Color | #020024 (dark blue/black) |
| Language | English |
| Locale | en_MU |

---

## 2. Homepage (/)

### Page Description
The homepage displays current and upcoming power outages in Mauritius, showing today's and tomorrow's scheduled outages.

### SEO Specifications

| Tag | Value | Characters |
|-----|-------|------------|
| **og:title** | `Power Outages in Mauritius - Live Schedule & Updates` | 52 |
| **og:description** | `Check today's and tomorrow's scheduled power cuts in Mauritius. Real-time CEB outage information with countdown timers and affected areas.` | 138 |
| **og:url** | `https://power-outages-mauritius.netlify.app/` | - |
| **og:type** | `website` | - |
| **og:image** | `https://power-outages-mauritius.netlify.app/og/home.png` | - |
| **og:image:alt** | `Power Outages Mauritius - Live schedule showing today's power cuts` | - |
| **twitter:card** | `summary_large_image` | - |

### Technical Implementation

```html
<!-- Homepage Meta Tags -->
<title>Power Outages in Mauritius - Live Schedule & Updates</title>
<meta name="description" content="Check today's and tomorrow's scheduled power cuts in Mauritius. Real-time CEB outage information with countdown timers and affected areas.">

<!-- Open Graph -->
<meta property="og:title" content="Power Outages in Mauritius - Live Schedule & Updates">
<meta property="og:description" content="Check today's and tomorrow's scheduled power cuts in Mauritius. Real-time CEB outage information with countdown timers and affected areas.">
<meta property="og:url" content="https://power-outages-mauritius.netlify.app/">
<meta property="og:type" content="website">
<meta property="og:image" content="https://power-outages-mauritius.netlify.app/og/home.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Power Outages Mauritius - Live schedule showing today's power cuts">
<meta property="og:site_name" content="Power Outages Mauritius">
<meta property="og:locale" content="en_MU">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Power Outages in Mauritius - Live Schedule & Updates">
<meta name="twitter:description" content="Check today's and tomorrow's scheduled power cuts in Mauritius. Real-time CEB outage information with countdown timers and affected areas.">
<meta name="twitter:image" content="https://power-outages-mauritius.netlify.app/og/home.png">
<meta name="twitter:image:alt" content="Power Outages Mauritius - Live schedule showing today's power cuts">

<!-- Additional SEO -->
<link rel="canonical" href="https://power-outages-mauritius.netlify.app/">
<meta name="robots" content="index, follow">
```

### Rationale

**Title Choice:** "Power Outages in Mauritius - Live Schedule & Updates"
- Includes primary keyword "Power Outages" at the start for SEO weight
- "Live" creates urgency and indicates real-time data
- "Schedule & Updates" communicates the value proposition
- Under 60 characters (52) for full display in SERPs

**Description Choice:**
- Opens with action verb "Check" for engagement
- Mentions "today's and tomorrow's" to indicate freshness
- "CEB" included for brand recognition (Central Electricity Board)
- "countdown timers and affected areas" highlights unique features
- 138 characters - within optimal range

### Visual Advice for og:image

**Recommended Design:**
- Dark gradient background (#020024 to #03012b) matching site theme
- Large lightning bolt or power icon
- Text: "Power Outages Mauritius" (bold, white)
- Subtext: "Live Schedule Updates"
- Optional: Small preview of outage cards
- Dimensions: 1200x630px

---

## 3. Statistics Page (/statistics)

### Page Description
Analytics and visualizations showing historical power outage data, including trends by district, day of week, time of day, and monthly patterns.

### SEO Specifications

| Tag | Value | Characters |
|-----|-------|------------|
| **og:title** | `Power Outage Statistics Mauritius - Trends & Analysis` | 54 |
| **og:description** | `Explore power outage patterns in Mauritius. View statistics by district, day, hour, and month. Data-driven insights on CEB electricity cuts.` | 142 |
| **og:url** | `https://power-outages-mauritius.netlify.app/statistics` | - |
| **og:type** | `website` | - |
| **og:image** | `https://power-outages-mauritius.netlify.app/og/statistics.png` | - |
| **og:image:alt** | `Charts showing power outage statistics and trends in Mauritius` | - |
| **twitter:card** | `summary_large_image` | - |

### Technical Implementation

```html
<!-- Statistics Page Meta Tags -->
<title>Power Outage Statistics Mauritius - Trends & Analysis</title>
<meta name="description" content="Explore power outage patterns in Mauritius. View statistics by district, day, hour, and month. Data-driven insights on CEB electricity cuts.">

<!-- Open Graph -->
<meta property="og:title" content="Power Outage Statistics Mauritius - Trends & Analysis">
<meta property="og:description" content="Explore power outage patterns in Mauritius. View statistics by district, day, hour, and month. Data-driven insights on CEB electricity cuts.">
<meta property="og:url" content="https://power-outages-mauritius.netlify.app/statistics">
<meta property="og:type" content="website">
<meta property="og:image" content="https://power-outages-mauritius.netlify.app/og/statistics.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Charts showing power outage statistics and trends in Mauritius">
<meta property="og:site_name" content="Power Outages Mauritius">
<meta property="og:locale" content="en_MU">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Power Outage Statistics Mauritius - Trends & Analysis">
<meta name="twitter:description" content="Explore power outage patterns in Mauritius. View statistics by district, day, hour, and month. Data-driven insights on CEB electricity cuts.">
<meta name="twitter:image" content="https://power-outages-mauritius.netlify.app/og/statistics.png">
<meta name="twitter:image:alt" content="Charts showing power outage statistics and trends in Mauritius">

<!-- Additional SEO -->
<link rel="canonical" href="https://power-outages-mauritius.netlify.app/statistics">
<meta name="robots" content="index, follow">
```

### Rationale

**Title Choice:** "Power Outage Statistics Mauritius - Trends & Analysis"
- "Statistics" clearly communicates page purpose
- "Trends & Analysis" appeals to data-curious users
- Geographic qualifier "Mauritius" for local SEO
- 54 characters - within limit

**Description Choice:**
- "Explore" invites interaction
- Lists specific data views (district, day, hour, month)
- "Data-driven insights" positions as authoritative source
- 142 characters - optimal length

### Visual Advice for og:image

**Recommended Design:**
- Dark background with gradient
- Stylized chart icons (bar chart, pie chart, line graph)
- Text: "Power Outage Statistics"
- Subtext: "Mauritius Trends & Patterns"
- Optional: Sample chart visualization
- Dimensions: 1200x630px

---

## 4. Dynamic Outage Page (/outage/[id])

### Page Description
Individual outage detail page showing specific power cut information including location, time, affected streets, and district. These pages are shareable to inform others about specific outages.

### SEO Specifications (Dynamic)

| Tag | Template | Example |
|-----|----------|---------|
| **og:title** | `Power Outage: {locality} - {date} {time}` | `Power Outage: Curepipe - Dec 27, 2024 09:00 - 15:00` |
| **og:description** | `Power outage scheduled for {locality} ({streets}) on {full_date} from {time}. Check current power outage information for Mauritius.` | (dynamic) |
| **og:url** | `https://power-outages-mauritius.netlify.app/outage/{id}` | - |
| **og:type** | `article` | - |
| **og:image** | `https://power-outages-mauritius.netlify.app/og/outage.png` (generic) | - |
| **og:image:alt** | `Power outage details for {locality}, Mauritius` | - |
| **twitter:card** | `summary_large_image` | - |

### Technical Implementation (Current - Already Implemented)

The dynamic outage page already has SSR-compatible SEO using `useSeoMeta()`. The current implementation is good but can be enhanced:

```typescript
// Enhanced SEO implementation for /outage/[id].vue
useSeoMeta({
  title: () => title.value,
  description: () => description.value,
  ogTitle: () => title.value,
  ogDescription: () => description.value,
  ogType: 'article',  // Changed from 'website' to 'article' for specific content
  ogUrl: `https://power-outages-mauritius.netlify.app/outage/${outageId}`,
  ogImage: 'https://power-outages-mauritius.netlify.app/og/outage.png',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: () => selectedOutage.value 
    ? `Power outage details for ${selectedOutage.value.locality}, Mauritius`
    : 'Power outage details for Mauritius',
  ogSiteName: 'Power Outages Mauritius',
  ogLocale: 'en_MU',
  twitterCard: 'summary_large_image',
  twitterTitle: () => title.value,
  twitterDescription: () => description.value,
  twitterImage: 'https://power-outages-mauritius.netlify.app/og/outage.png',
  twitterImageAlt: () => selectedOutage.value 
    ? `Power outage details for ${selectedOutage.value.locality}, Mauritius`
    : 'Power outage details for Mauritius',
})
```

### Rationale

**Dynamic Title Pattern:** `Power Outage: {locality} - {date} {time}`
- Clear, scannable format
- Location-first for relevance when sharing
- Date and time provide immediate context
- Under 60 characters in most cases

**Dynamic Description Pattern:**
- Includes all key details (location, streets, date, time)
- Call-to-action embedded ("Check current...")
- Optimized for sharing on social media
- 100-160 characters dynamically

### Visual Advice for og:image

**Generic Design (Current Phase):**
- Dark background matching site theme
- Large location pin or power icon
- Text: "Power Outage Details"
- Subtext: "Mauritius - View Schedule"
- Information styling (orange/yellow accents)
- Dimensions: 1200x630px

**Future Dynamic Design:**
- Auto-generated with outage details
- Show locality name prominently
- Display date and time
- District badge
- Countdown if upcoming

---

## 5. OG Image Specifications

### General Requirements

| Specification | Value |
|---------------|-------|
| **Aspect Ratio** | 1.91:1 |
| **Dimensions** | 1200 x 630 pixels |
| **Format** | PNG or JPG |
| **Max File Size** | < 1MB recommended |
| **Safe Zone** | Keep text within center 80% |

### Image Variants Needed

| Page | Filename | Priority |
|------|----------|----------|
| Homepage | `/public/og/home.png` | High |
| Statistics | `/public/og/statistics.png` | High |
| Outage (generic) | `/public/og/outage.png` | High |
| Fallback | `/public/og/default.png` | Medium |

### Design Guidelines

**Color Palette:**
- Primary Background: `#020024` (dark blue-black)
- Gradient End: `#03012b`
- Accent: `#f97316` (orange - for information)
- Text: `#ffffff` (white)
- Secondary Text: `rgba(255, 255, 255, 0.7)`

**Typography:**
- Headlines: Bold, sans-serif (system font stack)
- Body: Regular weight
- Minimum font size: 24px for readability

**Brand Elements:**
- Site logo in corner (optional)
- Consistent dark theme
- Lightning/power iconography

---

## 6. Technical Implementation

### nuxt.config.ts Updates

```typescript
// Enhanced global meta configuration
app: {
  head: {
    htmlAttrs: {
      lang: 'en',
    },
    charset: 'utf-8',
    viewport: 'width=device-width, initial-scale=1',
    link: [
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      { rel: 'canonical', href: 'https://power-outages-mauritius.netlify.app' },
    ],
    meta: [
      // Basic
      { name: 'msapplication-TileColor', content: '#020024' },
      { name: 'theme-color', content: '#020024' },
      { name: 'robots', content: 'index, follow' },
      { name: 'author', content: 'Power Outages Mauritius' },
      
      // Default OG (overridden by pages)
      { property: 'og:site_name', content: 'Power Outages Mauritius' },
      { property: 'og:type', content: 'website' },
      { property: 'og:locale', content: 'en_MU' },
      { property: 'og:image', content: 'https://power-outages-mauritius.netlify.app/og/default.png' },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: 'Power Outages Mauritius - Live power cut schedules' },
      
      // Twitter defaults
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@PowerOutagesMU' }, // If applicable
    ],
  },
},
```

### Homepage (pages/index.vue)

```typescript
// Replace current useHead with useSeoMeta
useSeoMeta({
  title: 'Power Outages in Mauritius - Live Schedule & Updates',
  description: 'Check today\'s and tomorrow\'s scheduled power cuts in Mauritius. Real-time CEB outage information with countdown timers and affected areas.',
  ogTitle: 'Power Outages in Mauritius - Live Schedule & Updates',
  ogDescription: 'Check today\'s and tomorrow\'s scheduled power cuts in Mauritius. Real-time CEB outage information with countdown timers and affected areas.',
  ogUrl: 'https://power-outages-mauritius.netlify.app/',
  ogImage: 'https://power-outages-mauritius.netlify.app/og/home.png',
  ogImageAlt: 'Power Outages Mauritius - Live schedule showing today\'s power cuts',
  twitterCard: 'summary_large_image',
})
```

### Statistics Page (pages/statistics.vue)

```typescript
// Replace current useHead with useSeoMeta
useSeoMeta({
  title: 'Power Outage Statistics Mauritius - Trends & Analysis',
  description: 'Explore power outage patterns in Mauritius. View statistics by district, day, hour, and month. Data-driven insights on CEB electricity cuts.',
  ogTitle: 'Power Outage Statistics Mauritius - Trends & Analysis',
  ogDescription: 'Explore power outage patterns in Mauritius. View statistics by district, day, hour, and month. Data-driven insights on CEB electricity cuts.',
  ogUrl: 'https://power-outages-mauritius.netlify.app/statistics',
  ogImage: 'https://power-outages-mauritius.netlify.app/og/statistics.png',
  ogImageAlt: 'Charts showing power outage statistics and trends in Mauritius',
  twitterCard: 'summary_large_image',
})
```

### Dynamic Outage Page (pages/outage/[id].vue)

Already implemented with `useSeoMeta()`. Enhance with:

```typescript
// Add these additional properties to existing useSeoMeta
ogImageWidth: 1200,
ogImageHeight: 630,
ogSiteName: 'Power Outages Mauritius',
ogLocale: 'en_MU',
```

---

## 7. Future Enhancements

### Phase 2: Dynamic OG Images

Generate dynamic OG images for outage pages using:
- **Satori** + **@resvg/resvg-js** for edge-generated images
- **Nuxt OG Image module** for simplified implementation

Example dynamic image content:
```
+------------------------------------------+
|  [Lightning Icon]                        |
|                                          |
|  SCHEDULED POWER OUTAGE                  |
|  ──────────────────────                  |
|  Curepipe                                |
|  Friday, December 27, 2024               |
|  09:00 - 15:00                           |
|                                          |
|  District: Plaines Wilhems              |
|                                          |
|  [Power Outages Mauritius logo]          |
+------------------------------------------+
```

### Phase 3: Structured Data (JSON-LD)

Add structured data for rich search results:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Power Outages Mauritius",
  "description": "Real-time power outage information for Mauritius",
  "url": "https://power-outages-mauritius.netlify.app",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "MUR"
  }
}
</script>
```

### Phase 4: Additional Pages to Consider

1. **About Page** (`/about`)
   - Explain data sources
   - Mission statement
   
2. **Districts Page** (`/districts`)
   - SEO value for district-specific searches
   - "Power outage Port Louis" etc.

3. **FAQ Page** (`/faq`)
   - Target question-based searches
   - "When will power come back in Mauritius"

---

## Implementation Checklist

- [ ] Update `nuxt.config.ts` with enhanced global meta
- [ ] Update `pages/index.vue` with `useSeoMeta()`
- [ ] Update `pages/statistics.vue` with `useSeoMeta()`
- [ ] Enhance `pages/outage/[id].vue` with additional OG properties
- [ ] Create `/public/og/` directory
- [ ] Design and add `home.png` (1200x630)
- [ ] Design and add `statistics.png` (1200x630)
- [ ] Design and add `outage.png` (1200x630)
- [ ] Design and add `default.png` (1200x630)
- [ ] Test with Facebook Sharing Debugger
- [ ] Test with Twitter Card Validator
- [ ] Test with LinkedIn Post Inspector
- [ ] Verify in Google Search Console

---

## Testing Tools

| Tool | URL | Purpose |
|------|-----|---------|
| Facebook Debugger | https://developers.facebook.com/tools/debug/ | Validate OG tags |
| Twitter Validator | https://cards-dev.twitter.com/validator | Validate Twitter cards |
| LinkedIn Inspector | https://www.linkedin.com/post-inspector/ | Validate LinkedIn sharing |
| OpenGraph.xyz | https://www.opengraph.xyz/ | Preview all platforms |
| Google Rich Results | https://search.google.com/test/rich-results | Test structured data |

---

*This SEO plan follows 2025 best practices and is optimized for maximum click-through rates on social media platforms and search engines.*
