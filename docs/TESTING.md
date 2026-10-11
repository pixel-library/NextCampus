# Automated Testing & Verification Suite

> **Document:** `docs/TESTING.md`  
> **Last Reviewed:** 2026-10-10  
> **Test Suite:** `tests/master_audit.test.js` (10 Full-Stack Integration Workflows)

---

## 1. Testing Strategy

NextCampus uses an automated end-to-end integration and security audit runner:
* **Script**: `npm test`
* **Entry File**: `tests/master_audit.test.js`
* **Test Philosophy**: Evaluates actual backend service logic, database persistence, role privilege isolation, and error boundaries without requiring external testing frameworks (Jest/Mocha), ensuring zero configuration overhead and execution in under 2 seconds.

---

## 2. Master Audit 10-Workflow Matrix

```text
================================================================
🏛️  [NextCampus Master Audit] Full-Stack Integration & Security Test
================================================================
```

| Workflow | Area Tested | Key Assertions |
| :---: | :--- | :--- |
| **01** | Public Landing & Health | Validates `campusService.getAllLocations()` returns seed locations with `name` and `code`. |
| **02** | Auth, Bcrypt & Role Isolation | Tests registration with forged `role: 'admin'`, asserting role is strictly forced to `'student'`. Validates bcrypt password hashing and token generation. |
| **03** | Dashboard & Sustainability | Asserts energy usage, overall sustainability index, and population statistics. |
| **04** | Directory & GIS Lookup | Checks spatial query filtering by category (`academic`) and lookup by building code. |
| **05** | SmartRooms Capacity | Validates room discovery, IoT telemetry attributes, and numeric capacity bounds. |
| **06** | Complaint Lifecycle & Privacy | Submits ticket, assigns staff, appends internal note, and strictly asserts `internalNotes` is omitted from student view. |
| **07** | SkillCampus Teaming | Creates project, validates capacity, and asserts duplicate join requests are blocked. |
| **08** | Campus Management CRUD | Registers building, creates linked room, asserts safe non-cascade deletion conflict, and executes cascade deletion. |
| **09** | Profile & Password Rotation | Updates profile accessibility scale to `110%`, verifies current password, and rotates to new password. |
| **10** | RBAC Guards & AI Assistant | Validates admin and student JWT claims, and asserts AI Assistant processes spatial prompts. |

---

## 3. Dedicated GIS Unit Test Suite

* **Script**: `node tests/unit/campus_locations_update.test.js`
* **Entry File**: [`tests/unit/campus_locations_update.test.js`](file:///run/media/rudra/534a134c-69cb-49e5-9a9c-284e9ad8ee1b/NextCampus/tests/unit/campus_locations_update.test.js)
* **Testing Scope**:
  - Validates that all 20 real Mewar University campus landmarks are present in both [`CampusGisMap.jsx`](file:///run/media/rudra/534a134c-69cb-49e5-9a9c-284e9ad8ee1b/NextCampus/src/components/map/CampusGisMap.jsx) and [`CampusMap.jsx`](file:///run/media/rudra/534a134c-69cb-49e5-9a9c-284e9ad8ee1b/NextCampus/src/pages/CampusMap.jsx).
  - Asserts authentic satellite ground truth coordinates for Gate 1 (`25.031920`), Gate 2 (`25.033480`), Teacher Building (`25.032655`), Badal Hostel (`25.032382`), Basketball Ground (`25.031342`, OSM Way 549126358), Main Building (`25.032981`), Mess (`25.032130`), Football Ground (`25.031526`), Park (`25.033968`), and Bhamasha Hostel (`25.034287`).
  - Verifies backwards-compatible aliases (`admin -> main`, `cafeteria -> mess`, `hostel_b -> sanaga`, `hostel_g -> mira`, `sports -> basketball`).

---

## 4. Running the Test Suites

```bash
# 1. Execute GIS geometry unit test
node tests/unit/campus_locations_update.test.js

# 2. Execute master integration audit & pytest backend workflows
npm test

# 3. Execute python backend workflows only
npm run test:python
```

Expected output:
```text
✔ Campus Locations Update: All 20 real Mewar University locations exist in CampusGisMap and CampusMap
✅ Campus Locations Update: All 20 locations, authentic coordinates, and backwards-compatible aliases verified.

======================= 9 passed in backend pytest =======================
🎉 ALL 10 NEXTCAMPUS MASTER AUDIT WORKFLOWS PASSED (10/10)!
```

---

## 5. Related Documentation
* [COMPLETION_STATUS.md](COMPLETION_STATUS.md) — Comprehensive verification results.
* [CAMPUS_MAP.md](modules/CAMPUS_MAP.md) — Interactive Campus Map module specification.
* [DEBUGGING.md](DEBUGGING.md) — Diagnosing test failures.

