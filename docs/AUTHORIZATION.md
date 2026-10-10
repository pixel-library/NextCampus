# Authorization & Role-Based Access Control (RBAC)

> **Document:** `docs/AUTHORIZATION.md`  
> **Last Reviewed:** 2026-10-10  
> **Scope:** Role Permissions Matrix, Route Guards, and Backend Authorization Middleware

---

## 1. Role-Based Access Control (RBAC) Matrix

NextCampus classifies users into four distinct roles:

| Feature / Resource | Public Guest | Student | Staff | Admin & Care Admin |
| :--- | :---: | :---: | :---: | :---: |
| **Landing Page (`/`)** | Full View | Full View | Full View | Full View |
| **Login & Register (`/auth`)** | Full View | Redirects | Redirects | Redirects |
| **Student Dashboard (`/dashboard`)** | Blocked | Full Access | Full Access | Full Access |
| **Interactive Map (`/campus-map`)** | Blocked | View & Wayfinding | View & Wayfinding | View + Admin Map Mode Editor |
| **Campus Directory (`/directory`)** | Blocked | Search & View | Search & View | Search & Manage |
| **SmartRooms IoT (`/smartroom`)** | Blocked | View & Reserve | View & Reserve | View & Config Rooms |
| **Lodge Complaint (`/complaints`)** | Blocked | Submit & Track | Submit & Track | Submit & Track |
| **AI Assistant (`/ai-assistant`)** | Blocked | Conversational Access| Conversational Access| Conversational Access |
| **EcoCampus Metrics (`/ecocampus`)**| Blocked | View Metrics | View Metrics | View Metrics |
| **SkillCampus Teaming (`/skillcampus`)**| Blocked | Create & Join | View | View |
| **Admin Dashboard (`/admin`)** | Blocked | Blocked | Blocked | Full Management |
| **Campus Management (`/admin/...`)** | Blocked | Blocked | View Only | Full Facility CRUD |
| **Complaint Admin (`/admin/...`)** | Blocked | Blocked | Assigned Tickets | Assign Staff & Private Notes |
| **Profile Settings (`/profile`)** | Blocked | Own Profile | Own Profile | Own Profile |

---

## 2. Backend Middleware Enforcement (`server/middleware/auth.js`)

Role verification is executed on every protected Express endpoint:

```javascript
// server/middleware/auth.js
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access requires one of [${roles.join(', ')}] permissions. Current role: ${req.user?.role || 'anonymous'}`
      });
    }
    next();
  };
};
```

---

## 3. Client-Side Navigation Interception (`src/components/layout/AppLayout.jsx`)

When a student attempts to type or paste an administrative URL (e.g. `http://localhost:3000/admin`), React Router intercepts the render:

```javascript
const isAdminPath = location.pathname.startsWith('/admin');
const isAdminUser = user.role === 'admin' || user.role === 'care_admin';
if (isAdminPath && !isAdminUser) {
  return <Navigate to="/dashboard" replace />;
}
```

---

## 4. Related Documentation
* [AUTHENTICATION.md](AUTHENTICATION.md) — Token structure.
* [SECURITY.md](SECURITY.md) — Security policies and defense-in-depth.
