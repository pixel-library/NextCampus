import pytest
from fastapi.testclient import TestClient

def test_admin_and_gatepass_end_to_end(client: TestClient):
    # 1. Admin Login
    admin_login_res = client.post(
        "/api/v1/auth/login",
        json={"identifier": "admin@nextcampus.edu", "password": "adminpassword123"},
    )
    assert admin_login_res.status_code == 200, f"Admin login failed: {admin_login_res.text}"
    admin_token = admin_login_res.json()["data"]["token"]
    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    # 2. Student Login
    student_login_res = client.post(
        "/api/v1/auth/login",
        json={"identifier": "rakesh@nextcampus.edu", "password": "password123"},
    )
    assert student_login_res.status_code == 200, f"Student login failed: {student_login_res.text}"
    student_token = student_login_res.json()["data"]["token"]
    student_headers = {"Authorization": f"Bearer {student_token}"}

    # 3. Test Student Directory Access Control
    # Student should be forbidden
    student_try_students = client.get("/api/v1/admin/students", headers=student_headers)
    assert student_try_students.status_code == 403

    # Admin should succeed and get all students from database
    admin_get_students = client.get("/api/v1/admin/students", headers=admin_headers)
    assert admin_get_students.status_code == 200
    st_data = admin_get_students.json()["data"]
    assert "students" in st_data
    assert len(st_data["students"]) > 0
    assert "stats" in st_data
    assert st_data["stats"]["totalRoster"] > 0

    # 4. Test Student Blocking & Suspension
    # Find student Rakesh
    rakesh_record = next(
        (s for s in st_data["students"] if s["enrollmentNumber"] == "MUR2502101"), None
    )
    assert rakesh_record is not None, "Rakesh record not found"
    assert rakesh_record["isBlocked"] is False

    # Admin blocks Rakesh
    block_res = client.patch(
        f"/api/v1/admin/students/{rakesh_record['id']}/toggle-block",
        headers=admin_headers,
    )
    assert block_res.status_code == 200
    assert block_res.json()["data"]["isBlocked"] is True

    # Rakesh tries to login while blocked -> must fail with account suspension error
    blocked_login = client.post(
        "/api/v1/auth/login",
        json={"identifier": "rakesh@nextcampus.edu", "password": "password123"},
    )
    assert blocked_login.status_code == 400
    assert "Account Suspended" in blocked_login.json()["message"]

    # Admin unblocks Rakesh
    unblock_res = client.patch(
        f"/api/v1/admin/students/{rakesh_record['id']}/toggle-block",
        headers=admin_headers,
    )
    assert unblock_res.status_code == 200
    assert unblock_res.json()["data"]["isBlocked"] is False

    # Now Rakesh can login again
    restore_login = client.post(
        "/api/v1/auth/login",
        json={"identifier": "rakesh@nextcampus.edu", "password": "password123"},
    )
    assert restore_login.status_code == 200

    # 5. Gate Pass Workflow
    # Student applies for gate pass
    apply_res = client.post(
        "/api/v1/gatepass/apply",
        headers=student_headers,
        json={
            "destination": "Chittorgarh Railway Station",
            "reason": "Visiting home for festival",
            "outTime": "Friday 05:00 PM",
            "expectedInTime": "Sunday 08:00 PM",
            "emergencyContact": "+91 98765 00000",
        },
    )
    assert apply_res.status_code == 201
    applied_pass = apply_res.json()["data"]
    pass_id = applied_pass["id"]
    assert applied_pass["status"] == "PENDING"
    assert applied_pass["enrollmentNumber"] == "MUR2502101"
    assert applied_pass["studentName"] == "Rakesh Kumar"

    # Student checks my passes
    my_passes_res = client.get("/api/v1/gatepass/my-passes", headers=student_headers)
    assert my_passes_res.status_code == 200
    my_passes = my_passes_res.json()["data"]["passes"]
    assert any(p["id"] == pass_id and p["status"] == "PENDING" for p in my_passes)

    # Admin checks pending passes
    pending_res = client.get("/api/v1/gatepass/admin/pending", headers=admin_headers)
    assert pending_res.status_code == 200
    pending_list = pending_res.json()["data"]["passes"]
    assert any(p["id"] == pass_id for p in pending_list)

    # Admin approves the pass
    review_res = client.post(
        f"/api/v1/gatepass/admin/{pass_id}/action",
        headers=admin_headers,
        json={"action": "APPROVE", "remarks": "Approved. Have a safe journey."},
    )
    assert review_res.status_code == 200
    assert review_res.json()["data"]["status"] == "APPROVED"
    assert "NEXTCAMPUS:GATEPASS" in review_res.json()["data"]["qrCodeData"]

    # Student checks my passes again -> now APPROVED
    my_passes_res_2 = client.get("/api/v1/gatepass/my-passes", headers=student_headers)
    assert my_passes_res_2.status_code == 200
    updated_my_pass = next(
        p for p in my_passes_res_2.json()["data"]["passes"] if p["id"] == pass_id
    )
    assert updated_my_pass["status"] == "APPROVED"
    assert updated_my_pass["adminRemarks"] == "Approved. Have a safe journey."

    # 6. Timetable Hierarchy & Slot Management
    hierarchy_res = client.get("/api/v1/timetable/hierarchy")
    assert hierarchy_res.status_code == 200
    h_data = hierarchy_res.json()["data"]
    assert "Computer Science & Engineering" in h_data["departments"]
    assert "courses" in h_data

    # Admin saves a class slot
    save_slot_res = client.post(
        "/api/v1/timetable/slot",
        headers=admin_headers,
        json={
            "department": "Computer Science & Engineering",
            "course": "B.Tech CSE",
            "year": 2,
            "semester": 3,
            "section": "A",
            "dayOfWeek": "Wednesday",
            "subject": "Deep Learning Architectures",
            "subjectCode": "CS309",
            "startTime": "11:30",
            "endTime": "12:30",
            "faculty": "Prof. Vikram Malhotra",
            "room": "Room B-301",
            "building": "Turing Block",
        },
    )
    assert save_slot_res.status_code == 200
    created_slot = save_slot_res.json()["data"]
    assert created_slot["subject"] == "Deep Learning Architectures"
    assert created_slot["faculty"] == "Prof. Vikram Malhotra"

    # Query timetable for Wednesday
    query_tt = client.get(
        "/api/v1/timetable/query?department=Computer%20Science&semester=3&section=A&day=Wednesday"
    )
    assert query_tt.status_code == 200
    tt_entries = query_tt.json()["data"]["entries"]
    assert any(e["subject"] == "Deep Learning Architectures" for e in tt_entries)

    # 7. Mess Menu Update
    update_mess_res = client.post(
        "/api/v1/mess/update-day",
        headers=admin_headers,
        json={
            "dayOfWeek": "Friday",
            "meals": {
                "lunch": {
                    "items": ["Paneer Pasanda", "Dal Tadka", "Steamed Basmati Rice", "Roti", "Rasgulla"]
                }
            },
        },
    )
    assert update_mess_res.status_code == 200
    assert update_mess_res.json()["success"] is True

    # Query Friday mess
    query_mess = client.get("/api/v1/mess/query?day=Friday")
    assert query_mess.status_code == 200
    menu_doc = query_mess.json()["data"]
    assert "Paneer Pasanda" in menu_doc["meals"]["lunch"]["items"]
