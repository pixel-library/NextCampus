# Changelog

All notable changes to the **NextCampus** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.3.0] - 2026-10-11

### Added
- **High-Precision Satellite Ground-Truth Landmark Realignment**:
  - Calibrated all 20 real Mewar University campus landmarks against high-resolution satellite imagery and OpenStreetMap ground truth.
  - Realigned **Gate 1** (`[25.031920, 74.635280]`) on the highway NH-48 boundary portal and **Gate 2** (`[25.033480, 74.634600]`) on the west perimeter road.
  - Aligned **Teacher Building** (`[25.032655, 74.636881]`) and **Badal Hostel** (`[25.032382, 74.637010]`) directly east of the Engineering building with accurate 24° axis tilt.
  - Calibrated **Basketball Ground** to OSM Way 549126358 (`[25.031342, 74.637242]`) immediately south of the Law Building.
  - Positioned **Central Mess** (`[25.032580, 74.637850]`), **Central Park** (`[25.033750, 74.635450]`), **Football Ground** (`[25.032150, 74.638200]`), and **Bhamasha Hostel** (`[25.034287, 74.635706]`).
- **Topological Road Routing Graph (`MEWAR_CAMPUS_ROADS`)**:
  - Built a 17-junction topological graph connecting all campus paths, gates, and buildings with shortest-path A* route calculation and animated polyline rendering.
- **Dedicated GIS Unit Test Suite**:
  - Added `tests/unit/campus_locations_update.test.js` validating all 20 locations, authentic coordinates, polygon footprints, and backwards-compatible aliases (`admin`, `cafeteria`, `hostel_b`, `hostel_g`, `sports`).

---

## [1.2.0] - 2026-10-11

### Added
- **Multi-Layer Resilient Tile Fallback Engine**:
  - Implemented automatic fallback chain between CartoDB Dark Matter, OpenStreetMap standard tiles, and Esri World Imagery with `tileerror` listeners to eliminate gray/missing tiles during zoom levels 14–20.
- **Phases 1-9 Full-Stack Redesigns**:
  - Overhauled Student Dashboard with prioritized academic hierarchy.
  - Upgraded SmartRooms IoT space telemetry and interactive environmental controls.
  - Enhanced NextCampus Care with dual-note privacy barrier (`internalNotes` vs public updates).
  - Modernized Campus Directory with category filters and instant spatial connections.
  - Redesigned Profile & Settings with master password rotation and accessibility sliders.
  - Revamped NextCampus AI Assistant with conversational UI and rich action cards.
  - Conducted full accessibility and responsiveness audit ensuring WCAG AA contrast, keyboard navigation, and mobile touch ergonomics.

### Fixed
- **Student Registration Duplicate Handling**:
  - Enhanced error handling for pre-existing or duplicate student registrations, providing clear, actionable feedback to users.
- **Map Tile Zooming**:
  - Fixed Leaflet map tile rendering issues when zooming into high magnification levels on dark themes.

---

## [1.1.0] - 2026-10-09

### Added
- **Interactive Admin Map Editor**:
  - Live coordinate drag-and-drop marker relocation on `/campus-map`.
  - 4-way direction pad (Nudge buttons: 0.0001° increments) for fine-grained GIS calibration.
  - Facility editing modal to change building names, codes, categories, and coordinates directly on the map.
  - Instant synchronization with backend `/api/facilities/:id` and in-memory caches.
- **Enhanced AI Assistant**:
  - Integrated Google Gemini 1.5 Flash live API provider when `GEMINI_API_KEY` is present in `.env`.
  - Upgraded offline campus intelligence engine supporting 12 campus domains, structured thoughts, and rich UI action cards (`route`, `room_telemetry`, `care_ticket`, `spatial`).
- **Master Full-Stack Integration Test Suite**:
  - `tests/master_audit.test.js` validating 10 end-to-end integration workflows with 100% pass rate.
- **Dual API Route Compatibility**:
  - Server mounts routes on both `/api/v1` and `/api` prefixes to guarantee 100% interoperability across all frontend clients and test runners.

### Fixed
- Fixed campus map marker coordinate precision in Firefox and WebKit browsers.
- Resolved token deserialization edge case during fast authentication switches.
- Fixed complaint submission file upload fallback when no image file is attached.

---

## [1.0.0] - 2026-10-08

### Added - Initial Full-Stack Platform Release (Phases 1-8)
- **Phase 1: Project Foundation & Landing Page**:
  - Modern Vite + React frontend architecture with custom Vanilla CSS design system.
  - Stitch palette tokens: Licorice (`#191516`), Raisin Black (`#382E31`), Amaranth Purple (`#AC274F`), Blush (`#EB638B`), Misty Rose (`#FFD9DA`).
  - Landing page (`/`) with hero banner, quick actions, campus stats, and news ticker.
- **Phase 2: Student Dashboard**:
  - Student Dashboard (`/dashboard`) with schedule cards, quick navigation, weather telemetry, and quick complaint reporting widget.
- **Phase 3: Interactive Campus Map & Campus Directory**:
  - Leaflet-powered Campus Map (`/campus-map`) with facility category filters, route simulation, and building information drawers.
  - Campus Directory (`/directory`) with searchable faculty, staff, and department listings.
- **Phase 4: SmartRoom & Complaint Management**:
  - SmartRoom (`/smartroom`) with indoor floor plans, room occupancy indicators, equipment tags, and HVAC/lighting simulation controls.
  - Complaint Management (`/complaints`) with issue submission, photo attachments, category prioritization, and student ticket history tracking.
- **Phase 5: NextCampus AI & EcoCampus**:
  - NextCampus AI Assistant (`/ai-assistant`) conversational interface with suggested queries and interactive campus response cards.
  - EcoCampus (`/ecocampus`) sustainability portal with live solar metrics, water consumption tracking, and recycling leaderboards.
- **Phase 6: SkillCampus & Admin Dashboard**:
  - SkillCampus (`/skillcampus`) student peer project marketplace with role openings, skill tags, and collaborative join requests.
  - Admin Dashboard (`/admin`) with campus-wide analytics, pending complaint queues, building occupancy metrics, and administrative action tiles.
- **Phase 7: Campus Management & Complaint Administration**:
  - Campus Management (`/admin/campus-management`) CRUD suite for buildings, floors, and rooms.
  - Complaint Administration (`/admin/complaints`) triage table with status changes, staff assignments, and internal administrative notes.
- **Phase 8: Authentication & Student Profile**:
  - Login & Registration (`/auth`) with JWT token generation, role-based redirection, and bcrypt password hashing.
  - Student Profile & Settings (`/profile`) with avatar upload, emergency contact preferences, academic details, and notification toggles.
- **Backend Architecture**:
  - Express.js server with dual-persistence architecture (MongoDB with in-memory seed fallback).
  - Multer multipart upload middleware for avatars and complaint evidence photos.
  - Role-based authorization middleware (`student`, `admin`).
