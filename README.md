# Atomity Frontend Challenge — Option A
## Cluster → Namespace → Pod Drill-Down Dashboard

## Approach

My approach was to build a production-grade infrastructure observability dashboard
from scratch — no component libraries, just React, Framer Motion, and a centralized
CSS variable design token system.

### 1. Design Token System
Instead of hardcoding values everywhere, I created a single source of truth in
`src/tokens/design-system.js`. Every color, spacing, radius, and font size is
defined as a CSS variable and mirrored in a JS `tokens` object. This means the
entire theme can be changed in one file.

### 2. Data & Caching Strategy
I fetch from JSONPlaceholder's public API and deterministically map the response
to realistic infrastructure metrics using a seeded random function — so the same
post ID always produces the same CPU/memory/cost values.

To avoid redundant network requests, I built a global in-memory cache object
outside React with a 5-minute stale window. Navigating back to a previously
visited cluster or namespace returns data instantly from cache.

### 3. Spatial Morphing Drill-Down
The core interaction uses Framer Motion's `layoutId` — when you click a cluster
card, it doesn't just disappear and get replaced. It physically morphs and expands
to become the header of the namespace view. Same transition happens from namespace
to pod level.

### 4. Scroll-Triggered Animations
The dashboard section uses `useInView` and `useScroll` from Framer Motion to
detect scroll position. As the section enters the viewport, the dashboard card
elevates and reveals itself with staggered child transitions.

### 5. Modern CSS
- **Fluid typography** — all font sizes use `clamp()` so they scale smoothly
- **Container queries** — metric cards shift layout based on their own width
- **Logical properties** — `margin-inline`, `padding-block` used throughout
- **prefers-reduced-motion** — all animations degrade to instant if the user
  has reduced motion enabled in their OS

## Tech Stack
- React 18
- Framer Motion 11
- Vite
- Zero component libraries

## Run Locally
npm install
npm run dev