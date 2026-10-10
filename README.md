# NextCampus — The Next Generation of Smart Campuses

NextCampus is an enterprise-grade full-stack smart campus web platform designed to unify spatial navigation, IoT classroom telemetry, grievance redressal, conversational artificial intelligence, environmental sustainability analytics, and academic project matchmaking into a single, cohesive experience.

Built with **React**, **Vite**, **Express.js**, **Node.js**, **MongoDB**, **Leaflet.js**, and **Google Gemini 1.5 Flash**, adhering strictly to the **Google Stitch** design system and the curated 5-color dark palette:
- **Licorice** (`#191516`)
- **Raisin Black** (`#382E31`)
- **Amaranth Purple** (`#AC274F`)
- **Blush** (`#EB638B`)
- **Misty Rose** (`#FFD9DA`)

---

## 📚 Complete Project Documentation

All comprehensive project documentation is centralized inside the **[`/docs`](file:///run/media/rudra/534a134c-69cb-49e5-9a9c-284e9ad8ee1b/NextCampus/docs/README.md)** directory.

Please explore the master documentation library:

- **[Master Documentation Index](file:///run/media/rudra/534a134c-69cb-49e5-9a9c-284e9ad8ee1b/NextCampus/docs/README.md)**: Central directory of all 64 project documents.
- **[Project Overview](file:///run/media/rudra/534a134c-69cb-49e5-9a9c-284e9ad8ee1b/NextCampus/docs/PROJECT_OVERVIEW.md)**: Mission, vision, core metrics, and architecture summary.
- **[Architecture Guide](file:///run/media/rudra/534a134c-69cb-49e5-9a9c-284e9ad8ee1b/NextCampus/docs/ARCHITECTURE.md)**: Full-stack tier structure, dual persistence, and dual API mounting.
- **[Installation Guide](file:///run/media/rudra/534a134c-69cb-49e5-9a9c-284e9ad8ee1b/NextCampus/docs/INSTALLATION.md)**: Step-by-step setup and quickstart instructions.
- **[API Reference](file:///run/media/rudra/534a134c-69cb-49e5-9a9c-284e9ad8ee1b/NextCampus/docs/API_REFERENCE.md)**: Detailed documentation of all REST API endpoints.
- **[Module Specifications](file:///run/media/rudra/534a134c-69cb-49e5-9a9c-284e9ad8ee1b/NextCampus/docs/modules/)**: In-depth specifications for all 14 individual application pages.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```

### 3. Start Development Server
```bash
npm run dev
```
- Frontend SPA: `http://localhost:5173`
- Backend REST API: `http://localhost:5000/api/v1/health`

### 4. Run Test Suite
```bash
npm test
```

---

## 🔑 Pre-Seeded Demonstration Accounts

| Role | Email | Password | Landing Page Route |
| :--- | :--- | :--- | :--- |
| **Student** | `student@nextcampus.edu` | `student123` | [`/dashboard`](http://localhost:5173/dashboard) |
| **Administrator** | `admin@nextcampus.edu` | `admin123` | [`/admin`](http://localhost:5173/admin) |

---

## 📄 License
ISC License © 2026 NextCampus Team.
