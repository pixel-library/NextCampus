# Project Glossary & Terminology

*Last Reviewed: October 2026*

This document provides definitive definitions for domain concepts, technical acronyms, architectural patterns, and campus terminology used throughout **NextCampus**.

---

## 1. Domain & Campus Terminology

| Term | Definition |
| :--- | :--- |
| **NextCampus** | The overarching next-generation smart campus web platform designed for unified spatial, academic, administrative, and ecological workflows. |
| **SmartRoom** | An IoT-instrumented room or laboratory providing real-time telemetry (occupancy, temperature, humidity, noise level) and indoor SVG floor plan visualization. |
| **EcoCampus** | The campus environmental sustainability intelligence portal tracking solar power generation, grid reliance, water usage, and student recycling gamification. |
| **SkillCampus** | A collaborative student project marketplace where students propose projects, recruit team members with specific skills, and apply for open contributor roles. |
| **Complaint / Care Ticket** | A student-reported maintenance or administrative grievance tracked from submission through triage, staff assignment, resolution, and student feedback. |
| **Facility** | A physical campus asset, building, sports arena, library, or outdoor point of interest possessing geographic coordinates (latitude/longitude), department affiliations, and floors. |
| **Floor Plan** | An indoor architectural vector representation showing room polygons, access corridors, stairs, and environmental sensor placements. |
| **GIS (Geographic Information System)** | Coordinate-based spatial data representing campus perimeter boundaries, building markers, and walking pathways. |
| **Google Stitch** | The approved high-fidelity design specification that defined NextCampus UI layouts, typography, micro-interactions, and 5-color dark palette tokens. |

---

## 2. Technical & Architectural Terms

| Term | Definition |
| :--- | :--- |
| **Dual API Mounting** | The Express architectural pattern where all API routes are mounted simultaneously on both `/api/v1` and `/api` to guarantee client interoperability. |
| **Dual Persistence Engine** | The data abstraction layer that queries MongoDB when connected (`readyState === 1`) and seamlessly falls back to pre-seeded in-memory arrays when MongoDB is offline. |
| **JWT (JSON Web Token)** | A compact, URL-safe means of representing claims between two parties, used by NextCampus for stateless user authentication. |
| **RBAC (Role-Based Access Control)** | The authorization mechanism restricting route access and API mutations based on assigned user roles (`student`, `admin`, `faculty`). |
| **SPA (Single-Page Application)** | A web application model where all user navigation is handled dynamically by React Router in the browser without full page reloads. |
| **Vite** | The next-generation frontend build tool and development server providing blazing-fast Hot Module Replacement (HMR). |
| **Leaflet.js** | The open-source JavaScript library utilized for mobile-friendly interactive campus map rendering and GPS marker manipulation. |
| **Gemini 1.5 Flash** | The Google multimodal AI large language model integrated on the backend to provide conversational campus intelligence. |
| **Multi-Intent Engine** | The offline algorithmic fallback engine in `server/services/ai.service.js` that parses natural language campus queries into structured responses and UI action cards when external AI APIs are unconfigured. |
| **Rich Cards** | Interactive UI cards returned by the AI Assistant (such as `route`, `room_telemetry`, `care_ticket`, `spatial`) providing direct action links and visual telemetry. |

---

## 3. Design System & Palette Tokens

| Token Name | Hex Code | Semantic Role in NextCampus |
| :--- | :--- | :--- |
| **Licorice** | `#191516` | Deep obsidian background for application containers and high-contrast dark mode foundation. |
| **Raisin Black** | `#382E31` | Warm charcoal surface background used for cards, tables, modals, and navigation bars. |
| **Amaranth Purple** | `#AC274F` | Vibrant berry accent color representing primary brand identity, active tabs, and primary action buttons. |
| **Blush** | `#EB638B` | Radiant rose secondary accent used for interactive hover states, badges, and positive alerts. |
| **Misty Rose** | `#FFD9DA` | High-contrast soft tinted foreground used for headers, badge text, and prominent typography. |

---

## 4. Roles and Permissions Matrix Summary

| Role | Permissions & Scope |
| :--- | :--- |
| **Guest / Public** | Can browse Landing Page (`/`), read public campus statistics, and access Login/Registration (`/auth`). |
| **Student** | Can access Student Dashboard, interactive campus map, directory, SmartRoom, submit complaints, chat with AI, view EcoCampus, create/join SkillCampus projects, and edit profile. |
| **Admin** | Full system access. Includes Admin Dashboard, Campus Management (CRUD buildings/rooms), Complaint Administration (triage/status updates), and live Map GIS editor. |

---

## 5. Related Documentation
- [Project Overview](file:///run/media/rudra/534a134c-69cb-49e5-9a9c-284e9ad8ee1b/NextCampus/docs/PROJECT_OVERVIEW.md)
- [Design System](file:///run/media/rudra/534a134c-69cb-49e5-9a9c-284e9ad8ee1b/NextCampus/docs/DESIGN_SYSTEM.md)
- [Architecture](file:///run/media/rudra/534a134c-69cb-49e5-9a9c-284e9ad8ee1b/NextCampus/docs/ARCHITECTURE.md)
