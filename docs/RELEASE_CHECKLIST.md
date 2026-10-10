# Production Release Checklist

*Last Reviewed: October 2026*

This checklist defines the mandatory operational, functional, and security verification steps required before tagging, building, and deploying a new release of **NextCampus**.

---

## 1. Pre-Release Code Quality Checks

- [ ] **Clean Git Working Tree**:
  - No untracked files or unintentional modifications (`git status` is clean).
  - Branch is up to date with latest `main`.
- [ ] **Automated Test Suite**:
  - Run full test suite: `npm test`
  - Ensure all 10 full-stack test suites pass with 0 failures:
    ```bash
    # Expected output:
    # Passed: 10
    # Failed: 0
    ```
- [ ] **Production Build Compilation**:
  - Run production build: `npm run build`
  - Ensure Vite bundle compiles with zero syntax errors, missing asset imports, or unhandled exceptions.

---

## 2. Security and Secret Sanitation

- [ ] **No Committed Secrets**:
  - Ensure `.env` is NOT tracked in git (`git check-ignore .env` returns `.env`).
  - Search repository for accidentally hardcoded credentials:
    - No real `JWT_SECRET` keys committed.
    - No live `GEMINI_API_KEY` credentials checked in.
    - No private Mongo connection strings with plain-text passwords committed.
- [ ] **Dependency Security Audit**:
  - Run `npm audit --omit=dev` and verify no critical vulnerabilities exist in production runtime dependencies.

---

## 3. Configuration and Environment Verification

- [ ] **Production Environment Variables Configured**:
  - `NODE_ENV=production`
  - `PORT=5000` (or assigned cluster port)
  - `JWT_SECRET` set to a cryptographically secure 64+ character string.
  - `MONGODB_URI` set to a resilient production replica set.
  - `GEMINI_API_KEY` configured for live AI Assistant interactions.
  - `CORS_ORIGIN` restricted to the production frontend domain (e.g., `https://nextcampus.edu`).

---

## 4. Full-Stack Functional Verification

Verify each key user journey across the 14 application pages:

### Public & Authentication
- [ ] **Landing Page (`/`)**: Hero banner, campus statistics, news ticker, and navigation links load smoothly.
- [ ] **Authentication (`/auth`)**:
  - Successful student login (`student@nextcampus.edu` / `student123`).
  - Successful admin login (`admin@nextcampus.edu` / `admin123`).
  - Registration of a new student account creates user and issues valid token.

### Student Modules
- [ ] **Student Dashboard (`/dashboard`)**: Class schedule, weather widget, and quick actions render accurately.
- [ ] **Interactive Campus Map (`/campus-map`)**:
  - Map tiles load without grey tiles.
  - Category filters (Academic, Labs, Dining, etc.) filter markers.
  - Route calculation visualizes path between origin and destination.
- [ ] **Campus Directory (`/directory`)**: Search and category filters return buildings and staff cards.
- [ ] **SmartRoom (`/smartroom`)**: Floor plan vector displays correctly; room selection updates environmental telemetry.
- [ ] **Complaint Management (`/complaints`)**: Submitting a maintenance ticket generates a ticket ID and appends to the history list.
- [ ] **NextCampus AI (`/ai-assistant`)**: Conversational input triggers appropriate campus intelligence response with rich action cards.
- [ ] **EcoCampus (`/ecocampus`)**: Solar power, water, and recycling charts display metrics correctly.
- [ ] **SkillCampus (`/skillcampus`)**: Project discovery cards display skills; join requests update project state.
- [ ] **Student Profile (`/profile`)**: Editing student details and avatar updates profile data successfully.

### Administrative Modules
- [ ] **Admin Dashboard (`/admin`)**: Metric tiles, pending complaints counter, and campus occupancy cards render.
- [ ] **Campus Management (`/admin/campus-management`)**: Building/room list loads; adding and editing facilities succeeds.
- [ ] **Complaint Administration (`/admin/complaints`)**: Grievance table displays student submissions; status updates (In Progress, Resolved) persist.
- [ ] **Admin Interactive Map Editor (`/campus-map`)**: Admin toggle unlocks live drag-and-drop marker relocation and 4-way nudge arrows.

---

## 5. Release Tagging and Deployment Steps

1. **Update Documentation**:
   - Update `docs/CHANGELOG.md` with new features, fixes, and release date.
   - Verify all links in `docs/README.md`.
2. **Commit and Tag**:
   ```bash
   git commit -am "chore(release): bump version to v1.1.0"
   git tag -a v1.1.0 -m "Release v1.1.0: Full-stack platform production release"
   git push origin main --tags
   ```
3. **Trigger Production Deployment**:
   - Deploy Docker image or trigger host deployment pipeline.
   - Run health check:
     ```bash
     curl -I https://nextcampus.edu/api/v1/health
     # Expected: HTTP/1.1 200 OK
     ```
4. **Post-Deployment Smoke Test**:
   - Verify browser console displays no critical errors or unhandled promise rejections.
   - Test basic login and map navigation in production environment.

---

## 6. Related Documentation
- [Deployment](file:///run/media/rudra/534a134c-69cb-49e5-9a9c-284e9ad8ee1b/NextCampus/docs/DEPLOYMENT.md)
- [CI/CD](file:///run/media/rudra/534a134c-69cb-49e5-9a9c-284e9ad8ee1b/NextCampus/docs/CI_CD.md)
- [Testing](file:///run/media/rudra/534a134c-69cb-49e5-9a9c-284e9ad8ee1b/NextCampus/docs/TESTING.md)
- [Changelog](file:///run/media/rudra/534a134c-69cb-49e5-9a9c-284e9ad8ee1b/NextCampus/docs/CHANGELOG.md)
