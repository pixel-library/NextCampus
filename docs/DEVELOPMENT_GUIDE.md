# Developer Guide & Workstation Handbook

> **Document:** `docs/DEVELOPMENT_GUIDE.md`  
> **Last Reviewed:** 2026-10-10  
> **Scope:** Day-to-Day Engineering Workflows, Startup Commands, and Conventions

---

## 1. Quick Start Commands

```bash
# 1. Clone repository
git clone git@github.com:pixel-library/NextCampus.git
cd NextCampus

# 2. Install dependencies
npm install

# 3. Launch full-stack concurrent development server
npm run dev
```

* Express backend starts on `http://localhost:5000`.
* Vite frontend starts on `http://localhost:3000`.
* Concurrently streams logs from both processes into your active terminal.

---

## 2. Available NPM Scripts (`package.json`)

| Command | Action | Process Description |
| :--- | :--- | :--- |
| `npm run dev` | Full-Stack Dev | Executes `concurrently "npm run server" "npm run client"`. |
| `npm run client` | Frontend Only | Starts Vite development server at `http://localhost:5173`. |
| `npm run server` | Backend (FastAPI) | Starts FastAPI backend via `./backend/.venv/bin/uvicorn` at `http://localhost:5000`. |
| `npm run server:legacy` | Backend (Express) | Starts Node.js Express backend using `nodemon` at `http://localhost:5000`. |
| `npm start` | Production Backend| Starts production FastAPI backend listening on `0.0.0.0:5000`. |
| `npm run build` | Production Bundle| Compiles minified React SPA into `dist/` via Vite Rollup. |
| `npm run preview`| Preview Build | Starts local static server previewing `dist/` bundle. |
| `npm test` | Automated Tests | Executes both PyTest suite (`backend/tests`) and Node master audit (`tests/`). |
| `npm run test:python` | Python Tests | Runs PyTest test suite directly via `./backend/.venv/bin/pytest`. |

---

## 3. Code Conventions & Coding Standards

1. **Architecture Separation**:
   - UI logic belongs in `src/pages/` and `src/components/`.
   - Business rules belong in `server/services/`.
   - Controllers only translate HTTP payloads into service calls.
2. **API Communication**:
   - Always import and call methods on `src/services/api.js` (`api.get`, `api.post`, `api.put`, `api.delete`).
   - Never call `fetch()` directly in page components.
3. **Styling**:
   - Use CSS custom property tokens defined in `src/index.css` (`var(--bg-canvas)`, `var(--brand-primary)`, `var(--border-subtle)`).
   - Avoid hardcoding arbitrary hex codes.

---

## 4. Related Documentation
* [INSTALLATION.md](INSTALLATION.md) — Prerequisites and environment setup.
* [TESTING.md](TESTING.md) — Running automated test suites.
* [GIT_WORKFLOW.md](GIT_WORKFLOW.md) — Branching and commit policies.
