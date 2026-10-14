import pytest
from datetime import datetime, timezone
from fastapi.testclient import TestClient

from backend.app.main import app
from backend.app.core.security import generate_token

@pytest.fixture
def client():
    return TestClient(app)

@pytest.fixture
def student_headers():
    token = generate_token({
        "id": "usr_student_01",
        "sub": "usr_student_01",
        "email": "rakesh@nextcampus.edu",
        "role": "student",
        "department": "Department of Computer Science & Engineering (B.Tech CSE - AI & ML)",
        "semester": "Semester 3",
    })
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture
def admin_headers():
    token = generate_token({
        "id": "usr_admin_01",
        "sub": "usr_admin_01",
        "email": "admin@nextcampus.edu",
        "role": "admin",
        "name": "Campus Administrator",
    })
    return {"Authorization": f"Bearer {token}"}


# ==============================================================================
# PHASE 17.1: INTENT UNDERSTANDING TESTS
# ==============================================================================
def test_intent_phrasings_mess_menu(client):
    """Verify that multiple phrasings of mess menu queries resolve to correct menu responses."""
    phrasings = [
        "Today mess menu",
        "Mess menu today",
        "Mess menu of today",
        "Today's mess menu",
        "What is today's mess menu?",
        "Aaj ka mess menu",
        "Aaj mess mein kya hai?",
        "Tmrw mess menu",
    ]
    for prompt in phrasings:
        resp = client.post("/api/v1/ai/query", json={"prompt": prompt})
        assert resp.status_code == 200, f"Failed on prompt: {prompt}"
        data = resp.json()
        assert data["success"] is True
        reply = data["data"]["reply"]
        assert "menu" in reply.lower() or "breakfast" in reply.lower() or "lunch" in reply.lower() or "dinner" in reply.lower()
        assert data["data"]["category"] == "cafeteria"

def test_intent_specific_meals(client):
    """Verify broad vs specific meal requests."""
    # Specific meal: Lunch
    resp_lunch = client.post("/api/v1/ai/query", json={"prompt": "Today's lunch"})
    assert resp_lunch.status_code == 200
    lunch_data = resp_lunch.json()["data"]
    assert "Lunch" in lunch_data["reply"]

    # Specific meal: Dinner
    resp_dinner = client.post("/api/v1/ai/query", json={"prompt": "Dinner today"})
    assert resp_dinner.status_code == 200
    dinner_data = resp_dinner.json()["data"]
    assert "Dinner" in dinner_data["reply"]

def test_intent_timetable_and_classes(client, student_headers):
    """Verify timetable queries with different phrasings and filters."""
    # General timetable query
    resp1 = client.post("/api/v1/ai/query", json={"prompt": "CSE third sem timetable"})
    assert resp1.status_code == 200
    reply1 = resp1.json()["data"]["reply"]
    assert "Computer Science" in reply1 or "Data Structures" in reply1
    assert "CS301" in reply1

    # Specific day timetable query
    resp2 = client.post("/api/v1/ai/query", json={"prompt": "Show the timetable for Monday"})
    assert resp2.status_code == 200
    reply2 = resp2.json()["data"]["reply"]
    assert "Monday" in reply2

    # Next class query
    resp3 = client.post("/api/v1/ai/query", json={"prompt": "My next class"}, headers=student_headers)
    assert resp3.status_code == 200
    assert resp3.json()["success"] is True

def test_intent_policies_and_map(client):
    """Verify verified policies and navigation queries."""
    # Library timing
    resp_lib = client.post("/api/v1/ai/query", json={"prompt": "Library timing"})
    assert resp_lib.status_code == 200
    assert "Swami Vivekananda" in resp_lib.json()["data"]["reply"]
    assert "24/7" in resp_lib.json()["data"]["reply"]

    # Attendance policy
    resp_att = client.post("/api/v1/ai/query", json={"prompt": "Attendance rule"})
    assert resp_att.status_code == 200
    att_reply = resp_att.json()["data"]["reply"]
    assert "75%" in att_reply
    assert "Medical Condonation" in att_reply

    # Exam date
    resp_exam = client.post("/api/v1/ai/query", json={"prompt": "Exam date"})
    assert resp_exam.status_code == 200
    assert "Mid-Term" in resp_exam.json()["data"]["reply"]

    # Campus map location
    resp_map = client.post("/api/v1/ai/query", json={"prompt": "Where is the library?"})
    assert resp_map.status_code == 200
    assert "Central Library" in resp_map.json()["data"]["reply"]

# ==============================================================================
# PHASE 17.2: CONVERSATIONAL CONTEXT TESTS
# ==============================================================================
def test_conversational_context_mess_followup(client):
    """Test follow-up: User asks for today's menu, then 'What about tomorrow?'."""
    history = [
        {"role": "user", "content": "Today's mess menu"},
        {"role": "assistant", "content": "Here is today's menu...", "intent": "mess_menu", "entities": {"facility": "Central Mess / Aravalli & Meera Bai Dining Hall"}},
    ]
    resp = client.post("/api/v1/ai/query", json={
        "prompt": "What about tomorrow?",
        "conversationHistory": history,
    })
    assert resp.status_code == 200
    data = resp.json()["data"]
    assert data["category"] == "cafeteria"
    assert "menu" in data["reply"].lower()

def test_conversational_context_meal_followup(client):
    """Test follow-up: User asks for 'Today's lunch', then 'And dinner?'."""
    history = [
        {"role": "user", "content": "What's today's lunch?"},
        {"role": "assistant", "content": "Today's Lunch Menu...", "intent": "mess_menu", "entities": {"meal": "lunch"}},
    ]
    resp = client.post("/api/v1/ai/query", json={
        "prompt": "And dinner?",
        "conversationHistory": history,
    })
    assert resp.status_code == 200
    data = resp.json()["data"]
    assert data["category"] == "cafeteria"
    assert "Dinner" in data["reply"]

def test_conversational_context_timetable_refinement(client):
    """Test follow-up: User asks for 'Show me the CSE timetable', then 'Third semester'."""
    history = [
        {"role": "user", "content": "Show me the CSE timetable"},
        {"role": "assistant", "content": "Here is the CSE timetable...", "intent": "timetable", "entities": {"department": "Computer Science & Engineering"}},
    ]
    resp = client.post("/api/v1/ai/query", json={
        "prompt": "Third semester",
        "conversationHistory": history,
    })
    assert resp.status_code == 200
    data = resp.json()["data"]
    assert data["category"] == "schedule"
    assert "Semester 3" in data["reply"]
    assert "CS301" in data["reply"]

# ==============================================================================
# PHASE 17.4: TIMETABLE RETRIEVAL & MANAGEMENT TESTS
# ==============================================================================
def test_timetable_api_query(client):
    """Test GET /api/v1/timetable/query endpoint."""
    resp = client.get("/api/v1/timetable/query?department=Computer%20Science&semester=3&section=A")
    assert resp.status_code == 200
    data = resp.json()
    assert data["success"] is True
    entries = data["data"]["entries"]
    assert len(entries) > 0
    assert any(e["subjectCode"] == "CS301" for e in entries)

def test_timetable_upload_preview_and_atomic_publish(client, admin_headers):
    """Test Admin timetable upload preview, validation, and confirmation publication."""
    csv_sample = (
        "day,code,subject,start,end,faculty,room\n"
        "Monday,CS301,Advanced Algorithms,09:30,10:30,Prof. Ananya Roy,Room B-204\n"
        "Tuesday,CS302,Distributed DB,10:30,11:30,Dr. Sarah Chen,Room B-201\n"
    )

    # 1. Preview upload
    resp_prev = client.post(
        "/api/v1/timetable/upload-preview",
        data={
            "department": "Computer Science & Engineering",
            "semester": 3,
            "section": "A",
            "csvText": csv_sample,
        },
        headers=admin_headers,
    )
    assert resp_prev.status_code == 200
    prev_data = resp_prev.json()["data"]
    assert prev_data["isValid"] is True
    assert prev_data["entriesCount"] == 2

    # 2. Rejection if confirm is False
    resp_no_confirm = client.post(
        "/api/v1/timetable/publish",
        json={
            "department": "Computer Science & Engineering",
            "semester": 3,
            "section": "A",
            "entries": prev_data["entries"],
            "confirm": False,
        },
        headers=admin_headers,
    )
    assert resp_no_confirm.status_code == 400

    # 3. Successful Atomic Publication
    resp_pub = client.post(
        "/api/v1/timetable/publish",
        json={
            "department": "Computer Science & Engineering",
            "semester": 3,
            "section": "A",
            "entries": prev_data["entries"],
            "confirm": True,
            "changeNotes": "Automated Test Publication",
        },
        headers=admin_headers,
    )
    assert resp_pub.status_code == 200
    pub_data = resp_pub.json()["data"]
    assert pub_data["version"] >= 2
    assert pub_data["entriesCount"] == 2

    # 4. Verify AI query immediately reflects the new publication
    resp_ai = client.post("/api/v1/ai/query", json={"prompt": "CSE third sem timetable for Monday"})
    assert resp_ai.status_code == 200
    assert "Advanced Algorithms" in resp_ai.json()["data"]["reply"]

    # 5. Rollback to version 1
    resp_rollback = client.post(
        "/api/v1/timetable/rollback",
        json={
            "department": "Computer Science & Engineering",
            "semester": 3,
            "section": "A",
            "targetVersion": 1,
            "confirm": True,
        },
        headers=admin_headers,
    )
    assert resp_rollback.status_code == 200
    assert resp_rollback.json()["data"]["version"] == 1

# ==============================================================================
# PHASE 17.5: MESS MENU RETRIEVAL & MANAGEMENT TESTS
# ==============================================================================
def test_mess_menu_api_today_and_weekly(client):
    """Test public mess menu endpoints."""
    # Today's menu
    resp_today = client.get("/api/v1/mess/today")
    assert resp_today.status_code == 200
    assert resp_today.json()["success"] is True

    # Weekly menu
    resp_weekly = client.get("/api/v1/mess/weekly")
    assert resp_weekly.status_code == 200
    assert len(resp_weekly.json()["data"]) == 7

def test_mess_menu_upload_preview_and_publish(client, admin_headers):
    """Test Admin mess upload preview and atomic publish."""
    csv_menu = (
        "day,date,breakfast,lunch,snacks,dinner\n"
        "Monday,2026-10-19,Poha/Chai,Rajma Rice/Roti,Samosa/Tea,Paneer/Roti/Sweet\n"
    )
    resp_prev = client.post(
        "/api/v1/mess/upload-preview",
        data={
            "facility": "Central Mess / Aravalli & Meera Bai Dining Hall",
            "csvText": csv_menu,
        },
        headers=admin_headers,
    )
    assert resp_prev.status_code == 200
    prev_data = resp_prev.json()["data"]
    assert prev_data["isValid"] is True
    assert prev_data["daysCount"] == 1

    # Publish with confirm = True
    resp_pub = client.post(
        "/api/v1/mess/publish",
        json={
            "facility": "Central Mess / Aravalli & Meera Bai Dining Hall",
            "menus": prev_data["menus"],
            "confirm": True,
            "changeNotes": "Test Menu Publish",
        },
        headers=admin_headers,
    )
    assert resp_pub.status_code == 200
    assert resp_pub.json()["data"]["version"] >= 2

# ==============================================================================
# PHASE 17.6: SECURITY & ROLE-BASED ACCESS CONTROL (RBAC) TESTS
# ==============================================================================
def test_rbac_unauthenticated_writes_rejected(client):
    """Verify that unauthenticated callers cannot modify timetables or mess menus."""
    # 1. Timetable preview attempt
    resp1 = client.post("/api/v1/timetable/upload-preview", data={"csvText": "test"})
    assert resp1.status_code == 401

    # 2. Timetable publish attempt
    resp2 = client.post("/api/v1/timetable/publish", json={"department": "CSE", "semester": 3, "entries": [], "confirm": True})
    assert resp2.status_code == 401

    # 3. Mess publish attempt
    resp3 = client.post("/api/v1/mess/publish", json={"menus": [], "confirm": True})
    assert resp3.status_code == 401

def test_rbac_student_writes_rejected(client, student_headers):
    """Verify that students cannot update university records through direct API calls."""
    # Student attempts timetable preview
    resp1 = client.post(
        "/api/v1/timetable/upload-preview",
        data={"csvText": "test"},
        headers=student_headers,
    )
    assert resp1.status_code == 403

    # Student attempts timetable publish
    resp2 = client.post(
        "/api/v1/timetable/publish",
        json={"department": "CSE", "semester": 3, "entries": [], "confirm": True},
        headers=student_headers,
    )
    assert resp2.status_code == 403

    # Student attempts mess publish
    resp3 = client.post(
        "/api/v1/mess/publish",
        json={"menus": [], "confirm": True},
        headers=student_headers,
    )
    assert resp3.status_code == 403

    # Student attempts to inspect admin audit logs
    resp4 = client.get("/api/v1/ai/audit-logs", headers=student_headers)
    assert resp4.status_code == 403

def test_rbac_audit_logs_accessible_to_admin(client, admin_headers):
    """Verify that authorized administrators can review audit logs."""
    resp = client.get("/api/v1/ai/audit-logs", headers=admin_headers)
    assert resp.status_code == 200
    assert resp.json()["success"] is True
    logs = resp.json()["data"]["logs"]
    assert len(logs) > 0
