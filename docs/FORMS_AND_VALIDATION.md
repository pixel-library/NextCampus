# Forms & Validation Architecture

> **Document:** `docs/FORMS_AND_VALIDATION.md`  
> **Last Reviewed:** 2026-10-10  
> **Scope:** Client-Side and Server-Side Validation Rules Across All Form Workflows

---

## 1. Validation Philosophy

NextCampus enforces **Dual-Layer Validation**:
1. **Client-Side (Immediate Feedback)**: Validates input length, email patterns, password complexity, and required fields before making network requests.
2. **Server-Side (Security & Data Integrity)**: Re-validates every field using Mongoose schema constraints and middleware checks, returning structured error messages.

---

## 2. Key Form Specifications

### 1. Sign In Form (`AuthPage.jsx`)
* **Inputs**: Institutional Email or Student Roll ID (`signInIdentifier`), Password (`signInPassword`), Remember Device toggle.
* **Validation**:
  - Email/ID non-empty check.
  - Password non-empty check.
  - Submits to `POST /api/v1/auth/login`.

### 2. Registration Form (`AuthPage.jsx`)
* **Inputs**: Full Name, Email, Student Roll ID, Department, Cohort, Password, Terms agreement checkbox.
* **Validation**:
  - Name: Minimum 2 characters.
  - Email: Valid email format (`^[^\s@]+@[^\s@]+\.[^\s@]+$`).
  - Password: Minimum 6 characters (interactive strength meter labels: Required, Weak, Moderate, Institutional Strength).
  - Terms: Mandatory checkbox checked.
  - Role: Server strictly overrides to `'student'`.

### 3. NextCampus Care Complaint Form (`CareComplaints.jsx`)
* **Inputs**: Category, Priority, Building, Room Number, Title, Description, Attachment upload.
* **Validation**:
  - Title: Minimum 5 characters.
  - Description: Minimum 10 characters.
  - Category: Must match enum (`av`, `electrical`, `hvac`, `plumbing`, etc.).
  - File Attachment: Maximum 10MB size, restricted to image formats.

### 4. Admin Facility GIS Form (`CampusMap.jsx`)
* **Inputs**: Facility Name, Code, Category, Department, Description, Coordinates (X, Y), Dimensions (Width, Height), Operating Hours.
* **Validation**:
  - Facility Code: Required, uppercase normalized (`A-01`, `B-02`).
  - Coordinates: Numeric bounds check within SVG canvas (`20 <= X <= 1500`, `20 <= Y <= 900`).

---

## 3. Server-Side Schema Validation Example

```javascript
// server/models/Complaint.js
title: { type: String, required: [true, 'Complaint title is required'] },
category: {
  type: String,
  enum: ['infrastructure', 'network', 'cleanliness', 'electrical', 'academic', 'av', 'plumbing', 'hvac', 'furniture', 'sanitation', 'other'],
  required: true
},
priority: {
  type: String,
  enum: ['low', 'medium', 'high', 'critical', 'urgent'],
  default: 'medium'
}
```

---

## 4. Related Documentation
* [ERROR_HANDLING.md](ERROR_HANDLING.md) — How validation errors are formatted.
* [SECURITY.md](SECURITY.md) — Sanitization and XSS prevention.
