# Debugging Runbook & Diagnostics

> **Document:** `docs/DEBUGGING.md`  
> **Last Reviewed:** 2026-10-10  
> **Scope:** Common Developer Failure Scenarios, Log Locations, and Network Inspection

---

## 1. Diagnostic Decision Tree

```mermaid
graph TD
    Issue[Issue Detected] --> Type{Where is error occurring?}
    Type -->|Frontend Browser| B_Console[Inspect Browser DevTools Console]
    Type -->|Backend Terminal| S_Logs[Inspect Express Terminal / Nodemon]
    Type -->|Database Queries| D_Mongoose[Inspect Mongoose Connection Logs]
    
    B_Console -->|API request failed| Check_URL[Verify VITE_API_URL and /v1 prefix]
    B_Console -->|Blank Screen| Check_Route[Check AppLayout / Auth State]
    
    S_Logs -->|EADDRINUSE 5000| Kill_Port[lsof -ti:5000 | xargs kill -9]
    S_Logs -->|DB Query fallback| Check_Mongo[MongoDB Daemon Offline - Memory Active]
```

---

## 2. Common Scenarios & Resolutions

### 1. `API request failed` on Sign In / Register
* **Root Cause**: `VITE_API_URL` was configured as `/api` without `/v1`, or browser privacy shields (e.g. Brave) blocked loopback cross-origin requests.
* **Resolution**: Verified that `server/index.js` mounts both `/api/v1` and `/api`, and `src/services/api.js` has automatic proxy fallback.

### 2. Port Conflict (`EADDRINUSE: 5000`)
* **Diagnostic**: Another node process is occupying port 5000.
* **Resolution**:
  ```bash
  lsof -ti:5000 | xargs kill -9
  ```

### 3. Missing Lucide Icon Crash (`ReferenceError: Icon is not defined`)
* **Diagnostic**: Icon used in JSX without an explicit named import from `lucide-react`.
* **Resolution**: Add the icon name to the top `import { ... } from 'lucide-react'` block.

---

## 3. Related Documentation
* [TROUBLESHOOTING.md](TROUBLESHOOTING.md) — Broader operational issues.
* [TESTING.md](TESTING.md) — Automated audit tests.
