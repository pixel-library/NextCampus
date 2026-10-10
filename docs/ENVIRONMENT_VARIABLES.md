# Environment Variables & Configuration Keys

> **Document:** `docs/ENVIRONMENT_VARIABLES.md`  
> **Last Reviewed:** 2026-10-10  
> **Scope:** Complete Dictionary of Environment Variables and Default Fallbacks

---

## 1. Environment Variables Dictionary

| Variable Name | Required? | Default Fallback | Layer | Purpose & Usage |
| :--- | :---: | :--- | :--- | :--- |
| `PORT` | Optional | `5000` | Backend | HTTP listener port for Express REST API server. |
| `NODE_ENV` | Optional | `development` | Backend | Sets runtime mode (`development`, `production`, `test`). Masks 500 error stack traces in production. |
| `MONGODB_URI` | Optional | `mongodb://localhost:27017/nextcampus` | Backend | Connection string for MongoDB database instance. If offline, in-memory store activates. |
| `JWT_SECRET` | Recommended | `nextcampus_dev_secret_key_2026` | Backend | Secret key used to sign and verify HS256 authentication tokens. Change in production. |
| `JWT_EXPIRES_IN` | Optional | `7d` | Backend | Token validity period before requiring re-authentication. |
| `VITE_API_URL` | Optional | `http://localhost:5000/api/v1` | Frontend | Target API server base URL used by `src/services/api.js`. |
| `GEMINI_API_KEY` | Optional | `undefined` | Backend | Google Gemini API key enabling live generative model responses on `/api/v1/ai/query`. |

---

## 2. Sample `.env` Configuration File

```ini
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/nextcampus
JWT_SECRET=nextcampus_dev_secret_key_2026
JWT_EXPIRES_IN=7d
VITE_API_URL=http://localhost:5000/api/v1

# Optional AI Provider Key
GEMINI_API_KEY=your_gemini_api_key_here
```

---

## 3. Related Documentation
* [CONFIGURATION.md](CONFIGURATION.md) — Tooling configuration.
* [SECURITY.md](SECURITY.md) — Secrets management.
