# Changelog

All notable changes to the **NextCampus** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased] - 2026-10-10

### Documentation
- Created complete 64-document project documentation library inside the existing `/docs` directory.
- Documented full system architecture, technology stack, database schemas, API reference, security models, Stitch design references, and 14 dedicated module specifications.

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
