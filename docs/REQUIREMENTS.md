# System Requirements & Specifications

> **Document:** `docs/REQUIREMENTS.md`  
> **Last Reviewed:** 2026-10-10  
> **Scope:** Functional, Non-Functional, Security, and Accessibility Specifications

---

## 1. Functional Requirements (FR)

### FR-01: Authentication & Identity Management
* **FR-01.1**: The system must allow users to register with full name, institutional email, student ID, and secure password.
* **FR-01.2**: Self-registration must strictly force the `role` field to `student`, preventing client-side privilege escalation.
* **FR-01.3**: Passwords must be hashed using `bcrypt` (10 salt rounds) before persistence. Plaintext passwords must never be stored or returned in API payloads (`select: false`).
* **FR-01.4**: Successful authentication must return a signed JWT token containing `id`, `email`, and `role`, valid for 7 days by default.
* **FR-01.5**: Password reset entries must be provided on `/auth` without claiming unconfigured external SMTP dispatch.

### FR-02: Public Landing & Role Isolation
* **FR-02.1**: The root URL (`/`) must serve a standalone public landing page without internal sidebar or workspace navigation.
* **FR-02.2**: Unauthenticated guests attempting to navigate to protected routes (`/dashboard`, `/campus-map`, etc.) must be redirected to `/auth`.
* **FR-02.3**: Students attempting to navigate to `/admin` or `/admin/*` must be intercepted by route guards and redirected to `/dashboard`.
* **FR-02.4**: Authenticated users visiting `/` must be offered direct routing to their respective workspaces (Student Portal vs Admin Console).

### FR-03: Spatial Wayfinding & Campus GIS
* **FR-03.1**: The interactive map (`/campus-map`) must render a responsive SVG vector canvas displaying buildings, roads, walkways, lawns, and reflection pond.
* **FR-03.2**: Selecting any building must open a side drawer showing department details, description, hours, HVAC telemetry, and turn-by-turn navigation steps.
* **FR-03.3**: The system must support route calculation for Walk, Step-Free (Wheelchair), and EV Shuttle modes.
* **FR-03.4**: When an administrator views the map, an "Admin GIS" toolbar must be available enabling:
  - Click-to-move repositioning of building markers.
  - 4-way arrow nudging in 20px increments.
  - Editing building details and map dimensions.
  - Adding new facilities and persisting coordinates to `/api/v1/campus/locations`.

### FR-04: SmartRooms & IoT Telemetry
* **FR-04.1**: SmartRoom discovery must list rooms with filterable criteria (building, floor, room type).
* **FR-04.2**: Each room must display live occupancy, capacity, temperature, CO₂ ppm, lighting status, and next scheduled lecture.
* **FR-04.3**: Admins must be able to configure room equipment tags, capacity, status, and timetable lock sync rules.

### FR-05: Incident Triage & Complaint Management (NextCampus Care)
* **FR-05.1**: Students must be able to submit maintenance tickets with category, priority, building, room number, description, and optional file attachments.
* **FR-05.2**: Active learning spaces (e.g. Alan Turing Hall B-204) must automatically trigger Tier-1 Rapid Response SLA (<45 min resolution).
* **FR-05.3**: Staff and Admins must be able to assign tickets, update statuses, and log internal administrative notes.
* **FR-05.4**: Internal administrative notes must be strictly scrubbed and hidden from student-facing responses.

### FR-06: Generative AI Assistant
* **FR-06.1**: The assistant must support natural language queries across 12 campus domains (Wayfinding, SmartRooms, Care, Directory, Timetable, EcoCampus, SkillCampus, Dining, Shuttle, Admin).
* **FR-06.2**: Responses must return structured thought reasoning, descriptive replies, and interactive cards (`route`, `room_telemetry`, `care_ticket`, `spatial`).
* **FR-06.3**: When `GEMINI_API_KEY` is provided, the backend must interface with Google Gemini 1.5 Flash.

### FR-07: EcoCampus Sustainability
* **FR-07.1**: The platform must display overall campus green score (Grade A-, 78%), daily solar yield (88.8 MWh), and SmartBin waste diversion (82%).

### FR-08: SkillCampus Student Teaming
* **FR-08.1**: Students must be able to discover projects, filter by technology tags, create projects, and request to join existing teams.
* **FR-08.2**: The backend must strictly prevent duplicate team memberships or creators joining their own projects.

---

## 2. Non-Functional Requirements (NFR)

| ID | Category | Requirement Specification |
| :--- | :--- | :--- |
| **NFR-01** | **Performance** | Initial page load time must be <1.5s on broadband; client bundle gzip size under 300 kB. |
| **NFR-02** | **Availability** | The system must operate gracefully offline or without an active MongoDB connection using in-memory fallbacks. |
| **NFR-03** | **Scalability** | Stateless JWT authentication allowing horizontal replication of backend Express instances. |
| **NFR-04** | **Browser Compatibility** | Verified on modern evergreen browsers: Chrome/Chromium 120+, Brave, Firefox 120+, Safari 17+, Edge. |
| **NFR-05** | **Responsiveness** | Fluid adaptive layout across Mobile (375px+), Tablet (768px - 1024px), and Desktop (1280px+). |
| **NFR-06** | **Security** | Zero plaintext secrets in repository; CORS restricted; input sanitization on all endpoints. |

---

## 3. Compliance & Accessibility Standards

* **WCAG 2.1 AA/AAA**: Contrast ratios exceed 4.5:1 for normal text and 8:1 for accent blush `#EB638B` on licorice `#191516`.
* **Keyboard Navigation**: Interactive elements support full tab indexing and focus rings (`2px solid #FFD9DA`).
* **Screen Reader Compatibility**: ARIA attributes applied to SVGs, modals, buttons, and alerts.

---

## 4. Related Documentation
* [FEATURES.md](FEATURES.md) — Implementation details of all functional requirements.
* [SECURITY.md](SECURITY.md) — Threat models and vulnerability controls.
* [TESTING.md](TESTING.md) — Master audit test specifications.
