# NextCampus Python FastAPI Backend

High-performance, asynchronous REST API backend for **NextCampus — The Next Generation of Smart Campuses**, built with **Python 3.11**, **FastAPI**, **Motor (MongoDB)**, and **Pydantic v2**.

## Architecture & Layout

```text
backend/
├── app/
│   ├── main.py              # Application entrypoint & ASGI router
│   ├── core/
│   │   ├── config.py        # Centralized Pydantic settings
│   │   ├── security.py      # Bcrypt password hashing & PyJWT tokens
│   │   └── logging.py       # Structured logging setup
│   ├── db/
│   │   ├── connection.py    # Motor async MongoDB client & dual-mode store
│   │   └── seed_data.py     # Canonical seed datasets for campus GIS & rooms
│   ├── schemas/             # Typed Pydantic request/response models
│   ├── services/            # Business domain logic (Auth, Care, Rooms, etc.)
│   ├── api/
│   │   ├── deps.py          # JWT authentication and RBAC dependencies
│   │   ├── router.py        # Unified API router
│   │   └── routes/          # Domain-specific route modules
│   └── utils/
│       └── helpers.py       # Response envelopes & MongoDB BSON serializers
├── tests/
│   ├── conftest.py          # PyTest client & fixtures
│   └── test_all_workflows.py # Full integration & security test suite
├── requirements.txt
├── .env.example
└── README.md
```

## Quickstart

### 1. Create Virtual Environment & Install Dependencies
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Run Development Server
```bash
uvicorn backend.app.main:app --reload --host 127.0.0.1 --port 5000
```
Interactive OpenAPI documentation is available at:
`http://127.0.0.1:5000/docs`

### 4. Run Automated Test Suite
```bash
PYTHONPATH=. ./backend/.venv/bin/pytest backend/tests -v
```
