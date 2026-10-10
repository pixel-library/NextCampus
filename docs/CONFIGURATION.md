# Project Configuration Reference

> **Document:** `docs/CONFIGURATION.md`  
> **Last Reviewed:** 2026-10-10  
> **Scope:** Configuration Files (`package.json`, `vite.config.js`, `.gitignore`)

---

## 1. Vite Configuration (`vite.config.js`)

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
```

### Key Behaviors
1. **Frontend Port**: Binds Vite local development server strictly to port `3000`.
2. **Reverse Proxy**: Proxies all requests beginning with `/api` (including `/api/v1` and `/api/health`) to `http://localhost:5000`. This enables same-origin fetches in the browser, eliminating cross-origin preflight delays and bypassing browser shield port blocking.

---

## 2. Git Exclusion Rules (`.gitignore`)

Excludes generated artifacts, sensitive local keys, and uploaded runtime binaries:

```text
node_modules/
.env
dist/
dist-ssr/
*.local
server/uploads/*
!server/uploads/.gitkeep
.DS_Store
```

---

## 3. Related Documentation
* [ENVIRONMENT_VARIABLES.md](ENVIRONMENT_VARIABLES.md) — Runtime environment configuration.
* [DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md) — Developer scripts.
