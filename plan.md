# Permalink Feature Plan

## Overview
Implement permalinks for individual power outages so users can share direct links to specific outages. When someone clicks on an outage, the URL should change to include the outage ID. This should work even after page refresh.

## Goals

1. Clickable outages - Select an outage and update URL with its ID
2. Shareable permalinks - Links like `/outage/{id}` that always work
3. Smart navigation - Navigate to correct day when URL has outage ID
4. Persistent selection - Outage remains selected after page refresh
5. Historical data handling - Support permalinks for outages in historical data

## Current Behavior

- Users can navigate between days (today, tomorrow, historical dates)
- Each outage is displayed in a Cell component
- No way to link directly to a specific outage
- No way to highlight or select a specific outage
- URL only shows current day being viewed

## Proposed Behavior

### URL Patterns

**Option A**: Query parameter `/?outage={id}`
- Example: `/?outage=570db6bd7c4972eb4116252b8fa51e3e`
- Pros: Simple, keeps day navigation intact
- Cons: URL looks less clean

**Option B**: Route parameter `/outage/{id}` with redirect
- Example: `/outage/570db6bd7c4972eb4116252b8fa51e3e`
- Pros: Clean URLs, SEO friendly
- Cons: Need redirect page

**Option C**: Query parameter `/?outage={id}` with auto-navigation
- Example: `/?date=2024-12-27&outage=570db6bd7c4972eb4116252b8fa51e3e`
- Pros: Explicit control, shows full context
- Cons: More complex URL

**Recommendation**: Option A with enhancements - Use `/?outage={id}` with automatic day detection and navigation

## Implementation Plan

### Phase 1: URL State Management

#### 1.1 Add Route Watcher to index.vue
- Watch for `route.query.outage` parameter
- Parse outage ID from URL on page load
- Navigate to correct day when URL has outage ID

#### 1.2 Update `selectedDate` based on outage
- When outage ID is in URL:
  - Find the outage in `cFlat` by matching `id`
  - Get the `from` date from that outage
  - Set `selectedDate` to match that outage's date
  - Clear `route.query.outage` after navigation

#### 1.3 Clear outage selection on day change
- When user clicks Prev, Next, or Today buttons
- Remove `outage` query parameter from URL
- This ensures new navigation starts fresh

### Phase 2: Cell Component Enhancement

#### 2.1 Make Outage Clickable
- Add click handler to Cell.vue
- On click, navigate to current URL + `?outage={id}`
- This creates a shareable link

#### 2.2 Highlight Selected Outage
- Add prop or computed state to show if this outage is selected
- Add visual indicator (border highlight, icon, etc.)
- Scroll to the selected outage on load

#### 2.3 Accessibility
- Add `aria-selected` attribute to selected outage
- Ensure keyboard navigation works
- Add screen reader announcement for selection

### Phase 3: Data Validation & Error Handling

#### 3.1 Validate Outage ID
- Check if outage ID exists in current data
- If not found:
  - Show user-friendly error message
  - Option to navigate to today
  - Redirect to home page after delay

#### 3.2 Handle Historical Data
- When outage ID is for a historical date:
  - Fetch full data if not already loaded
  - Navigate to that date
  - Highlight the specific outage

#### 3.3 Handle Data Updates
- When data changes (e.g., new API fetch):
  - Keep selected outage if it still exists
  - Or show friendly message if outage no longer exists

### Phase 4: Dedicated Permalink Pages ✅ COMPLETED

#### 4.1 Created `/outage/[id].vue`
- New page that accepts outage ID as route parameter
- On load:
  - Fetch data (latest + historical if needed)
  - Find and display the specific outage prominently
  - Also show current/latest outage information
  - Clean URL: `/outage/abc123` instead of `/?outage=abc123`

#### 4.2 Page Structure
- **Hero section**: Highlight the specific shared outage
- **Current section**: Show only today's latest outages (tomorrow removed for cleaner focus)
- **Navigation**: Links to view all outages
- **SEO**: Custom meta tags for the specific outage

#### 4.3 Benefits
- Clean shareable URLs (`/outage/abc123`)
- Dedicated page shows both specific + current information
- Better SEO with custom meta tags
- Works for future visitors (old links still show current data)
- Can be bookmarked and shared easily

#### 4.4 Update Share Button
- Modify Cell.vue share button to copy clean URL: `/outage/{id}`
- Users share clean URLs instead of query parameters

#### 4.5 Deployment Fix - Temporarily SPA Mode
- **SSR causing 500 errors** on Netlify deploy preview
- **Temporarily disabled SSR** to get deployment working
- **Root cause**: Likely client component hydration issues in SSR environment
- **Next steps**: Debug SSR issues separately, re-enable once fixed
- **Current state**: SPA mode working locally and on Netlify

### Phase 5: UX Enhancements

#### 5.1 Share Button
- Add share button to Cell component when outage is selected
- Copy permalink to clipboard
- Show "Link copied!" feedback

#### 5.2 Deep Link Support
- When someone visits a permalink:
  - If it's for today/tomorrow's data: show normally
  - If it's for old data: show warning "This information may be outdated"
  - Option to "View latest data"

## File Changes

### New Files
- `pages/outage/[id].vue` ✅ (Phase 4)

### Modified Files
- `pages/index.vue` - Add route watching, outage selection logic
- `components/Cell.vue` - Make clickable, add selection highlighting
- `assets/css/main.css` - Add styles for selected state

## Data Flow

```
User clicks outage → Update URL (?outage={id})
                   ↓
Page refresh → Read ?outage={id} from URL
                   ↓
Find outage in data → Determine its date
                   ↓
Navigate to that date → Highlight the outage
                   ↓
User copies URL → Friend opens link → Same outage selected
                   ↓
User clicks "Today" → Clear outage ID → Navigate to today
```

## Edge Cases

1. **Outage no longer exists**: Data was updated and this outage was removed
   - Solution: Show toast message, redirect to today

2. **Multiple outages with same ID**: Shouldn't happen (IDs are unique)
   - Solution: First match wins, log warning

3. **Invalid outage ID**: User manually edited URL
   - Solution: Show error page, suggest valid outage IDs

4. **Historical data not loaded**: Permalink to old outage
   - Solution: Auto-fetch full data, navigate to that date

5. **Mobile navigation**: Ensure selection works with mobile nav
   - Solution: Update mobile nav to preserve selection

## Open Questions

1. Should we use query param or route param for the ID?
   - Query param keeps day navigation cleaner

2. Should we scroll to the selected outage on load?
   - Yes, for better UX

3. Should we show a "permalink copied" toast?
   - Yes, helpful for users sharing

4. Should permalinks work with SSR enabled?
   - Yes, if we enable SSR in the future

5. Should historical data be lazy-loaded or pre-loaded?
   - Currently lazy-loaded, keep this for performance

## Implementation Priority

1. **High Priority** (Must have):
   - URL state management (route watcher)
   - Make cells clickable with navigation
   - Highlight selected outage
   - Handle refresh/restore from URL

2. **Medium Priority** (Should have):
   - Error handling for invalid IDs
   - Share button to clipboard
   - Scroll to selected outage
   - Mobile nav support

3. **Low Priority** (Nice to have):
   - Dedicated `/outage/[id]` route
   - SEO metadata for permalinks
   - Toast notifications
   - Deep link warning banner

## Success Criteria

- [x] Clicking an outage updates URL with its ID
- [x] Refreshing page with `?outage={id}` selects that outage
- [x] Navigating to another day clears the outage selection
- [x] Selected outage is visually highlighted (ring border)
- [x] Page scrolls to selected outage on load
- [x] Works with today, tomorrow, and historical data
- [x] Invalid outage IDs are handled gracefully (cleared from URL)
- [ ] Mobile navigation preserves selection (not tested yet)

## Implementation Summary

**Phase 1 & 2: URL State Management & Cell Enhancement - COMPLETED**

**Phase 4: Dedicated Permalink Pages - COMPLETED**

### Features Implemented:

1. **Single Unified System**
   - **One approach only**: Clicking outages → redirects to `/outage/{id}`
   - **No query parameters** on main page for selection
   - **Clean URLs** throughout the application

2. **Dedicated Outage Pages** (`/outage/[id].vue`)
   - Shows specific outage details prominently
   - Displays current/latest outage information below
   - Custom SEO meta tags for each outage
   - Error handling for invalid outage IDs

3. **Simplified User Experience**
   - Click outage → go directly to detailed page
   - Dedicated pages show both specific + current data
   - No confusion between selection and sharing

4. **Benefits Achieved**
   - ✅ Clean, bookmarkable URLs (`/outage/abc123`)
   - ✅ Better SEO with dedicated pages
   - ✅ Shows specific outage + current information
   - ✅ Works for future visitors (old links still useful)
   - ✅ Simplified codebase (one system instead of two)

5. **Final Data Flow**
   ```
   User clicks outage → Redirects to /outage/{id}
                   ↓
   Dedicated page loads → Shows specific outage details
                   ↓
   Also displays current outages → Complete information
                   ↓
   Clean URL for sharing/bookmarking
   ```
   User clicks outage → URL updates (?outage={id})
                   ↓
   Page refresh → Reads ?outage={id} from URL
                   ↓
   Finds outage in data → Navigates to correct day
                   ↓
   Highlights selected outage → Shows share button
                   ↓
   Navigation clears selection → URL cleaned
   ```

### Files Modified:
- `pages/index.vue` - Added URL state management, route watching, outage selection logic
- `components/Cell.vue` - Made clickable, added selection highlighting and share button
- `components/CellGroup.vue` - Pass selectedOutageId prop to cells

### Technical Details:
- Uses Option A: Query parameter `/?outage={id}` for clean URLs
- Automatic day detection and navigation based on outage date
- URL cleanup when navigating between days
- Client-side data fetching ensures permalinks work after page refresh
- Visual feedback with ring border and share button
- Clipboard API for easy permalink sharing

### Future Enhancements (Phase 3+):
- Error handling for invalid outage IDs
- Toast notifications for share success/failure
- Mobile navigation testing
- Dedicated `/outage/[id]` route option
- SEO metadata for permalinks
