# UI/UX Design Philosophy & Principles

> **Document:** `docs/UI_UX_DESIGN.md`  
> **Last Reviewed:** 2026-10-10  
> **Scope:** User Experience Philosophy, Interaction Models, and Visual Aesthetics

---

## 1. Design Vision & Philosophy

NextCampus delivers an enterprise-grade, human-centered smart campus interface designed to wow users at first glance while minimizing cognitive fatigue during all-day academic study and administrative operations.

### Core Tenets
1. **Low Cognitive Load**: Information is organized into hierarchical cards with clear metric callouts, avoiding wall-of-text layouts.
2. **Ambient Spatial Context**: Digital spatial maps and telemetry reflect the real physical campus, anchoring digital interactions to physical coordinates.
3. **Calibrated Dark Mode**: Built on Licorice (`#191516`) and Raisin Black (`#382E31`), preventing eye strain under low-light library and dorm study conditions.
4. **Purposeful Color Coding**: Rejects confusing multi-color rainbow schemas; color is reserved strictly for status, focus, and primary brand actions.

---

## 2. Interaction Models

### 1. Spatial Telemetry Cards
* Cards utilize Raisin Black surfaces (`#382E31`) with a soft pink border sheen (`rgba(255, 217, 218, 0.08)`).
* Interactive cards elevate on hover with a subtle upward translate (`translateY(-2px)`) and border glow (`rgba(235, 99, 139, 0.3)`).

### 2. Glassmorphism & Elevation
* Navigation bars, wayfinding control panels, and modals utilize semi-transparent backdrops (`rgba(35, 30, 31, 0.95)`) combined with backdrop blur (`backdropFilter: 'blur(16px)'`).
* Creates a layered depth hierarchy that keeps users oriented within the interface.

### 3. Micro-Animations & Tactile Feedback
* Mode switchers (Walk / Wheelchair / EV Shuttle) provide crisp visual state transitions.
* AI chat reasoning drawers expand with smooth rotation arrows (`rotate-180`).
* Toast notifications slide in smoothly and auto-dismiss after 3.5 seconds.

---

## 3. Related Documentation
* [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) — Exact CSS variables and tokens.
* [STITCH_DESIGN_REFERENCE.md](STITCH_DESIGN_REFERENCE.md) — Mapping to Google Stitch source files.
* [ACCESSIBILITY.md](ACCESSIBILITY.md) — Accessibility compliance guidelines.
