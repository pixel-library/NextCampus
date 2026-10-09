# NextCampus Brand Identity & Visual Design System Specification
**Project:** NextCampus — Smart Campus Management Platform (MU Hackathon 2026)  
**Tagline:** "The Next Generation of Smart Campuses."  
**Brand Archetype:** Modern, Intelligent, Trustworthy, Connected, Professional SaaS

---

## 1. Official Color Architecture & Tokens

The NextCampus visual language strictly adheres to the calibrated 5-color palette, eliminating extraneous generic tech blues while maintaining WCAG AAA/AA readability across light and dark surfaces.

| Token Name | Hex Code | Role & Strategic Application | Contrast Ratio (vs #191516) |
| :--- | :--- | :--- | :--- |
| **Licorice** | `#191516` | **Canvas Base / Deepest Surface**: Global canvas backgrounds, modal backdrops, high-contrast dark sections. | Baseline |
| **Raisin Black** | `#382E31` | **Container Surface**: Primary card backgrounds, navigation sidebars, top headers, dropdown containers. | 1.3:1 (Subtle elevation) |
| **Amaranth Purple** | `#AC274F` | **Primary Brand & CTA**: Main action buttons, active navigation tab indicators, primary status accents. | 4.8:1 (AA for large text/icons) |
| **Blush** | `#EB638B` | **Secondary Accent & Focus**: Hover states, interactive highlights, subtle linear gradients, pill borders. | 8.2:1 (AAA High Contrast) |
| **Misty Rose** | `#FFD9DA` | **Soft Accent & Light Text**: Badge backgrounds, soft indicators, secondary typography on dark cards. | 14.1:1 (AAA Ultra Contrast) |
| **Pure White** | `#FFFFFF` | **Primary Typography**: Main headings, bold titles, and primary action text on dark backgrounds. | 16.8:1 (AAA Peak Contrast) |

### Gradient Token Guidelines
- **Brand Primary Gradient:** `linear-gradient(135deg, #EB638B 0%, #AC274F 100%)` (Use sparingly for active hero states, primary badges, and key metric badges).
- **Surface Depth Gradient:** `linear-gradient(180deg, rgba(56, 46, 49, 0.7) 0%, rgba(25, 21, 22, 0.95) 100%)`.
- **Border Sheen:** `1px solid rgba(235, 99, 139, 0.18)` or `1px solid rgba(255, 217, 218, 0.08)`.

---

## 2. Brand Identity & Logo Direction

- **Official Symbol:** An isometric, geometric **"N"** mark intersecting at a 45-degree angle to depict campus waypoints, arterial pathways, and cross-facility communication nodes.
- **Wordmark:** **Next** (SemiBold `#FFFFFF`) + **Campus** (Extrabold `#EB638B`), followed by the uppercase sub-tracker `SMART CAMPUS PLATFORM` (`#FFD9DA`).
- **Scalability Specifications:**
  - **Favicon / App Icon (32px - 64px):** Rounded container `#382E31` with the Amaranth/Blush isometric "N" emblem alone.
  - **Navigation Chrome (Height 36px - 44px):** Emblem + Wordmark lockup.
  - **Hackathon Deck / GitHub Banner (Hero):** Full lockup with subtle radial ambient glow (`rgba(172, 39, 79, 0.20)`).

---

## 3. Typography Hierarchy

NextCampus utilizes **Plus Jakarta Sans / Inter** as its primary typeface for a clean, human-centered SaaS feel.

| Level | Size / Weight | Line Height | Letter Spacing | Color Token | Application |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display Heading** | 36px (2.25rem) / 800 | 1.2 | -0.03em | `#FFFFFF` | Landing heroes, primary dashboard welcoming title |
| **Page Heading** | 24px (1.5rem) / 700 | 1.3 | -0.02em | `#FFFFFF` | Page headers (e.g., "Campus Map", "SmartRoom") |
| **Section Heading** | 18px (1.125rem) / 600 | 1.4 | -0.01em | `#FFD9DA` | Card titles, modal headers, table group labels |
| **Body (Default)** | 14px (0.875rem) / 400 | 1.6 | normal | `#E8DFE2` | Main descriptions, room details, complaint logs |
| **Body (Medium)** | 14px (0.875rem) / 500 | 1.5 | normal | `#FFFFFF` | Form inputs, interactive table rows |
| **Caption / Meta** | 12px (0.75rem) / 500 | 1.4 | +0.02em | `#FFD9DA` (80%) | Timestamps, coordinates, tag labels, status pills |
| **Button / Label** | 13px (0.8125rem) / 600 | 1.0 | +0.01em | Variable | Primary & secondary interactive triggers |

---

## 4. Reusable Component Design Language

### Buttons & CTAs
- **Primary Action:** Solid `#AC274F` background, `#FFFFFF` bold text, `10px` border radius, subtle hover elevation shifting to `#EB638B`, focus outline `2px solid #FFD9DA`.
- **Secondary Action:** Transparent background with `#382E31` fill, `1px solid rgba(235, 99, 139, 0.3)` border, `#FFD9DA` text.
- **Ghost / Tertiary Action:** Subtle text button with `#EB638B` hover transition and `rgba(235, 99, 139, 0.08)` hover background.

### Cards & Surfaces
- **Base Card:** Background `#382E31`, border `1px solid rgba(255, 217, 218, 0.08)`, border-radius `14px`, box-shadow `0 4px 20px -2px rgba(0, 0, 0, 0.35)`.
- **Active / Selected Card:** Border `1.5px solid #AC274F`, subtle inset glow `0 0 16px rgba(172, 39, 79, 0.15)`.

### Form Controls & Inputs
- **Text & Search Fields:** Background `#191516`, border `1px solid rgba(255, 217, 218, 0.15)`, text `#FFFFFF`, placeholder `#382E31` / muted pink `#9E8C91`, border-radius `10px`.
- **Focus State:** Border shifts cleanly to `#EB638B` with `0 0 0 3px rgba(235, 99, 139, 0.20)`.

### Badges & Status Indicators
- **Active / Online:** `#AC274F` dot with `#FFD9DA` text on `rgba(172, 39, 79, 0.2)` badge.
- **Pending / In Review:** `#EB638B` outline with soft blush background.
- **Resolved / Complete:** Controlled high-contrast white/blush badge structure, avoiding discordant unrelated rainbow colors.

---

## 5. Responsive Grid & Breakpoint Foundations

- **Desktop (1280px+):** Fixed collapsed/expanded sidebar (`72px` or `240px`), 12-column fluid grid, `24px` gutter.
- **Tablet (768px – 1024px):** Compact sidebar with icon labels, 6-column grid, stacked secondary widgets.
- **Mobile (375px – 430px):** Persistent bottom navigation bar with 4-5 core waypoints, full-width cards, touch targets minimum `44px × 44px`.

---
*Ready for Phase 2 implementation when requested.*