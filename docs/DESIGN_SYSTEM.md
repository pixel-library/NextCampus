# Design System & Token Specifications

> **Document:** `docs/DESIGN_SYSTEM.md`  
> **Last Reviewed:** 2026-10-10  
> **Scope:** Color Architecture, Typography Hierarchy, CSS Custom Properties, and Elevation Scales

---

## 1. Official 5-Color Architecture

The NextCampus design system strictly adheres to the calibrated 5-color palette defined in `src/index.css`:

```css
:root {
  /* Brand Palette */
  --brand-licorice: #191516;        /* Canvas Base */
  --brand-raisin: #382E31;          /* Container Surface */
  --brand-primary: #AC274F;         /* Amaranth Purple: Main CTAs & Nav Active */
  --brand-accent: #EB638B;          /* Blush: Interactive Focus & Highlights */
  --brand-misty: #FFD9DA;           /* Misty Rose: Soft Text & Badge Accents */

  /* Semantic Aliases */
  --bg-canvas: var(--brand-licorice);
  --bg-surface: var(--brand-raisin);
  --bg-surface-elevated: #44383B;
  --bg-surface-subtle: rgba(56, 46, 49, 0.6);

  --text-primary: #FFFFFF;
  --text-secondary: #FFD9DA;
  --text-muted: #D6C4C8;

  --border-subtle: rgba(255, 217, 218, 0.12);
  --border-interactive: rgba(235, 99, 139, 0.35);

  /* Elevations */
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.25);
  --shadow-md: 0 4px 20px rgba(0, 0, 0, 0.35);
  --shadow-lg: 0 12px 32px rgba(0, 0, 0, 0.50);

  /* Radii */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --radius-full: 9999px;
}
```

---

## 2. Typography Scale

Typefaces imported via Google Fonts in `index.html`: **Plus Jakarta Sans** (headings and UI labels) and **Inter** (body text and data tables).

| Token | CSS Definition | Line Height | Usage |
| :--- | :--- | :---: | :--- |
| `Display Title` | `font-size: 2.25rem; font-weight: 800` | `1.2` | Landing page hero headings |
| `Page Title` | `font-size: 1.5rem; font-weight: 700` | `1.3` | Top-level page titles (`h1`) |
| `Section Title`| `font-size: 1.125rem; font-weight: 600` | `1.4` | Card headings, drawer titles (`h2`) |
| `Body Large` | `font-size: 0.95rem; font-weight: 500` | `1.5` | Lead descriptions, active telemetry |
| `Body Default`| `font-size: 0.875rem; font-weight: 400`| `1.6` | Paragraph text, ticket descriptions |
| `Caption / Meta`| `font-size: 0.75rem; font-weight: 500` | `1.4` | Timestamps, coordinates, badge labels |

---

## 3. Elevation & Glassmorphism Guidelines

* **Base Surface**: Solid `#382E31` with `border: 1px solid var(--border-subtle)` and `border-radius: 14px`.
* **Glass Floating Overlay**: `backgroundColor: 'rgba(35, 30, 31, 0.95)'`, `backdropFilter: 'blur(16px)'`, and `border: 1px solid var(--border-interactive)`.
* **Glow Gradients**: Radial ambient background glows use `radial-gradient(ellipse at center, rgba(172, 39, 79, 0.25) 0%, rgba(25, 21, 22, 0) 70%)`.

---

## 4. Related Documentation
* [UI_UX_DESIGN.md](UI_UX_DESIGN.md) — Visual principles.
* [STITCH_DESIGN_REFERENCE.md](STITCH_DESIGN_REFERENCE.md) — Stitch source assets.
