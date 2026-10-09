---
name: Smart Campus System
colors:
  surface: '#161213'
  surface-dim: '#161213'
  surface-bright: '#3d3839'
  surface-container-lowest: '#110d0e'
  surface-container-low: '#1f1a1b'
  surface-container: '#231e1f'
  surface-container-high: '#2d292a'
  surface-container-highest: '#383335'
  on-surface: '#eae0e1'
  on-surface-variant: '#dfbfc3'
  inverse-surface: '#eae0e1'
  inverse-on-surface: '#342f30'
  outline: '#a68a8d'
  outline-variant: '#584144'
  surface-tint: '#ffb2bf'
  primary: '#ffb2bf'
  on-primary: '#660027'
  primary-container: '#ac274f'
  on-primary-container: '#ffc7d0'
  inverse-primary: '#af2951'
  secondary: '#ffb1c2'
  on-secondary: '#66002c'
  secondary-container: '#8c1844'
  on-secondary-container: '#ff9bb3'
  tertiary: '#e2bebf'
  on-tertiary: '#422a2b'
  tertiary-container: '#715556'
  on-tertiary-container: '#f1cccd'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffd9de'
  primary-fixed-dim: '#ffb2bf'
  on-primary-fixed: '#3f0015'
  on-primary-fixed-variant: '#8e0a3a'
  secondary-fixed: '#ffd9e0'
  secondary-fixed-dim: '#ffb1c2'
  on-secondary-fixed: '#3f0019'
  on-secondary-fixed-variant: '#891541'
  tertiary-fixed: '#ffdadb'
  tertiary-fixed-dim: '#e2bebf'
  on-tertiary-fixed: '#2a1617'
  on-tertiary-fixed-variant: '#5a4041'
  background: '#161213'
  on-background: '#eae0e1'
  surface-variant: '#383335'
typography:
  display-hero:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 48px
  display-hero-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 40px
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22.4px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  caption:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
---

## Brand & Style

This design system establishes a high-performance, dark-mode-first environment tailored for higher education operations, campus logistics, facility automation, and student engagement. 

### Design Philosophy
The aesthetic fuses **Modern Enterprise SaaS** with **Tactile Luminescence**. Instead of relying on conventional generic enterprise blues or standard grays, the interface leverages a deep, wine-and-licorice tonal hierarchy. It projects technological precision, institutional authority, and vibrant student-centric dynamism.

### Emotional Target
- **Intelligent & Authoritative:** Operators and faculty feel in absolute control of campus data, schedules, and operations.
- **Warm & Student-Friendly:** Deep warm undertones eliminate cold institutional sterility, framing campus life as accessible and modern.
- **Forward-Looking:** Subtle amaranth ambient luminescence conveys real-time responsiveness and ambient intelligence without visual clutter.

## Colors

The palette rejects standard corporate cool grays, blues, and teals, adhering strictly to a warm crimson, blush, and obsidian spectrum.

### Surface System
- **Canvas / Root Background (`#191516` - Licorice):** The lowest layer of visual hierarchy. Used for overall viewport background and fixed layout backdrops.
- **Elevated Canvas / Containers (`#382E31` - Raisin Black):** Used for standard cards, data tables, side navigation bars, top bars, and modular tiles.
- **Overlay Surface (`#44383B`):** Modal sheets, dropdown menus, flyouts, and active table row highlights.

### Brand & Interactive Accents
- **Primary Brand & CTA (`#AC274F` - Amaranth Purple):** Primary action buttons, active navigation states, selected radio/checkbox toggles, and critical system badges.
- **Secondary Accent (`#EB638B` - Blush):** Interactive hover states, secondary highlights, subtle focused glows, and alert badges.
- **Misty Accent (`#FFD9DA` - Misty Rose):** Low-contrast tag backgrounds, subdued text, and soft edge highlights.

### Text Hierarchy
- **Text Primary (`#FFFFFF`):** High-contrast headlines, primary button labels, and vital metric values.
- **Text Secondary (`#F5EFF1`):** Body copy, default table cell text, and input content.
- **Text Muted (`#D6C4C8`):** Form labels, breadcrumbs, table headers, and secondary meta values.

### Borders & Dividers
- **Subtle Surface Border:** `rgba(255, 217, 218, 0.08)` for standard card edges, grid rows, and card separators.
- **Interactive Border:** `rgba(235, 99, 139, 0.16)` for unselected input fields, secondary buttons, and active tabs.
- **Active Focus Border:** `rgba(235, 99, 139, 0.60)` with outward glow for keyboard focus and active text inputs.

## Typography

The type system pairs **Plus Jakarta Sans** for display, page headings, and sectional structure with **Inter** for data tables, operational density, and body copy.

### Typographic Rules
- **Headings & Section Titles:** Set in Plus Jakarta Sans. Tracking is slightly tightened (`-0.02em`) on sizes `24px` and above to reinforce structural impact.
- **Body & Numerical Readouts:** Inter provides neutral clarity. Body text targets a consistent `1.6` line-height ratio (`14px/22.4px`) to preserve readability across high-density administrative panels.
- **Microcopy, Metadata & Badges:** Set in `12px` and `13px` Inter Medium with loose tracking (`+0.02em` to `+0.04em`) to ensure scannability at small sizes.

## Layout & Spacing

The layout operates on a standard 8pt grid with specialized responsive parameters tailored for complex multi-view campus dashboards.

### Grid Framework
- **Desktop (≥1280px):** 12-column fluid grid, 24px (`1.5rem`) gutters, 32px (`2rem`) page outer margin. Persistent 260px navigation rail.
- **Tablet (768px - 1279px):** 8-column grid, 20px gutters, 24px margins. Collapsed 72px icon navigation rail.
- **Mobile (<768px):** 4-column fluid grid, 16px (`1rem`) gutters, 16px margins. Bottom drawer navigation bar.

### Spacing Guidelines
- **Inner Card Spacing:** Standard density cards utilize `space-lg` (24px) padding. High-density data tables and small metric widgets utilize `space-md` (16px).
- **Stack Gaps:** Inter-component vertical rhythm strictly enforces `space-md` (16px) for related form groups, and `space-xl` (32px) between major dashboard sections.

## Elevation & Depth

Visual hierarchy does not use harsh dropshadows or stark grays. Elevation is established via layered surface luminance paired with subtle Amaranth-tinted ambient glows.

### Tiers of Depth
- **Level 0 (Base Canvas):** Solid `#191516`. No shadow.
- **Level 1 (Cards, Content Panels, Tables):** Solid `#382E31` with hairline border `1px solid rgba(255, 217, 218, 0.08)`. Shadow: `0 2px 8px rgba(0, 0, 0, 0.35)`.
- **Level 2 (Hovered Cards, Dropdowns, Popovers):** `#3E3336` surface, border `1px solid rgba(235, 99, 139, 0.16)`. Ambient Shadow: `0 8px 24px rgba(172, 39, 79, 0.12), 0 4px 12px rgba(0, 0, 0, 0.45)`.
- **Level 3 (Modals, Overlays, Floating Command Bar):** `#382E31` surface, border `1px solid rgba(235, 99, 139, 0.30)`. Ambient Shadow: `0 16px 40px rgba(172, 39, 79, 0.20), 0 8px 24px rgba(0, 0, 0, 0.6)`. Backdrop filter blur: `12px` over `rgba(25, 21, 22, 0.75)`.

## Shapes

The design uses an intentional, structured curve hierarchy balancing software precision with soft ergonomics:

- **Small (8px):** Badges, inline controls, buttons, tooltips, and table chips.
- **Medium / Base (12px):** Form inputs, search fields, modular cards, list tiles, and select menus.
- **Large (16px):** Modal dialogs, side drawers, slide-overs, and primary dashboard containers.
- **Full / Pill (9999px):** Status indicator pills, active filter toggles, counter chips, and avatar containers.

## Components

### Buttons
- **Primary:** Background `#AC274F`, text `#FFFFFF`, border none, border-radius 8px, font-weight 600. Hover: `#EB638B` with box-shadow `0 0 16px rgba(235, 99, 139, 0.4)`. Active: scale `0.98`.
- **Secondary / Outlined:** Background `transparent`, text `#F5EFF1`, border `1px solid rgba(235, 99, 139, 0.24)`. Hover: Background `rgba(172, 39, 79, 0.12)`, border-color `#EB638B`.
- **Ghost:** Text `#F5EFF1`, no border. Hover: Background `rgba(255, 217, 218, 0.06)`, text `#FFD9DA`.

### Form Controls & Inputs
- **Text Inputs & Search:** Background `#241E20`, border `1px solid rgba(255, 217, 218, 0.12)`, text `#FFFFFF`, placeholder `#D6C4C8`, border-radius 12px. Focus state: border-color `#EB638B`, outline none, box-shadow `0 0 0 3px rgba(235, 99, 139, 0.2)`.
- **Checkbox & Radio:** Box size 18px. Default border `1.5px solid rgba(255, 217, 218, 0.24)`, background `transparent`. Checked state: background `#AC274F`, border-color `#AC274F`, icon white.

### Data Cards & Dashboard Panels
- **Container Structure:** Background `#382E31`, border `1px solid rgba(255, 217, 218, 0.08)`, border-radius 12px, padding 20px. 
- **Metric Tiles:** Primary metric value in 32px Plus Jakarta Sans Bold (`#FFFFFF`), category label in 13px Inter Medium (`#D6C4C8`), trend badge formatted as a rounded pill (`background: rgba(172, 39, 79, 0.2)`, `color: #FFD9DA`).

### Data Tables
- **Table Container:** Rounded-12px outer container with inner border collapse.
- **Header Row:** Background `#2B2325`, text `#D6C4C8`, uppercase 12px Inter Medium, tracking `+0.04em`, border-bottom `1px solid rgba(255, 217, 218, 0.08)`.
- **Data Rows:** Background `#382E31`, border-bottom `1px solid rgba(255, 217, 218, 0.04)`, text `#F5EFF1` 14px Inter. Hover state: background `#44383B`.

### Status Indicators & Pills
- **Active / Operational:** Background `rgba(172, 39, 79, 0.2)`, text `#FFD9DA`, border `1px solid rgba(235, 99, 139, 0.3)`, pill radius (9999px).
- **Muted / Inactive:** Background `rgba(255, 255, 255, 0.06)`, text `#D6C4C8`, border `1px solid rgba(255, 255, 255, 0.08)`.

### Navigation Rails & Sidebars
- **Container:** Background `#1E191A`, border-right `1px solid rgba(255, 217, 218, 0.08)`.
- **Nav Item:** Padding 10px 16px, border-radius 8px, text `#D6C4C8` 14px Inter Medium. Hover: background `rgba(255, 217, 218, 0.05)`, text `#FFFFFF`.
- **Active Nav Item:** Background `rgba(172, 39, 79, 0.18)`, text `#FFFFFF`, border-left `3px solid #EB638B`.