# Responsive Design & Multi-Device Foundations

> **Document:** `docs/RESPONSIVE_DESIGN.md`  
> **Last Reviewed:** 2026-10-10  
> **Scope:** Fluid Grid Breakpoints, Mobile Navigation, and Adaptive Layouts

---

## 1. Breakpoint Architecture

NextCampus adopts a fluid, mobile-first responsive grid system calibrated for three viewport classes:

| Viewport Class | Range | Structural Layout | Navigation Strategy |
| :--- | :---: | :--- | :--- |
| **Mobile** | `375px – 767px` | 1-column stacked cards, full-width drawers | Fixed bottom navigation bar (`MobileNav.jsx`) |
| **Tablet** | `768px – 1279px`| 2-column grid, compact sidebars | Collapsed desktop rail or top navbar |
| **Desktop / Wide** | `1280px+` | 12-column grid, side drawers, multi-pane view | Fixed `240px` left sidebar (`Sidebar.jsx`) |

---

## 2. Device Adaptations by Key Module

### 1. Campus Map (`CampusMap.jsx`)
* **Desktop**: Map canvas occupies full height; building detail drawer sits as an absolute side panel (`380px` width) allowing map visibility while browsing building data.
* **Mobile**: Detail drawer transitions to a bottom sheet overlay; map navigation controls shift to top and bottom edges for one-thumb reachability.

### 2. Student Dashboard (`StudentDashboard.jsx`)
* **Desktop**: 2-column layout (70% main feed with active lecture and timeline, 30% right sidebar with AI copilot and deadlines).
* **Mobile**: Single-column vertical stack with full-width cards and touch-optimized buttons (minimum `44px × 44px`).

### 3. AI Assistant (`AiAssistant.jsx`)
* **Desktop**: 3-pane layout (Left conversation history drawer, center chat stream, right context inspector).
* **Mobile**: Full-screen conversation stream with collapsible header and bottom prompt chips.

---

## 3. Touch Ergonomics & Accessibility

* **Minimum Hit Targets**: All buttons, links, and filter chips adhere to minimum touch target sizing (`44px × 44px` or `padding: 10px 14px`).
* **Safe Area Insets**: Bottom mobile navigation includes safe-area padding for modern notch/gesture smartphones.

---

## 4. Related Documentation
* [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) — Visual tokens and spacing scales.
* [ACCESSIBILITY.md](ACCESSIBILITY.md) — Screen reader and contrast specs.
