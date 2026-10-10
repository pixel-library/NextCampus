# System Data Flow & Lifecycles

> **Document:** `docs/DATA_FLOW.md`  
> **Last Reviewed:** 2026-10-10  
> **Scope:** End-to-End Sequence Diagrams for Authentication, Wayfinding, IoT Telemetry, and Care Triage

---

## 1. Authentication & Session Initialization Lifecycle

```mermaid
sequenceDiagram
    autonumber
    actor User as Student / Administrator
    participant Page as AuthPage.jsx
    participant Ctx as AuthContext.jsx
    participant Client as api.js
    participant Server as server/routes/auth.routes.js
    participant Service as auth.service.js
    participant DB as MongoDB / In-Memory

    User->>Page: Enters Email / Roll ID & Password
    Page->>Ctx: login(identifier, password)
    Ctx->>Client: api.post('/auth/login', payload)
    Client->>Server: HTTP POST /api/v1/auth/login
    Server->>Service: loginUser(lookup, password)
    Service->>DB: Find user by email or studentId (select: +password)
    DB-->>Service: User Document
    Service->>Service: bcrypt.compare(password, user.password)
    alt Password Invalid
        Service-->>Server: Throw "Invalid credentials provided."
        Server-->>Client: HTTP 401 Unauthorized
        Client-->>Page: Displays error feedback
    else Password Valid
        Service->>Service: generateToken({ id, role, email })
        Service-->>Server: { user: sanitized, token }
        Server-->>Client: HTTP 200 OK
        Client-->>Ctx: Saves nextcampus_token to localStorage
        Ctx->>Ctx: setUser(user)
        Ctx-->>Page: Sets isAuthenticated = true
        Page->>User: Redirects to /dashboard (Student) or /admin (Admin)
    end
```

---

## 2. Interactive Campus GIS & Map Wayfinding Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as Student / Visitor
    participant Map as CampusMap.jsx
    participant Client as api.js
    participant API as campus.controller.js
    participant Svc as campus.service.js
    participant DB as MongoDB / In-Memory

    User->>Map: Navigates to /campus-map
    Map->>Client: api.get('/campus/locations')
    Client->>API: HTTP GET /api/v1/campus/locations
    API->>Svc: getAllLocations()
    Svc->>DB: Location.find({})
    DB-->>Svc: Array of Campus Buildings
    Svc-->>API: Enriched locations with coordinates { x, y }
    API-->>Client: HTTP 200 OK
    Client-->>Map: Merges live coordinates into vector SVG canvas
    User->>Map: Selects Building (e.g. Alan Turing Hall)
    Map->>Map: Highlights SVG marker & renders turn-by-turn drawer
    User->>Map: Toggles Mode (Walk / Step-Free Wheelchair / EV Shuttle)
    Map->>Map: Recomputes path polyline and travel ETA
```

---

## 3. Incident Triage & Dual-Note Complaint Lifecycle (NextCampus Care)

```mermaid
sequenceDiagram
    autonumber
    actor Student as Student Reporter
    actor Admin as Care Administrator
    participant Client as api.js
    participant CareAPI as care.controller.js
    participant CareSvc as care.service.js
    participant DB as Complaint Model

    Student->>Client: Lodges Complaint ("Projector screen calibration lost in B-204")
    Client->>CareAPI: POST /api/v1/care/complaints (Bearer Student Token)
    CareAPI->>CareSvc: createComplaint(payload)
    CareSvc->>CareSvc: Check learning space -> Assign Tier 1 SLA (<45m)
    CareSvc->>DB: Complaint.create({ ticketId: #NC-9402, status: 'open', ... })
    DB-->>CareAPI: Saved Complaint
    CareAPI-->>Student: Ticket confirmed with live SLA timer

    Admin->>Client: Views /admin/complaints
    Client->>CareAPI: GET /api/v1/care/complaints (Bearer Admin Token)
    CareAPI->>CareSvc: getAllComplaints(includeInternal=true)
    CareSvc-->>Admin: Returns complaints with internalNotes
    Admin->>Client: Adds Internal Engineering Note & Assigns Marcus Vance
    Client->>CareAPI: POST /api/v1/care/complaints/:id/internal-notes
    CareAPI->>CareSvc: addInternalNote(note)
    CareSvc->>DB: Append to internalNotes array

    Student->>Client: Checks Ticket Status
    Client->>CareAPI: GET /api/v1/care/complaints/:id (Bearer Student Token)
    CareAPI->>CareSvc: getComplaintById(id, includeInternal=false)
    CareSvc->>CareSvc: Delete internalNotes from payload
    CareSvc-->>Student: Displays public updates only (Privacy Preserved)
```

---

## 4. AI Assistant Multi-Intent Query Processing

```mermaid
sequenceDiagram
    autonumber
    actor User as User Query
    participant Chat as AiAssistant.jsx
    participant Client as api.js
    participant AiAPI as ai.controller.js
    participant AiSvc as ai.service.js
    participant Gemini as Google Gemini 1.5 Flash

    User->>Chat: Asks "How do I reach Turing B-204 from Library?"
    Chat->>Client: api.post('/ai/query', { prompt })
    Client->>AiAPI: POST /api/v1/ai/query
    AiAPI->>AiSvc: processAiQuery(prompt)
    alt GEMINI_API_KEY Available
        AiSvc->>Gemini: POST generateContent (System Prompt + Student Query)
        Gemini-->>AiSvc: Generative Text Response
    else Offline / Simulated Intelligence
        AiSvc->>AiSvc: Query Intent Classifier (12 Domains)
        AiSvc->>AiSvc: Resolve Spatial Graph & IoT Telemetry
    end
    AiSvc-->>AiAPI: { reply, thought, richCards, suggestedAction }
    AiAPI-->>Client: HTTP 200 OK
    Client-->>Chat: Renders AI Bubble, Thought Accordion & Interactive Route Card
    User->>Chat: Clicks "Open in Campus Map" on Route Card
    Chat->>Chat: Navigates directly to /campus-map?bldg=turing
```

---

## 5. Related Documentation
* [ARCHITECTURE.md](ARCHITECTURE.md) — System layers and boundaries.
* [BUSINESS_LOGIC.md](BUSINESS_LOGIC.md) — Rules governing these lifecycles.
* [API_REFERENCE.md](API_REFERENCE.md) — Endpoints executing these requests.
