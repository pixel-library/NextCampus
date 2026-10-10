# Architectural Decision Records (ADRs)

*Last Reviewed: October 2026*

This document records the foundational architectural decisions made during the design, prototyping, and production engineering of **NextCampus**.

---

## 1. Summary of Architecture Decisions

| ADR ID | Decision Title | Status | Date |
| :--- | :--- | :--- | :--- |
| **ADR-001** | Dual Persistence Engine (MongoDB + In-Memory Fallback) | Accepted | 2026-10 |
| **ADR-002** | Dual API Mounting (`/api/v1` and `/api`) | Accepted | 2026-10 |
| **ADR-003** | Custom Vanilla CSS Design System over TailwindCSS | Accepted | 2026-10 |
| **ADR-004** | Leaflet.js with OpenStreetMap for Spatial Navigation | Accepted | 2026-10 |
| **ADR-005** | Hybrid AI Architecture (Gemini 1.5 + Offline Fallback Engine) | Accepted | 2026-10 |
| **ADR-006** | Local Storage JWT for Stateless Authentication | Accepted | 2026-10 |
| **ADR-007** | Multer Local Filesystem Storage with Memory Buffers | Accepted | 2026-10 |

---

## 2. Detailed Decision Records

### ADR-001: Dual Persistence Engine
- **Context**: NextCampus is evaluated, demonstrated, and audited across diverse environments—including developer laptops, continuous integration servers, and air-gapped demo sandboxes where a running MongoDB daemon may not always be available.
- **Decision**: Every backend service (`server/services/*.service.js`) checks `mongoose.connection.readyState === 1`. If connected, operations execute against MongoDB Mongoose models. If disconnected or unconfigured, operations execute against high-fidelity, in-memory seeded fixtures (`IN_MEMORY_*`) with complete CRUD support.
- **Consequences**:
  - *Positive*: Zero-setup developer onboarding; tests and demos run instantly without requiring a local database container.
  - *Negative*: Code in backend services contains duplicate branches; in-memory data resets when the server restarts.

---

### ADR-002: Dual API Route Mounting
- **Context**: During rapid phase evolution, various client components and test suites made requests to unversioned `/api/<resource>` endpoints, while REST standards dictate `/api/v1/<resource>`.
- **Decision**: In `server/index.js`, encapsulate all route registrations in a `mountAll(prefix)` function and invoke it twice: once for `/api/v1` and once for `/api`. Additionally, configure `src/services/api.js` with automated fallback retry logic.
- **Consequences**:
  - *Positive*: Complete backward and forward compatibility; zero 404 route mismatches across legacy components, new modules, and external scripts.
  - *Negative*: Two endpoint paths for the same logical operation; requires new routes to be registered within the shared mounting block.

---

### ADR-003: Custom Vanilla CSS Design System over TailwindCSS
- **Context**: The project required strict adherence to the Google Stitch design specification and its precise 5-color dark palette. Pre-packaged CSS utility libraries can introduce styling bloat and conflicting style resets.
- **Decision**: Implement a pure Vanilla CSS design system rooted in `src/index.css` utilizing custom CSS variables, glassmorphic translucent backdrops, and hardware-accelerated animations.
- **Consequences**:
  - *Positive*: Total aesthetic control, ultra-light bundle footprint, zero configuration overhead, pixel-perfect fidelity to Google Stitch tokens.
  - *Negative*: Utility classes must be explicitly defined in CSS rather than generated dynamically via compiler macros.

---

### ADR-004: Leaflet.js with OpenStreetMap for Spatial Navigation
- **Context**: The campus map requires building markers, category filtering, route visualization, and real-time administrator coordinate editing. Proprietary mapping providers (e.g. Google Maps, Mapbox) require paid API keys and strict usage quotas.
- **Decision**: Use **Leaflet.js** with OpenStreetMap standard cartographic tiles, custom SVG pinpoint markers, and programmatic polyline routing.
- **Consequences**:
  - *Positive*: 100% open source, zero external API key requirements, lightweight browser memory footprint, full control over custom marker drag events.
  - *Negative*: Global OSM tiles do not natively provide indoor building floor geometry (mitigated by using dedicated SVG floor plans in SmartRoom).

---

### ADR-005: Hybrid AI Architecture
- **Context**: NextCampus AI Assistant must provide real-time conversational capabilities when deployed with enterprise cloud keys, but must never crash or display broken error screens in offline or unkeyed test environments.
- **Decision**: Implement a two-tiered AI service:
  1. If `GEMINI_API_KEY` is present in `.env`, stream queries to Google Gemini 1.5 Flash using structured system prompts.
  2. If absent or on network timeout, invoke the built-in multi-intent campus engine in `server/services/ai.service.js`, parsing queries across 12 campus domains and returning structured responses with interactive rich UI cards.
- **Consequences**:
  - *Positive*: 100% test reliability and demo readiness; seamless upgrade to live LLM generation simply by adding an environment key.
  - *Negative*: Fallback engine requires manual maintenance of intent regex patterns and keyword dictionaries.

---

### ADR-006: Local Storage JWT Authentication
- **Context**: Fast SPA navigation and role-based route guarding required low-latency access to the active user's identity and role claims across client-side page transitions.
- **Decision**: Store signed JWT tokens in browser `localStorage`, transmitting them via the standard `Authorization: Bearer <token>` HTTP header.
- **Consequences**:
  - *Positive*: Simple, stateless implementation; instant client-side role inspection in `AuthContext` and `ProtectedRoute`.
  - *Negative*: Vulnerable to XSS token exfiltration if arbitrary third-party scripts were injected (mitigated by strict dependency audit and zero third-party CDNs). Future roadmap includes HttpOnly cookies.

---

### ADR-007: Multer Local Disk Storage for Uploads
- **Context**: Phase 4 and Phase 8 required support for student profile pictures and maintenance complaint evidence photos.
- **Decision**: Use `multer` disk storage saving to `server/uploads/` with UUID-based unique filenames and static Express serving (`/uploads/*`).
- **Consequences**:
  - *Positive*: Immediate offline operation with zero S3 or cloud bucket dependencies.
  - *Negative*: Files do not persist across ephemeral serverless container instances; roadmap item planned for S3-compatible cloud storage adapter.

---

## 3. Related Documentation
- [Architecture](file:///run/media/rudra/534a134c-69cb-49e5-9a9c-284e9ad8ee1b/NextCampus/docs/ARCHITECTURE.md)
- [Design System](file:///run/media/rudra/534a134c-69cb-49e5-9a9c-284e9ad8ee1b/NextCampus/docs/DESIGN_SYSTEM.md)
- [Technical Debt](file:///run/media/rudra/534a134c-69cb-49e5-9a9c-284e9ad8ee1b/NextCampus/docs/TECHNICAL_DEBT.md)
