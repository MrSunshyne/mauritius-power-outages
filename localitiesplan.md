# Localities View Implementation Plan

## Overview
Add a localities feature that allows users to view all outages for a specific locality. Each outage on the outage detail page will have a link/button that navigates to a locality page showing all historical outages for that area.

## Data Structure

### Available Data Source
```
data/
  localities/
    index.json              # List of all localities with metadata
    flic-en-flac.json       # All outages for specific locality
    chamarel.json
    riambel.json
    ...
```

### Locality JSON Structure
```json
{
  "locality": "Flic-en-Flac",
  "slug": "flic-en-flac",
  "district": "blackriver",
  "outageCount": 15,
  "outages": [
    {
      "id": "abc123",
      "date": "2025-12-28",
      "from": "2025-12-28T07:30:00.000Z",
      "to": "2025-12-28T11:45:00.000Z",
      "streets": "Royal Road, Coastal Road"
    }
  ]
}
```

---

## Implementation Steps

### Step 1: Update API Configuration (`utils/api.ts`)
**Goal**: Add locality endpoint

**Changes**:
```typescript
export const API_URLS = {
  full: `${API_BASE}power-outages.json`,
  latest: `${API_BASE}power-outages.latest.json`,
  daily: (date: string) => `${API_BASE}daily/${date}.json`,
  localitiesIndex: `${API_BASE}localities/index.json`,
  locality: (slug: string) => `${API_BASE}localities/${slug}.json`,
}
```

---

### Step 2: Create Locality Page (`pages/locality/[slug].vue`)
**Goal**: Display all outages for a specific locality

**Key Features**:
- Accept `[slug]` route param from URL
- Fetch locality JSON from `localities/{slug}.json`
- Display locality name and district
- Show all historical outages sorted by date (newest first)
- Add prev/next navigation between localities (alphabetical)
- Link back to homepage
- Handle 404 for invalid locality slugs

**Data Fetching Logic**:
```typescript
const route = useRoute()
const slug = route.params.slug as string

const { data: locality, status } = await useFetch(API_URLS.locality(slug))

if (status.value === 'error' || !locality.value) {
  throw createError({ statusCode: 404, statusMessage: 'Locality not found' })
}
```

**Page Structure**:
```vue
<template>
  <div>
    <header>
      <h1>{{ locality.locality }}</h1>
      <p>District: {{ locality.district }}</p>
      <p>Total outages: {{ locality.outageCount }}</p>
    </header>
    
    <CellGroup :data="locality.outages" />
    
    <nav>
      <NuxtLink to="/">Back to Today</NuxtLink>
    </nav>
  </div>
</template>
```

**SEO**:
- Title: "Power Outages in [Locality] - Mauritius"
- Description: "View all scheduled power outages in [Locality], [District] district"

---

### Step 3: Add Locality Links to Outage Pages
**Goal**: Add clickable locality reference on individual outage pages

### Add to Individual Outage Page (`pages/outage/[id].vue`)
Modify the existing outage detail page to include a locality link:

```vue
<template>
  <div class="outage-detail">
    <!-- Existing outage info -->
    
    <div class="locality-link">
      <Icon name="solar:map-marker" />
      <NuxtLink :to="`/locality/${outage.localitySlug}`">
        View all outages in {{ outage.locality }}
      </NuxtLink>
    </div>
  </div>
</template>
```
---

### Step 4: Update Navigation Components (Optional)
Add quick locality search or list on the site to help users find localities:

```vue
<!-- In SiteHeader or navigation -->
<template>
  <nav class="localities-nav">
    <NuxtLink to="/localities">Browse by Locality</NuxtLink>
  </nav>
</template>
```

---

### Step 5: Create Localities Index Page (`pages/localities/index.vue`)
**Goal**: List all available localities

**Features**:
- Fetch `localities/index.json`
- Display grid/list of all localities
- Show outage count per locality
- Links to each locality page

**URL**: `/localities`

---

## Route Rules

Add caching for locality routes in `nuxt.config.ts`:

```typescript
routeRules: {
  '/': { isr: 3600 },
  '/statistics': { isr: 3600 },
  '/outage/**': { isr: 900 },
  '/day/**': { isr: 86400 },
  '/locality/**': { isr: 86400 }, // 24 hours - locality pages
  '/localities': { isr: 3600 },   // 1 hour - index page
}
```

```

---

## Error Handling

1. **Invalid Locality Slug**:
   - Show 404 page with friendly message
   - "Locality not found. It may have been removed or renamed."

2. **Locality Without Outages**:
   - Show message: "No historical outages recorded for this locality"

3. **Network Error**:
   - Retry once
   - Show error state if fails

---

## Testing Checklist

### Navigation Flow
- [ ] Outage page has locality link
- [ ] Clicking locality link goes to `/locality/{slug}`
- [ ] Locality page shows correct locality name
- [ ] Locality page lists all outages
- [ ] Back navigation works

### Data Display
- [ ] Outages sorted by date (newest first)
- [ ] District displayed correctly
- [ ] Outage count accurate
- [ ] Streets and times displayed

### Edge Cases
- [ ] Invalid slug shows 404
- [ ] Locality with no outages shows empty state
- [ ] Network errors handled gracefully

### Mobile
- [ ] Locality links tappable on mobile
- [ ] Locality page responsive
- [ ] Navigation works on small screens

---

## Performance Considerations

### Benefits
- Smaller payload than full history
- Specific to one locality
- Good caching (24 hours)

### Preloading (Optional)
Add link prefetching for better UX:
```vue
<NuxtLink :to="`/locality/${slug}`" prefetch>
```

---

## Dependencies

### No New Dependencies
All features use existing:
- `date-fns` for date formatting
- Nuxt navigation (`navigateTo`, `NuxtLink`)
- Existing Icon component

---

## File Changes Summary

### New Files
- `pages/locality/[slug].vue` - Locality detail page
- `pages/localities/index.vue` - Localities index page (optional)

### Modified Files
- `utils/api.ts` - Add locality endpoints
- `pages/outage/[id].vue` - Add locality link
- `components/Cell.vue` - Add optional locality link
- `nuxt.config.ts` - Add route rules

---

## Future Enhancements (Out of Scope)

1. **Locality Search**: Search bar to quickly find localities
2. **District Filtering**: Filter localities by district
3. **Locality Map**: Visual map showing outage-prone areas
4. **Statistics**: Charts showing outage frequency per locality
5. **RSS Feed**: Subscribe to specific locality outages
6. **Compare Localities**: Compare outage patterns between areas

---

## Summary

This feature adds locality-centric navigation to help users:
- Find all outages in their area
- Navigate from an outage to see historical patterns
- Browse outages by location instead of by date

**Key Pages**:
- `/locality/{slug}` - All outages for a specific locality
- `/localities` - Index of all localities (optional)

**Key Benefits**:
- Better user experience for location-based browsing
- Shareable URLs for specific areas
- Reduced friction in finding relevant outages
