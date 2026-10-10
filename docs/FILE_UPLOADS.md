# File Uploads & Attachment Architecture

> **Document:** `docs/FILE_UPLOADS.md`  
> **Last Reviewed:** 2026-10-10  
> **Scope:** Multer Middleware, Storage Configuration, File Restrictions, and Serving

---

## 1. Upload Architecture Overview

NextCampus handles file attachments (e.g. photos of broken classroom equipment, facility blueprints) via Multer:

```text
server/
├── middleware/
│   └── upload.js         # DiskStorage configuration & fileFilter validation
└── uploads/              # Local storage destination (Git-ignored)
```

---

## 2. Configuration & Security Constraints (`server/middleware/upload.js`)

* **Storage Engine**: `multer.diskStorage` saving files to `server/uploads/` with a unique timestamp prefix (`Date.now() + '-' + originalname`).
* **Maximum File Size**: `10MB` (`limits: { fileSize: 10 * 1024 * 1024 }`).
* **Permitted MIME Types**:
  - `image/jpeg`
  - `image/png`
  - `image/webp`
  - `image/gif`
* **Static Serving**: Express binds `/uploads` in `server/index.js` via `express.static(uploadPath)`, allowing authenticated clients to retrieve image attachments directly via URL.

---

## 3. Client-Side Multipart Integration (`src/services/api.js`)

In `src/services/api.js`:

```javascript
// If FormData, let the browser calculate and set the multipart/form-data boundary
if (options.body instanceof FormData) {
  delete headers['Content-Type'];
}
```

This prevents common bugs where manual `'Content-Type': 'multipart/form-data'` headers strip out the required multipart boundary string.

---

## 4. Related Documentation
* [SECURITY.md](SECURITY.md) — Upload attack surface mitigations.
* [BACKEND.md](BACKEND.md) — Express middleware pipeline.
