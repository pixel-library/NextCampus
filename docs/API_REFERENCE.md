# REST API Reference Manual

> **Document:** `docs/API_REFERENCE.md`  
> **Last Reviewed:** 2026-10-10  
> **Base URLs:** `/api/v1` and `/api` (Dual compatibility mounted on server)

---

## 1. Authentication Endpoints (`/auth`)

### `POST /auth/register`
* **Access**: Public
* **Payload**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@nextcampus.edu",
    "password": "Password123!",
    "studentId": "STU-2026-009",
    "department": "Computer Science",
    "academicYear": "Class of 2028"
  }
  ```
* **Success (201)**: Returns `{ success: true, data: { user, token } }`.
* **Rules**: Always overrides `role` to `'student'`. Hashes password with bcrypt.

### `POST /auth/login`
* **Access**: Public
* **Payload**: `{ "email": "rudra@nextcampus.edu", "password": "password123" }` (or `"identifier"`).
* **Success (200)**: Returns `{ success: true, data: { user, token } }`.

### `GET /auth/me`
* **Access**: Authenticated (`Bearer <token>`)
* **Success (200)**: Returns current sanitized user document.

### `PUT /auth/profile`
* **Access**: Authenticated (`Bearer <token>`)
* **Payload**: `{ "preferredName": "Rudra", "phone": "+91...", "skills": [...] }`.
* **Success (200)**: Returns updated user record.

### `PUT /auth/change-password`
* **Access**: Authenticated (`Bearer <token>`)
* **Payload**: `{ "currentPassword": "...", "newPassword": "..." }`.
* **Success (200)**: Verifies current password and rotates hash.

---

## 2. Campus GIS & Facility Endpoints (`/campus`)

### `GET /campus/locations`
* **Access**: Public
* **Query Params**: `?category=academic`, `?status=open`.
* **Success (200)**: Returns array of building objects with SVG coordinates `{ x, y, floor }`.

### `GET /campus/locations/:code`
* **Access**: Public
* **Success (200)**: Returns detailed location by building code (e.g. `A-01`) or Mongo `_id`.

### `POST /campus/locations`
* **Access**: Admin, Staff
* **Payload**: Building details with coordinates `{ x, y }`.
* **Success (201)**: Registers new building in GIS database.

### `PUT /campus/locations/:id`
* **Access**: Admin, Staff
* **Payload**: Updated building details, name, or coordinates.
* **Success (200)**: Updates location record.

### `DELETE /campus/locations/:id`
* **Access**: Admin, Staff
* **Query Params**: `?cascade=true`.
* **Behavior**: Rejects with HTTP 409 Conflict if dependent rooms exist unless `cascade=true`.

---

## 3. SmartRooms IoT Endpoints (`/smartrooms` & `/rooms`)

### `GET /smartrooms/rooms`
* **Access**: Public
* **Query Params**: `?building=turing`, `?status=available`.
* **Success (200)**: Returns array of rooms with temperature, CO₂, and occupancy.

### `POST /smartrooms/rooms`
* **Access**: Admin, Staff
* **Payload**: `{ "roomNumber": "B-209", "building": "Alan Turing Hall", "capacity": 40 }`.
* **Success (201)**: Creates room record.

### `PATCH /smartrooms/rooms/:id`
* **Access**: Admin, Staff
* **Payload**: Room equipment, status, capacity, or timetable rules.
* **Success (200)**: Updates room record.

---

## 4. NextCampus Care (Complaint) Endpoints (`/care`)

### `GET /care/complaints`
* **Access**: Authenticated (`Bearer <token>`)
* **Behavior**: For regular students, returns their own complaints without internal notes; for admins, returns all campus complaints with internal notes.

### `POST /care/complaints`
* **Access**: Authenticated (`Bearer <token>`)
* **Payload**: `{ "title": "...", "category": "av", "building": "...", "priority": "high", "description": "..." }`.
* **Success (201)**: Creates ticket and assigns Tier 1 SLA if applicable.

### `POST /care/complaints/:id/assign`
* **Access**: Admin, Care Admin
* **Payload**: `{ "staffId": "usr_staff_01", "staffName": "Marcus Vance" }`.

### `POST /care/complaints/:id/internal-notes`
* **Access**: Admin, Care Admin
* **Payload**: `{ "note": "Confidential engineering observation" }`.

### `POST /care/complaints/:id/updates`
* **Access**: Admin, Staff
* **Payload**: `{ "message": "Technician dispatched" }`.

### `GET /care/staff`
* **Access**: Admin, Care Admin
* **Success (200)**: Returns list of available maintenance staff members.

---

## 5. NextCampus AI Endpoint (`/ai`)

### `POST /ai/query`
* **Access**: Public / Authenticated
* **Payload**: `{ "prompt": "How do I reach Turing B-204 from Library?" }`.
* **Success (200)**:
  ```json
  {
    "reply": "...",
    "category": "navigation",
    "suggestedAction": "/campus-map",
    "thought": ["⚡ Graph queried...", "⚡ Route computed..."],
    "richCards": [{ "type": "route", "metric": "320m • ~4 mins walk", ... }],
    "isLiveModel": false,
    "engineName": "NextCampus Multi-Intent Intelligence v4.5"
  }
  ```

---

## 6. SkillCampus Endpoints (`/skillcampus`)

### `GET /skillcampus/projects`
* **Access**: Authenticated
* **Success (200)**: Returns open student collaborative projects.

### `POST /skillcampus/projects`
* **Access**: Student
* **Payload**: Project title, tags, description, team size.

### `POST /skillcampus/projects/:id/join`
* **Access**: Student
* **Rules**: Enforces single membership; prevents creator duplicate joining.

---

## 7. Sustainability & Admin Endpoints

### `GET /sustainability/metrics`
* **Access**: Public
* **Success (200)**: Returns solar yield (88.8 MWh), microgrid load, and SmartBin metrics.

### `GET /admin/stats`
* **Access**: Admin
* **Success (200)**: Aggregates student/faculty populations, building counts, and SLA metrics.

---

## 8. Related Documentation
* [BACKEND.md](BACKEND.md) — Service layer implementations.
* [ERROR_HANDLING.md](ERROR_HANDLING.md) — Error response formatting.
