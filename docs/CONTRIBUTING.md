# Contributing to NextCampus

*Last Reviewed: October 2026*

Thank you for your interest in contributing to **NextCampus — The Next Generation of Smart Campuses**! We welcome contributions from developers, designers, campus administrators, and open-source enthusiasts.

---

## 1. Code of Conduct

NextCampus fosters an inclusive, respectful, and collaborative environment. All contributors and maintainers are expected to uphold standards of mutual respect, constructive communication, and professional conduct across all discussions, issues, and pull requests.

---

## 2. Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Git**: v2.30+
- **MongoDB** *(Optional)*: v6.0+ (the system runs out of the box with built-in in-memory stores if MongoDB is absent)

### Local Development Setup
1. Fork and clone the repository:
   ```bash
   git clone https://github.com/your-username/NextCampus.git
   cd NextCampus
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
4. Start development server (runs frontend + backend concurrently):
   ```bash
   npm run dev
   ```
5. Access the application in your browser:
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000/api/v1/health`

---

## 3. How to Contribute

### Reporting Bugs
1. Check the [Known Issues](file:///run/media/rudra/534a134c-69cb-49e5-9a9c-284e9ad8ee1b/NextCampus/docs/KNOWN_ISSUES.md) and existing GitHub issues before creating a new ticket.
2. Provide a clear, reproducible description including:
   - Steps to reproduce
   - Expected behavior vs. actual behavior
   - Browser / OS version
   - Terminal logs or browser console screenshots

### Suggesting Enhancements
1. Open a GitHub Issue titled `feat: <short feature description>`.
2. Explain the use case, affected campus stakeholders (students, faculty, administrators), and proposed technical approach.

### Submitting Code
1. Branch from `main` using standard naming conventions:
   - `feature/<feature-name>`
   - `fix/<bug-name>`
   - `docs/<doc-name>`
2. Follow commit message rules outlined in [Git Workflow](file:///run/media/rudra/534a134c-69cb-49e5-9a9c-284e9ad8ee1b/NextCampus/docs/GIT_WORKFLOW.md).
3. Ensure automated tests pass:
   ```bash
   npm test
   ```
4. Ensure the frontend builds cleanly without errors:
   ```bash
   npm run build
   ```
5. Submit a Pull Request targeting `main`.

---

## 4. Coding & Design Standards

### Frontend (React + Vanilla CSS)
- **Design System**: Use the established 5-color dark Stitch palette and design tokens defined in `src/index.css`.
  - Licorice: `#191516` (deep background)
  - Raisin Black: `#382E31` (surface card container)
  - Amaranth Purple: `#AC274F` (primary brand accent)
  - Blush: `#EB638B` (interactive highlight)
  - Misty Rose: `#FFD9DA` (soft contrast text & badges)
- **Styling**: Use Vanilla CSS or modular scoped classes. Do not introduce TailwindCSS or heavy UI component frameworks unless agreed upon by core maintainers.
- **Components**: Place reusable visual elements in `src/components/` and top-level pages in `src/pages/`.
- **Forms**: Always provide client-side input validation with friendly error states.

### Backend (Express + Node.js)
- **Dual API Support**: When adding new routes, register them in `mountAll()` in `server/index.js` to ensure both `/api/v1` and `/api` prefixes work seamlessly.
- **Dual Persistence**: Follow the existing dual-persistence pattern:
  ```javascript
  if (mongoose.connection.readyState === 1) {
    return await Model.find();
  }
  return inMemoryStore;
  ```
- **Error Handling**: Use Express standard error middlewares with structured JSON error responses (`{ success: false, message: "..." }`).

---

## 5. Testing Requirements

- Any new backend endpoint or core business logic workflow must include test assertions in `tests/master_audit.test.js` or a dedicated test file in `tests/`.
- All PRs must maintain 100% test pass rate (`10/10 test suites passing`).

---

## 6. Review Process

- Pull requests are reviewed by repository maintainers.
- Reviews verify code style, test coverage, accessibility (WCAG 2.1 AA), responsive layouts, and architectural alignment.
- Once approved, commits are squashed and merged into `main`.

---

## 7. Related Documentation
- [Git Workflow](file:///run/media/rudra/534a134c-69cb-49e5-9a9c-284e9ad8ee1b/NextCampus/docs/GIT_WORKFLOW.md)
- [Development Guide](file:///run/media/rudra/534a134c-69cb-49e5-9a9c-284e9ad8ee1b/NextCampus/docs/DEVELOPMENT_GUIDE.md)
- [Design System](file:///run/media/rudra/534a134c-69cb-49e5-9a9c-284e9ad8ee1b/NextCampus/docs/DESIGN_SYSTEM.md)
