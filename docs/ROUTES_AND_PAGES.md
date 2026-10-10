# Routes & Pages Registry

> **Document:** `docs/ROUTES_AND_PAGES.md`  
> **Last Reviewed:** 2026-10-10  
> **Scope:** Canonical Table of All 14 Application Routes, Page Shells, and Authorization Guards

---

## 1. Master Route Directory

| # | Route Path | Component File | Shell Type | Allowed Roles | Description |
| :-: | :--- | :--- | :--- | :--- | :--- |
| **01** | `/` | `src/pages/LandingPage.jsx` | Public Standalone | Public / All | Public homepage with hero, features, and college introduction. |
| **02** | `/auth` | `src/pages/AuthPage.jsx` | Public Standalone | Public Guest | Unified Sign In & Registration portal with demo credentials helper. |
| **03** | `/dashboard` | `src/pages/StudentDashboard.jsx` | App Shell (`AppLayout`) | Student, Admin | Student portal with active lecture HUD, timeline, and AI copilot. |
| **04** | `/campus-map` | `src/pages/CampusMap.jsx` | App Shell (`AppLayout`) | Student, Staff, Admin | Interactive vector SVG campus map with Admin Map Editor toolbar. |
| **05** | `/directory` | `src/pages/CampusDirectory.jsx` | App Shell (`AppLayout`) | Student, Staff, Admin | Searchable campus buildings, departments, and faculty contact cards. |
| **06** | `/smartroom` | `src/pages/SmartRooms.jsx` | App Shell (`AppLayout`) | Student, Staff, Admin | IoT room density, environmental telemetry, and indoor floor view. |
| **07** | `/complaints`| `src/pages/CareComplaints.jsx` | App Shell (`AppLayout`) | Student, Staff | NextCampus Care incident lodging with Tier-1 SLA tracking. |
| **08** | `/ai-assistant`| `src/pages/AiAssistant.jsx` | App Shell (`AppLayout`) | Student, Staff, Admin | Conversational campus copilot with spatial reasoning and route cards. |
| **09** | `/ecocampus` | `src/pages/EcoCampus.jsx` | App Shell (`AppLayout`) | Student, Staff, Admin | Sustainability dashboard with solar microgrid and IoT SmartBin metrics. |
| **10** | `/skillcampus`| `src/pages/SkillCampus.jsx` | App Shell (`AppLayout`) | Student | Student peer project incubator and team discovery marketplace. |
| **11** | `/admin` | `src/pages/AdminDashboard.jsx` | App Shell (`AppLayout`) | Admin, Care Admin | Administrative overview of campus metrics, tickets, and rooms. |
| **12** | `/admin/campus-management` | `src/pages/CampusManagement.jsx` | App Shell (`AppLayout`) | Admin, Staff | Building, department, floor, and room CRUD management. |
| **13** | `/admin/complaints` | `src/pages/ComplaintAdmin.jsx` | App Shell (`AppLayout`) | Admin, Care Admin | Complaint dispatch, staff assignment, and private internal notes. |
| **14** | `/profile` | `src/pages/ProfileSettings.jsx`| App Shell (`AppLayout`) | Authenticated | Student profile summary, information editing, and password rotation. |
| **--** | `*` | `src/pages/NotFoundPage.jsx` | Standalone | All | 404 Not Found error page with direct link back to safety. |

---

## 2. Route Guarding Rules

In `src/components/layout/AppLayout.jsx`:

```javascript
// 1. Unauthenticated Guest Guard
if (!isAuthenticated || !user) {
  return <Navigate to="/auth" state={{ from: location }} replace />;
}

// 2. Administrative Role Guard
const isAdminPath = location.pathname.startsWith('/admin');
const isAdminUser = user.role === 'admin' || user.role === 'care_admin';
if (isAdminPath && !isAdminUser) {
  return <Navigate to="/dashboard" replace />;
}
```

---

## 3. Related Documentation
* [FRONTEND.md](FRONTEND.md) — Frontend architecture details.
* [AUTHENTICATION.md](AUTHENTICATION.md) — User session handling.
* [AUTHORIZATION.md](AUTHORIZATION.md) — Role permission specifications.
