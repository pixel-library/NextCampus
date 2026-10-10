import time
from fastapi.testclient import TestClient

def test_health_check(client: TestClient):
    """Test health endpoint on both /api/health and /api/v1/health."""
    res1 = client.get("/api/health")
    assert res1.status_code == 200
    data1 = res1.json()
    assert data1["status"] == "online"
    assert data1["service"] == "NextCampus API Server"

    res2 = client.get("/api/v1/health")
    assert res2.status_code == 200
    assert res2.json()["status"] == "online"

def test_auth_workflow(client: TestClient):
    """Test registration, forced student role, password hashing, and login."""
    test_email = f"audit_py_student_{int(time.time() * 1000)}@nextcampus.edu"
    test_pass = "SecurePass2026!"

    # 1. Registration with malicious role escalation attempt
    reg_res = client.post(
        "/api/v1/auth/register",
        json={
            "name": "Audit Student",
            "email": test_email,
            "password": test_pass,
            "role": "admin",  # Attempting escalation
            "studentId": "2026-PY-001",
        },
    )
    assert reg_res.status_code == 201
    body = reg_res.json()
    assert body["success"] is True
    user = body["data"]["user"]
    assert user["role"] == "student"  # Forced to student
    assert "password" not in user
    token = body["data"]["token"]
    assert token is not None

    # 2. Login with valid credentials
    login_res = client.post(
        "/api/v1/auth/login",
        json={"email": test_email, "password": test_pass},
    )
    assert login_res.status_code == 200
    login_data = login_res.json()["data"]
    assert login_data["user"]["email"] == test_email

    # 3. Login with invalid credentials
    bad_login = client.post(
        "/api/v1/auth/login",
        json={"email": test_email, "password": "WrongPassword99!"},
    )
    assert bad_login.status_code in [400, 401]

    # 4. Get Current User (/auth/me)
    me_res = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert me_res.status_code == 200
    assert me_res.json()["data"]["user"]["email"] == test_email

    # 5. Profile update
    prof_res = client.put(
        "/api/v1/auth/profile",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "preferredName": "Auditor",
            "skills": ["Python 3.11", "FastAPI"],
            "preferences": {
                "accessibility": {"highContrast": True},
            },
        },
    )
    assert prof_res.status_code == 200
    assert prof_res.json()["data"]["user"]["preferredName"] == "Auditor"
    assert prof_res.json()["data"]["user"]["preferences"]["accessibility"]["highContrast"] is True

    # 6. Change Password
    new_pass = "BrandNewPass2026!"
    cp_res = client.put(
        "/api/v1/auth/change-password",
        headers={"Authorization": f"Bearer {token}"},
        json={"currentPassword": test_pass, "newPassword": new_pass},
    )
    assert cp_res.status_code == 200

    # 7. Verify new login
    relogin = client.post(
        "/api/v1/auth/login",
        json={"email": test_email, "password": new_pass},
    )
    assert relogin.status_code == 200

def test_campus_facility_workflow(client: TestClient):
    """Test campus facilities, GIS search, and dependent cascade deletion."""
    # Login as admin
    admin_login = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@nextcampus.edu", "password": "adminpassword123"},
    )
    assert admin_login.status_code == 200
    admin_token = admin_login.json()["data"]["token"]

    # 1. Get all locations
    locs_res = client.get("/api/v1/campus/locations")
    assert locs_res.status_code == 200
    locs = locs_res.json()["data"]
    assert len(locs) > 0

    # 2. Lookup by code
    first_code = locs[0]["code"]
    code_res = client.get(f"/api/v1/campus/locations/{first_code}")
    assert code_res.status_code == 200
    assert code_res.json()["data"]["code"] == first_code

    # 3. Create new building facility
    test_code = "CYBER-99"
    create_res = client.post(
        "/api/v1/campus/locations",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={
            "name": "Cybernetics Wing",
            "code": test_code,
            "category": "academic",
            "precinct": "North Quadrangle",
            "totalFloors": 3,
        },
    )
    assert create_res.status_code == 201
    created_bld = create_res.json()["data"]

    # 4. Create linked room
    room_res = client.post(
        "/api/v1/smartrooms/rooms",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={
            "roomNumber": "CYBER-101",
            "building": "Cybernetics Wing",
            "buildingCode": test_code,
            "capacity": 30,
        },
    )
    assert room_res.status_code == 201

    # 5. Non-cascade deletion should return HTTP 409 Conflict
    del_conflict = client.delete(
        f"/api/v1/campus/locations/{created_bld['id']}?cascade=false",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert del_conflict.status_code == 409
    assert del_conflict.json()["conflict"] is True

    # 6. Cascade deletion should succeed
    del_cascade = client.delete(
        f"/api/v1/campus/locations/{created_bld['id']}?cascade=true",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert del_cascade.status_code == 200
    assert del_cascade.json()["data"]["deleted"] is True

def test_smartrooms_workflow(client: TestClient):
    """Test smartroom discovery and filtering."""
    rooms_res = client.get("/api/v1/smartrooms")
    assert rooms_res.status_code == 200
    rooms = rooms_res.json()["data"]
    assert len(rooms) > 0
    assert "roomNumber" in rooms[0]
    assert "capacity" in rooms[0]

    # Test alias /rooms
    rooms_alias = client.get("/api/rooms")
    assert rooms_alias.status_code == 200
    assert len(rooms_alias.json()["data"]) > 0

def test_care_complaints_dual_note_privacy(client: TestClient):
    """Test complaint lifecycle and strict separation of student vs internal notes."""
    # Student login
    stud_login = client.post(
        "/api/v1/auth/login",
        json={"email": "rudra@nextcampus.edu", "password": "password123"},
    )
    assert stud_login.status_code == 200
    student_token = stud_login.json()["data"]["token"]

    # Admin login
    admin_login = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@nextcampus.edu", "password": "adminpassword123"},
    )
    assert admin_login.status_code == 200
    admin_token = admin_login.json()["data"]["token"]

    # 1. Create complaint as student
    create_res = client.post(
        "/api/v1/care/complaints",
        headers={"Authorization": f"Bearer {student_token}"},
        json={
            "title": "Interactive Screen Touch Calibration Lost",
            "description": "Sensors fail to calibrate in Room B-204.",
            "category": "academic",
            "location": "Alan Turing Hall - Room B-204",
            "priority": "high",
        },
    )
    assert create_res.status_code == 201
    ticket = create_res.json()["data"]
    ticket_id = ticket["id"]

    # 2. Assign staff as admin
    assign_res = client.post(
        f"/api/v1/care/complaints/{ticket_id}/assign",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={
            "assignedTo": "staff_1",
            "assignedToName": "Marcus Vance",
        },
    )
    assert assign_res.status_code == 200
    assert assign_res.json()["data"]["assignedToName"] == "Marcus Vance"

    # 3. Add private internal note as admin
    note_res = client.post(
        f"/api/v1/care/complaints/{ticket_id}/internal-notes",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={"note": "CONFIDENTIAL: Hardware firmware chip re-flash required."},
    )
    assert note_res.status_code == 200

    # 4. Add public update
    pub_res = client.post(
        f"/api/v1/care/complaints/{ticket_id}/public-updates",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={"message": "Technician dispatched with diagnostic toolkit."},
    )
    assert pub_res.status_code == 200

    # 5. Retrieve as student: internalNotes MUST be completely absent
    student_view = client.get(
        f"/api/v1/care/complaints/{ticket_id}",
        headers={"Authorization": f"Bearer {student_token}"},
    )
    assert student_view.status_code == 200
    s_doc = student_view.json()["data"]
    assert "internalNotes" not in s_doc or s_doc.get("internalNotes") is None
    assert len(s_doc.get("updates", [])) > 0

    # 6. Retrieve as admin: internalNotes MUST be present
    admin_view = client.get(
        f"/api/v1/care/complaints/{ticket_id}",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert admin_view.status_code == 200
    a_doc = admin_view.json()["data"]
    assert len(a_doc.get("internalNotes", [])) > 0
    assert any("CONFIDENTIAL" in n["note"] for n in a_doc["internalNotes"])

def test_skill_projects_duplicate_join(client: TestClient):
    """Test SkillCampus collaborative projects and duplicate join prevention."""
    stud_login = client.post(
        "/api/v1/auth/login",
        json={"email": "rudra@nextcampus.edu", "password": "password123"},
    )
    student_token = stud_login.json()["data"]["token"]

    # 1. Create project
    proj_res = client.post(
        "/api/v1/skillcampus/projects",
        headers={"Authorization": f"Bearer {student_token}"},
        json={
            "title": "Autonomous Campus Quad Rover Navigation",
            "description": "Building ROS2 SLAM stack.",
            "tags": ["ROS2", "Python"],
            "teamSize": 4,
        },
    )
    assert proj_res.status_code == 201
    proj_id = proj_res.json()["data"]["id"]

    # 2. Try duplicate join as the creator
    dup_res = client.post(
        f"/api/v1/skillcampus/projects/{proj_id}/join",
        headers={"Authorization": f"Bearer {student_token}"},
    )
    assert dup_res.status_code == 400
    assert "already a member" in dup_res.json()["message"]

def test_sustainability_metrics(client: TestClient):
    """Test EcoCampus metrics."""
    res = client.get("/api/v1/sustainability/metrics")
    assert res.status_code == 200
    metrics = res.json()["data"]
    assert len(metrics) > 0
    assert any(m["metricName"] == "Campus Sustainability Score" for m in metrics)

def test_admin_stats(client: TestClient):
    """Test administrative dashboard metrics with RBAC check."""
    # Regular student cannot access
    stud_login = client.post(
        "/api/v1/auth/login",
        json={"email": "rudra@nextcampus.edu", "password": "password123"},
    )
    student_token = stud_login.json()["data"]["token"]

    forbidden_res = client.get(
        "/api/v1/admin/stats",
        headers={"Authorization": f"Bearer {student_token}"},
    )
    assert forbidden_res.status_code == 403

    # Admin access
    admin_login = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@nextcampus.edu", "password": "adminpassword123"},
    )
    admin_token = admin_login.json()["data"]["token"]

    admin_res = client.get(
        "/api/v1/admin/stats",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert admin_res.status_code == 200
    stats = admin_res.json()["data"]
    assert "population" in stats
    assert "rooms" in stats
    assert "complaints" in stats

def test_ai_query(client: TestClient):
    """Test AI assistant multi-intent spatial reasoning."""
    query_res = client.post(
        "/api/v1/ai/query",
        json={"prompt": "Where is Turing Hall Room B-204?"},
    )
    assert query_res.status_code == 200
    data = query_res.json()["data"]
    assert "Turing Hall" in data["reply"] or "B-204" in data["reply"]
    assert data["category"] == "navigation"
    assert len(data["richCards"]) > 0
