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

## 3. Running the Test Suite

```bash
# Execute master integration audit
npm test
```

Expected output:
```text
🎉 ALL 10 NEXTCAMPUS MASTER AUDIT WORKFLOWS PASSED (10/10)!
```

---

## 4. Related Documentation
* [COMPLETION_STATUS.md](COMPLETION_STATUS.md) — Comprehensive verification results.
* [DEBUGGING.md](DEBUGGING.md) — Diagnosing test failures.
