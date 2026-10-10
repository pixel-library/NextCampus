# Installation & Setup Guide

> **Document:** `docs/INSTALLATION.md`  
> **Last Reviewed:** 2026-10-10  
> **Scope:** Workstation Prerequisites, Environment File Setup, and Verification

---

## 1. System Prerequisites

Before running NextCampus, ensure your workstation satisfies these prerequisites:

* **Node.js**: `v18.18.0` or higher (`v20+ LTS` recommended). Check with `node -v`.
* **NPM**: `v9.0.0` or higher. Check with `npm -v`.
* **MongoDB (Optional)**: `v6.0+` or `v7.0+`. *Note: If MongoDB is not running locally, the platform will automatically operate using its in-memory store.*
* **OS**: Linux (tested on Ubuntu, Arch, Fedora), macOS, or Windows (WSL2 recommended).

---

## 2. Step-by-Step Installation

### Step 1: Clone Repository
```bash
git clone git@github.com:pixel-library/NextCampus.git
cd NextCampus
```

### Step 2: Install Node Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure `.env` contains:
```ini
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/nextcampus
JWT_SECRET=nextcampus_dev_secret_key_2026
JWT_EXPIRES_IN=7d
VITE_API_URL=http://localhost:5000/api/v1
```

### Step 4: Launch Concurrent Development Server
```bash
npm run dev
```

### Step 5: Verify in Browser
Open your browser to:
* **Frontend**: `http://localhost:3000`
* **Health Check API**: `http://localhost:5000/api/health`

---

## 3. Related Documentation
* [DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md) — Available commands and daily workflow.
* [ENVIRONMENT_VARIABLES.md](ENVIRONMENT_VARIABLES.md) — Configuration variable dictionary.
