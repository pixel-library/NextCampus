# Third-Party Integrations & External Services

> **Document:** `docs/INTEGRATIONS.md`  
> **Last Reviewed:** 2026-10-10  
> **Scope:** External AI Models, CAD Cloud Connectors, IoT Telemetry, and University ERPs

---

## 1. External Integrations Matrix

| Integration Name | Category | Protocol / SDK | Status | Source File |
| :--- | :--- | :--- | :--- | :--- |
| **Google Gemini 1.5 Flash** | Generative AI | HTTPS REST (`generativelanguage.googleapis.com`) | Live when configured via `GEMINI_API_KEY` | `server/services/ai.service.js` |
| **Revit Cloud (IFC4)** | Architectural CAD | Metadata Schema Identifier | Simulated Schema Tag | `server/models/Location.js` |
| **IoT Environmental Sensors**| Smart Facility Telemetry | Virtual Sensor Mesh (CO₂, Temp, Density) | Live Data Simulation | `server/services/room.service.js` |
| **University Keycloak Gateway**| Enterprise Identity | Routing Notice / Simulated SSO | Ready for SAML/OIDC | `src/pages/AuthPage.jsx` |
| **GitHub Student Repositories**| SkillCampus Collaboration| External URL Reference | Live Link Integration | `server/models/Project.js` |

---

## 2. Google Gemini 1.5 Flash Integration

In `server/services/ai.service.js`:
* When `GEMINI_API_KEY` is detected in the environment:
  - Invokes `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`.
  - Injects system prompt defining NextCampus landmarks (Alan Turing Hall A-01, Library B-02, Ramanujan Science C-03, SAC D-04, Innovation Hub INN-HUB-01).
* If the API key is not provided or network fails:
  - Automatically falls back to the **NextCampus Multi-Intent Intelligence v4.5** in-memory reasoning engine across 12 campus domains.

---

## 3. Related Documentation
* [ENVIRONMENT_VARIABLES.md](ENVIRONMENT_VARIABLES.md) — API keys and configuration.
* [AI_ASSISTANT.md](modules/AI_ASSISTANT.md) — Detailed AI Assistant module documentation.
