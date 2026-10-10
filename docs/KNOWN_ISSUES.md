# Known Issues & Limitations

*Last Reviewed: October 2026*

This document tracks known bugs, architectural limitations, edge cases, and design discrepancies identified in the **NextCampus** codebase.

---

## 1. Issue Tracking Matrix

| ID | Module / Component | Severity | Status | Workaround / Current State |
| :--- | :--- | :--- | :--- | :--- |
| **ISS-001** | Dual API Route Prefix | Low | Mitigated | `/api/v1` and `/api` both mounted on server; client auto-retries. |
| **ISS-002** | In-Memory Volatility | Medium | Known Behavior | Resets on restart if MongoDB is disconnected; use MongoDB in production. |
| **ISS-003** | Local File Storage | Medium | Planned | Uploaded avatars/complaint photos stored locally on disk (`server/uploads`). |
| **ISS-004** | Floor Plan Vector Zooming | Low | Open | SVG floor plans use static viewBox scaling; fine pinch-to-zoom is limited. |
| **ISS-005** | Real-Time Push (WebSockets) | Low | Planned | Polling / fetch used instead of live WebSocket push for complaints/IoT telemetry. |
| **ISS-006** | Third-Party Auth (OAuth2) | Low | Planned | Google/GitHub SSO buttons on UI are placeholders; local JWT is active. |
| **ISS-007** | Automated Email Delivery | Low | Planned | Password reset emails logged to console; SMTP mailer not configured. |

---

## 2. Detailed Issue Descriptions

### ISS-001: Dual API Route Prefixing
- **Location**: `server/index.js` & `src/services/api.js`
- **Description**: Some frontend components or legacy tests query `/api/...` directly, while others use standard REST versioning `/api/v1/...`.
- **Impact**: Without fallback, routes might return 404 depending on client invocation.
- **Mitigation**: `server/index.js` mounts the entire router under both prefixes:
  ```javascript
  mountAll('/api/v1');
  mountAll('/api');
  ```
  `src/services/api.js` includes automated retry logic if a 404 occurs on a versioned path.

---

### ISS-002: In-Memory Seed Volatility without MongoDB
- **Location**: `server/services/*.service.js`
- **Description**: In development environments without a running MongoDB daemon, the application runs entirely in memory using seeded fixtures (`IN_MEMORY_*`).
- **Impact**: Any records created, updated, or deleted (such as complaints, user profiles, or newly created buildings) are wiped when the Node.js server restarts.
- **Mitigation**: Normal and expected behavior for offline dev. Production environments must set `MONGODB_URI` to a persistent database instance.

---

### ISS-003: Local Disk Storage for Uploads
- **Location**: `server/middleware/upload.js`, `server/uploads/`
- **Description**: Files uploaded via Complaint submission (`/api/complaints`) or Student Profile (`/api/profile/avatar`) are written directly to the server's local filesystem in `server/uploads/`.
- **Impact**: In multi-instance or serverless cloud environments (e.g., AWS ECS, Render, Vercel), uploaded files will not persist across container recreations or be shared across horizontal replicas.
- **Planned Resolution**: Implement cloud object storage (AWS S3, Google Cloud Storage, or Cloudinary) via an environment-driven storage provider interface.

---

### ISS-004: SVG Floor Plan Interactive Zoom Constraints
- **Location**: `src/pages/SmartRoom.jsx`
- **Description**: Indoor floor plans render as responsive SVG overlays with room coordinate highlights. On small mobile screens, high-density floor plans have limited pinch-to-zoom fidelity compared to dedicated GIS tile renderers.
- **Impact**: Users on mobile devices with high screen zoom may experience slight misalignment of text labels within small room boundaries.
- **Mitigation**: Responsive SVG viewBox maintains overall layout proportion.

---

### ISS-005: Absence of Real-Time WebSocket Telemetry
- **Location**: `src/pages/SmartRoom.jsx`, `src/pages/ComplaintAdmin.jsx`
- **Description**: IoT temperature, humidity, noise sensor telemetry and complaint status updates rely on REST API requests and state triggers rather than persistent WebSockets (`ws://`) or Server-Sent Events (SSE).
- **Impact**: Collaborative administrative updates or real-time sensor fluctuations are not instantly pushed to other viewing browser sessions without user refresh or action trigger.
- **Planned Resolution**: Implement `socket.io` or native WebSocket event bus for live telemetry broadcasting in v2.0.

---

### ISS-006: Social OAuth2 Identity Providers
- **Location**: `src/pages/Auth.jsx`
- **Description**: The Authentication modal displays visual buttons for "Continue with Google" and "Continue with Campus SSO".
- **Impact**: These buttons currently display informational guidance indicating local credential authentication should be used.
- **Planned Resolution**: Integrate Passport.js or Auth0 Google OAuth2 strategy in a future release.

---

### ISS-007: Password Reset Email Delivery
- **Location**: `server/routes/auth.routes.js`
- **Description**: Requesting a password reset generates a secure reset token and writes the reset link to the server terminal log rather than dispatching a physical email.
- **Impact**: Production deployments requiring email-based password resets will require SMTP/SendGrid configuration.
- **Planned Resolution**: Integrate Nodemailer with SendGrid or AWS SES.

---

## 3. Discrepancies Between Stitch Designs & Code Implementation

| Design Reference | Intended Stitch UI | Current Code Implementation | Reason / Status |
| :--- | :--- | :--- | :--- |
| **Interactive Map Provider** | Static mock map canvas | Live Leaflet.js interactive canvas with real tile layers & draggable pins | Enhanced beyond static Stitch design to support real interactive navigation. |
| **EcoCampus Historical Filter** | Date range picker | Preset ranges: "Today", "This Week", "This Month", "All Time" | Simplified for intuitive student usage without requiring complex multi-calendar widgets. |
| **SmartRoom HVAC Control** | Read-only telemetry cards | Interactive temperature sliders & lighting toggles | Enhanced to allow students/staff to simulate smart room control. |

---

## 4. Related Documentation
- [Technical Debt](file:///run/media/rudra/534a134c-69cb-49e5-9a9c-284e9ad8ee1b/NextCampus/docs/TECHNICAL_DEBT.md)
- [Troubleshooting Guide](file:///run/media/rudra/534a134c-69cb-49e5-9a9c-284e9ad8ee1b/NextCampus/docs/TROUBLESHOOTING.md)
- [Roadmap](file:///run/media/rudra/534a134c-69cb-49e5-9a9c-284e9ad8ee1b/NextCampus/docs/ROADMAP.md)
