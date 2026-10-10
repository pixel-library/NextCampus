# Landing Page Module Specification

*Last Reviewed: October 2026*

This document provides complete technical and design documentation for the **NextCampus Landing Page** (`/`).

---

## 1. Module Overview

The Landing Page serves as the primary public entry point and brand showcase for the NextCampus platform. It introduces students, faculty, visitors, and administrators to the smart campus ecosystem, presenting high-level campus statistics, key feature gateways, upcoming campus events, and an emergency announcement ticker.

- **Route**: `/`
- **Access Level**: Public (Unauthenticated / Guest, Student, Admin)
- **Primary Goal**: Deliver a visually striking first impression adhering to the approved Google Stitch design language while routing users directly into authenticated portals.

---

## 2. Source Files & Architecture

### Frontend Files
- **Page Component**: [`src/pages/LandingPage.jsx`](file:///run/media/rudra/534a134c-69cb-49e5-9a9c-284e9ad8ee1b/NextCampus/src/pages/LandingPage.jsx)
- **Shared Components**:
  - [`src/components/Navbar.jsx`](file:///run/media/rudra/534a134c-69cb-49e5-9a9c-284e9ad8ee1b/NextCampus/src/components/Navbar.jsx) — Global navigation bar displaying branding, role-aware navigation links, and Auth / Profile buttons.
  - [`src/components/Footer.jsx`](file:///run/media/rudra/534a134c-69cb-49e5-9a9c-284e9ad8ee1b/NextCampus/src/components/Footer.jsx) — Campus copyright, emergency contacts, and links.
- **Styling**: `src/index.css` (tokens: Licorice `#191516`, Raisin Black `#382E31`, Amaranth Purple `#AC274F`, Blush `#EB638B`, Misty Rose `#FFD9DA`).

### Backend Endpoints
- `GET /api/v1/health` (or `GET /api/health`): Server health probe to ensure backend connectivity.
- `GET /api/v1/facilities` (or `GET /api/facilities`): Optional preload for campus statistics counters (buildings count, active labs).

---

## 3. UI Sections & User Workflows

```mermaid
flowchart TD
    A[Visitor arrives at /] --> B[Hero Section]
    B -->|Click 'Explore Campus'| C[Interactive Campus Map /campus-map]
    B -->|Click 'Student Portal'| D[Auth /auth -> Dashboard]
    B --> E[Campus Metric Counters]
    B --> F[Core Feature Highlights]
    F -->|SmartRoom| G[/smartroom]
    F -->|AI Assistant| H[/ai-assistant]
    F -->|EcoCampus| I[/ecocampus]
    F -->|SkillCampus| J[/skillcampus]
    B --> K[Emergency Bulletin & News Ticker]
```

### 3.1 Hero Banner
- Features a dynamic gradient backdrop utilizing the Licorice-to-Raisin Black gradient with subtle Amaranth Purple glow.
- Headline: "The Next Generation of Smart Campuses".
- Primary Call to Action (CTA): "Explore Campus Map" (routes to `/campus-map`).
- Secondary CTA: "Sign In / Portal" (routes to `/auth` or `/dashboard` if already authenticated).

### 3.2 Live Campus Metrics Bar
- Displays prominent campus data counters:
  - **48+** Smart Buildings & Laboratories
  - **12,500+** Active Students & Faculty
  - **98.4%** IoT Sensor Network Uptime
  - **42%** Solar Energy Grid Independence

### 3.3 Feature Discovery Grid
- Interactive cards representing the 6 primary student modules:
  1. **Interactive Campus Map**: GPS navigation, building search, and route plotting.
  2. **SmartRoom**: Indoor room telemetry, HVAC simulation, and occupancy monitoring.
  3. **NextCampus AI**: Natural language campus guidance and real-time intelligence.
  4. **EcoCampus**: Sustainability tracking, solar generation, and recycling leaderboards.
  5. **SkillCampus**: Collaborative project matchmaking and skill networking.
  6. **Complaint & Care Portal**: Rapid facility maintenance reporting with photo attachments.

---

## 4. State Management & Interactions

- **Authentication State**: Uses `useAuth()` hook from `src/context/AuthContext.jsx`. If a user is already signed in, the CTA changes from "Sign In" to "Open Dashboard", dynamically tailoring the experience.
- **Smooth Scroll**: Navigation links smoothly scroll to feature anchors or route transitions.

---

## 5. Responsive Behavior & Accessibility

- **Desktop (>= 1024px)**: Full multi-column grid layout with animated feature cards and prominent typography.
- **Tablet (768px - 1023px)**: 2-column feature card grid, consolidated metric counters.
- **Mobile (< 768px)**: Single-column vertical stack, touch-friendly CTA buttons (minimum 48px tap targets), collapsible navigation drawer in `Navbar.jsx`.
- **Accessibility**: Semantic `<header>`, `<main>`, `<section>`, and `<footer>` elements; high-contrast text conforming to WCAG 2.1 AA standards.

---

## 6. Testing & Quality Verification

- **Integration Test**: Validated in `tests/master_audit.test.js` under public route availability.
- **Browser Verification**: Tested across Chrome, Firefox, and WebKit on Linux desktop.

---

## 7. Known Limitations & Future Work

- **Dynamic CMS News**: Campus announcements are currently statically seeded; future integration with an administrative CMS is planned.
- **Live Counter Sockets**: Metric counters display initial values rather than live WebSocket-pulsed counters.

---

## 8. Related Documentation
- [Routes & Pages](file:///run/media/rudra/534a134c-69cb-49e5-9a9c-284e9ad8ee1b/NextCampus/docs/ROUTES_AND_PAGES.md)
- [Design System](file:///run/media/rudra/534a134c-69cb-49e5-9a9c-284e9ad8ee1b/NextCampus/docs/DESIGN_SYSTEM.md)
- [Student Dashboard](file:///run/media/rudra/534a134c-69cb-49e5-9a9c-284e9ad8ee1b/NextCampus/docs/modules/STUDENT_DASHBOARD.md)
