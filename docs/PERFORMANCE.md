# Performance & Optimization Specifications

> **Document:** `docs/PERFORMANCE.md`  
> **Last Reviewed:** 2026-10-10  
> **Scope:** Frontend Bundle Metrics, SVG Vector Rendering, and Backend Efficiency

---

## 1. Frontend Bundle Metrics (Vite 5 Production Build)

Audited via `npm run build`:

```text
dist/index.html                     6.18 kB │ gzip:   1.61 kB
dist/assets/index-XezAbk66.css      5.58 kB │ gzip:   1.71 kB
dist/assets/index-eq2CWTA_.js   1,483.82 kB │ gzip: 246.72 kB
✓ built in 5.91s
```

* **CSS Payload**: Only **1.71 kB** gzipped! Achieved through pure CSS custom properties instead of sprawling class utility frameworks.
* **JS Payload**: **246.72 kB** gzipped for the entire 14-page platform including vector SVG maps and AI assistant.

---

## 2. SVG Vector Map Rendering Optimization

* **Hardware-Accelerated Transforms**: Zooming and panning in `CampusMap.jsx` utilize CSS transforms (`transform: scale(${zoomLevel})`) with GPU acceleration rather than re-rendering SVG DOM nodes.
* **Dynamic Grid Pattern**: The background coordinates grid uses a native SVG `<pattern id="campusGridPattern">`, reducing thousands of individual line nodes into a single repeating GPU texture.

---

## 3. Backend Efficiency & Stateless Token Handling

* **Stateless JWT Verification**: Eliminates server-side session memory lookups or Redis bottlenecks.
* **Lean Document Projections**: Sensitive fields (e.g. `password`) and internal notes are excluded at the database projection stage, avoiding unnecessary memory serialization.

---

## 4. Related Documentation
* [TECH_STACK.md](TECH_STACK.md) — Dependencies and tooling.
* [DEPLOYMENT.md](DEPLOYMENT.md) — Production deployment guidelines.
