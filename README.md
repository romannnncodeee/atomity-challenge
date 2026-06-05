# Atomity Frontend Challenge — Option A

## Overview

For this challenge, I chose Option A and built an interactive cluster → namespace → pod drill-down experience inspired by infrastructure observability platforms.
My goal was to focus on animation quality, component architecture, and data handling while keeping the implementation lightweight and maintainable. Rather than recreating the reference video exactly, I used it as inspiration and created my own interpretation of theinteraction.

## Approach

### Design Token System

To keep styling consistent and maintainable, I created a centralized design token system in `src/tokens/design-system.js`.

Colors, spacing, typography, border radii, and animation values are defined once and reused throughout the application via CSS variables and a shared `tokens` object. This avoids hardcoded values across components and makes future theme changes much easier.

### Data Fetching & Caching

The dashboard fetches data from the JSONPlaceholder API and transforms the response into infrastructure-style metrics such as CPU usage, memory usage, pod counts, and estimated costs.

To prevent unnecessary network requests, I implemented a lightweight in-memory caching layer with a 5-minute stale window. Returning to previously viewed clusters or namespaces displays cached data immediately instead of triggering another request.

Loading, success, and error states are handled to ensure the UI remains responsive during data fetching.

### Drill-Down Interaction

The main interaction allows users to navigate from clusters to namespaces and then to individual pods.

I used Framer Motion's `layoutId` feature to create smooth shared-layout transitions between views. Instead of replacing screens abruptly, selected elements transition naturally into the next level, helping maintain context as users move through the hierarchy.

### Scroll-Based Animation

The feature section uses `useInView` and `useScroll` from Framer Motion to trigger animations based on viewport position.

As the section enters view, content is revealed progressively with staggered motion and subtle elevation effects. Animations are designed to support the content rather than distract from it.

### Modern CSS Features

The project incorporates several modern CSS techniques:

* `clamp()` for fluid typography and spacing
* Container queries for component-level responsiveness
* Logical properties such as `margin-inline` and `padding-block`
* CSS custom properties for design tokens
* `prefers-reduced-motion` support for users who disable animations at the operating system level


## Tech Stack

* React 18
* Vite
* Framer Motion 11
* JavaScript
* CSS Variables
* Custom-built components (no UI libraries)

## Tradeoffs & Future Improvements

To keep the project focused within the challenge timeframe, I implemented a simple custom caching solution instead of introducing an additional dependency such as React Query.

* Expand the drill-down hierarchy with additional infrastructure layers
* Improve keyboard navigation and accessibility coverage
* Add more advanced telemetry visualizations and filtering options
## Run Locally

```bash
npm install
npm run dev

