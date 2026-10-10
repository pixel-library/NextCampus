import copy
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from bson import ObjectId

from backend.app.db.connection import get_database, is_db_connected, IN_MEMORY_PROJECTS
from backend.app.utils.helpers import serialize_mongo

async def get_projects(filter_params: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
    """Retrieve SkillCampus collaborative student projects."""
    filter_params = filter_params or {}
    db = get_database()

    if is_db_connected() and db is not None:
        try:
            mongo_filter: Dict[str, Any] = {}
            if filter_params.get("category") and filter_params["category"].lower() != "all":
                mongo_filter["category"] = {"$regex": f"^{filter_params['category']}$", "$options": "i"}

            cursor = db.projects.find(mongo_filter).sort("createdAt", -1)
            records = await cursor.to_list(length=100)
            if records and len(records) > 0:
                return serialize_mongo(records)
        except Exception:
            pass

    results = copy.deepcopy(IN_MEMORY_PROJECTS)
    if filter_params.get("category") and filter_params["category"].lower() != "all":
        cat = filter_params["category"].lower()
        results = [p for p in results if p.get("category", "").lower() == cat]

    return serialize_mongo(results)

async def create_project(project_data: Dict[str, Any]) -> Dict[str, Any]:
    """Create a new collaborative SkillCampus project."""
    lead = project_data.get("leadStudent") or project_data.get("authorId") or "usr_student_01"
    author_name = project_data.get("authorName") or "Lead Student"
    category = project_data.get("category") or "Robotics"
    members_needed = int(project_data.get("membersNeeded") or project_data.get("teamSize") or 3)
    now = datetime.now(timezone.utc)
    new_id = f"proj_{int(now.timestamp() * 1000)}"

    lead_obj = {
        "_id": lead,
        "id": lead,
        "name": author_name,
        "department": "Computer Science & Engineering",
    }

    new_project = {
        "_id": new_id,
        "id": new_id,
        "title": project_data.get("title"),
        "category": category,
        "description": project_data.get("description"),
        "tags": project_data.get("tags") or [],
        "status": "recruiting",
        "leadStudent": lead_obj,
        "membersNeeded": members_needed,
        "currentMembers": [lead_obj],
        "githubRepo": project_data.get("githubRepo") or "",
        "createdAt": now,
        "updatedAt": now,
    }

    db = get_database()
    if is_db_connected() and db is not None:
        try:
            await db.projects.insert_one(copy.deepcopy(new_project))
        except Exception:
            pass

    IN_MEMORY_PROJECTS.insert(0, copy.deepcopy(new_project))
    return serialize_mongo(new_project)

async def join_project(project_id: str, user_id: str, user_name: str = "Student Member") -> Dict[str, Any]:
    """Join an open SkillCampus project, preventing duplicate membership."""
    user_id_str = str(user_id)
    db = get_database()
    project = None

    if is_db_connected() and db is not None:
        try:
            queries = [{"_id": project_id}, {"id": project_id}]
            try:
                queries.append({"_id": ObjectId(project_id)})
            except Exception:
                pass
            project = await db.projects.find_one({"$or": queries})
        except Exception:
            pass

    target_idx = -1
    if not project:
        for idx, p in enumerate(IN_MEMORY_PROJECTS):
            if str(p.get("_id")) == str(project_id) or str(p.get("id")) == str(project_id):
                project = p
                target_idx = idx
                break

    if not project:
        raise KeyError("Project not found")

    # Check lead membership
    lead = project.get("leadStudent")
    lead_id = str(lead.get("_id") or lead.get("id") or lead) if isinstance(lead, dict) else str(lead)
    if lead_id == user_id_str:
        raise ValueError("You are already a member or lead of this project.")

    # Check existing member list
    current_members = project.get("currentMembers") or []
    for m in current_members:
        m_id = str(m.get("_id") or m.get("id") or m) if isinstance(m, dict) else str(m)
        if m_id == user_id_str:
            raise ValueError("You are already a member or lead of this project.")

    new_member = {
        "_id": user_id,
        "id": user_id,
        "name": user_name,
    }

    if is_db_connected() and db is not None:
        try:
            queries = [{"_id": project_id}, {"id": project_id}]
            try:
                queries.append({"_id": ObjectId(project_id)})
            except Exception:
                pass
            await db.projects.update_one(
                {"$or": queries},
                {"$push": {"currentMembers": new_member}, "$set": {"updatedAt": datetime.now(timezone.utc)}}
            )
            updated = await db.projects.find_one({"$or": queries})
            if updated:
                return serialize_mongo(updated)
        except Exception:
            pass

    if target_idx != -1:
        IN_MEMORY_PROJECTS[target_idx]["currentMembers"].append(new_member)
        return serialize_mongo(copy.deepcopy(IN_MEMORY_PROJECTS[target_idx]))
    else:
        project["currentMembers"].append(new_member)
        return serialize_mongo(project)
