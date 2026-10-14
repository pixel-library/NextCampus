from datetime import datetime, timedelta
import re
from typing import Any, Dict, List, Optional, Tuple
from zoneinfo import ZoneInfo

# University Configured Timezone (India Standard Time)
UNIVERSITY_TIMEZONE = ZoneInfo("Asia/Kolkata")

INTENTS = {
    "MESS_MENU": "mess_menu",
    "TIMETABLE": "timetable",
    "NEXT_CLASS": "next_class",
    "CAMPUS_MAP": "campus_map",
    "SMART_ROOM": "smart_room",
    "CARE_COMPLAINT": "care_complaint",
    "DIRECTORY_FACULTY": "directory_faculty",
    "ATTENDANCE_POLICY": "attendance_policy",
    "EXAM_SCHEDULE": "exam_schedule",
    "LIBRARY_POLICY": "library_policy",
    "SHUTTLE_TRANSIT": "shuttle_transit",
    "ECO_CAMPUS": "eco_campus",
    "SKILL_CAMPUS": "skill_campus",
    "ADMIN_OPERATION": "admin_operation",
    "GENERAL_QUERY": "general_query",
}

DAYS_MAP = {
    "monday": "Monday",
    "somwar": "Monday",
    "tuesday": "Tuesday",
    "mangalwar": "Tuesday",
    "wednesday": "Wednesday",
    "budhwar": "Wednesday",
    "thursday": "Thursday",
    "guruwar": "Thursday",
    "veervar": "Thursday",
    "friday": "Friday",
    "shukrawar": "Friday",
    "saturday": "Saturday",
    "shaniwar": "Saturday",
    "sunday": "Sunday",
    "ravivar": "Sunday",
}

MEALS_MAP = {
    "breakfast": "breakfast",
    "nashta": "breakfast",
    "nasta": "breakfast",
    "morning food": "breakfast",
    "subah": "breakfast",
    "lunch": "lunch",
    "dopahar": "lunch",
    "afternoon meal": "lunch",
    "snacks": "snacks",
    "evening snacks": "snacks",
    "chai": "snacks",
    "shaam": "snacks",
    "dinner": "dinner",
    "raat": "dinner",
    "supper": "dinner",
}

def get_current_university_time() -> datetime:
    """Return current timestamp in the university's configured time zone (Asia/Kolkata)."""
    return datetime.now(UNIVERSITY_TIMEZONE)

def resolve_relative_date(date_phrase: str, base_dt: Optional[datetime] = None) -> Tuple[str, str]:
    """Resolve phrases like 'today', 'tomorrow', 'kal', 'monday' to (YYYY-MM-DD, DayOfWeek)."""
    dt = base_dt or get_current_university_time()
    lower = date_phrase.lower().strip()

    if any(k in lower for k in ["tomorrow", "kal", "tmrw", "next day"]):
        target = dt + timedelta(days=1)
        return target.strftime("%Y-%m-%d"), target.strftime("%A")

    if any(k in lower for k in ["yesterday", "beeta kal"]):
        target = dt - timedelta(days=1)
        return target.strftime("%Y-%m-%d"), target.strftime("%A")

    for k, day_name in DAYS_MAP.items():
        if k in lower:
            # Calculate days until next occurrence of this weekday
            target_weekday = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].index(day_name)
            current_weekday = dt.weekday()
            days_ahead = (target_weekday - current_weekday) % 7
            target = dt + timedelta(days=days_ahead)
            return target.strftime("%Y-%m-%d"), day_name

    # Check for YYYY-MM-DD
    match = re.search(r"(\d{4})-(\d{2})-(\d{2})", lower)
    if match:
        try:
            target = datetime.strptime(match.group(0), "%Y-%m-%d")
            return match.group(0), target.strftime("%A")
        except ValueError:
            pass

    # Default: Today
    return dt.strftime("%Y-%m-%d"), dt.strftime("%A")

def detect_current_meal_period(dt: Optional[datetime] = None) -> str:
    """Determine upcoming or active meal period based on current server clock."""
    curr = dt or get_current_university_time()
    minute_of_day = curr.hour * 60 + curr.minute

    # Breakfast: 07:30 to 09:30
    if minute_of_day < 570: # before 09:30
        return "breakfast"
    # Lunch: 12:30 to 14:30
    elif minute_of_day < 870: # before 14:30
        return "lunch"
    # Snacks: 17:00 to 18:30
    elif minute_of_day < 1110: # before 18:30
        return "snacks"
    # Dinner: 19:45 to 22:00
    elif minute_of_day < 1320: # before 22:00
        return "dinner"
    else:
        # After 22:00: Next meal is tomorrow breakfast
        return "breakfast"

def detect_language(text: str) -> str:
    """Classify language of query: 'hi' (Hindi script), 'hinglish' (Hindi in Latin script), or 'en' (English)."""
    # Devanagari Unicode range
    if any("\u0900" <= c <= "\u097F" for c in text):
        return "hi"

    lower = text.lower()
    hinglish_markers = [
        "aaj", "kal", "kya", "hai", "dikhao", "kidhar", "kaise", "batao",
        "kab", "mein", "mera", "meri", "humara", "chahiye", "khana", "nashta",
        "raat", "dopahar", "subah", "shaam", "kitna", "kitne"
    ]
    if any(re.search(r"\b" + re.escape(w) + r"\b", lower) for w in hinglish_markers):
        return "hinglish"

    return "en"

def classify_intent_and_extract_entities(
    prompt: str,
    conversation_history: Optional[List[Dict[str, Any]]] = None,
    context_filters: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """Analyze user prompt, resolving intent, dates, entities, and conversational follow-ups."""
    clean = prompt.strip()
    lower = clean.lower()
    lang = detect_language(clean)
    now = get_current_university_time()

    # Extract previous turn context if available
    prev_intent = None
    prev_entities: Dict[str, Any] = {}

    if conversation_history:
        # Scan recent turns from back to front
        for turn in reversed(conversation_history):
            if turn.get("role") in ["assistant", "ai"] and turn.get("intent"):
                prev_intent = turn.get("intent")
                prev_entities = turn.get("entities") or {}
                break

    if context_filters:
        prev_entities.update(context_filters)

    # 1. Check for Admin Operations first
    if any(k in lower for k in [
        "replace timetable", "update mess menu", "publish timetable", "publish menu",
        "rollback timetable", "restore timetable", "restore menu", "who updated the menu",
        "audit log", "compare timetable"
    ]):
        return {
            "intent": INTENTS["ADMIN_OPERATION"],
            "language": lang,
            "entities": {
                "operation": "admin_manage",
                "rawInstruction": clean,
            },
            "isFollowUp": False,
        }

    # 2. Check for Contextual Follow-Up Phrases
    # e.g. "What about tomorrow?", "And dinner?", "Third semester", "What about Monday?", "Section B"
    is_short_followup = (
        len(clean.split()) <= 4
        and any(k in lower for k in ["tomorrow", "kal", "dinner", "lunch", "breakfast", "monday", "third", "sem", "section", "what about", "aur", "and"])
    )

    if prev_intent and is_short_followup:
        # Follow-up on Mess Menu
        if prev_intent == INTENTS["MESS_MENU"]:
            date_str, day_str = resolve_relative_date(lower, now)
            meal = None
            for k, m in MEALS_MAP.items():
                if k in lower:
                    meal = m
                    break

            return {
                "intent": INTENTS["MESS_MENU"],
                "language": lang,
                "entities": {
                    "date": date_str,
                    "dayOfWeek": day_str,
                    "meal": meal,
                    "facility": prev_entities.get("facility", "Central Mess / Aravalli & Meera Bai Dining Hall"),
                    "isWeekly": "week" in lower,
                },
                "isFollowUp": True,
            }

        # Follow-up on Timetable
        if prev_intent == INTENTS["TIMETABLE"]:
            date_str, day_str = resolve_relative_date(lower, now)
            sem = prev_entities.get("semester", 3)
            sec = prev_entities.get("section", "A")
            dept = prev_entities.get("department", "Computer Science & Engineering")

            # Check if user specified semester
            sem_match = re.search(r"(\d)(?:st|nd|rd|th)?\s*(?:sem|semester)?", lower)
            if "third" in lower or "3rd" in lower:
                sem = 3
            elif "first" in lower or "1st" in lower:
                sem = 1
            elif "fifth" in lower or "5th" in lower:
                sem = 5
            elif sem_match:
                sem = int(sem_match.group(1))

            if "section b" in lower or "sec b" in lower:
                sec = "B"
            elif "section a" in lower or "sec a" in lower:
                sec = "A"

            return {
                "intent": INTENTS["TIMETABLE"],
                "language": lang,
                "entities": {
                    "department": dept,
                    "semester": sem,
                    "section": sec,
                    "dayOfWeek": day_str if any(k in lower for k in list(DAYS_MAP.keys()) + ["tomorrow", "kal", "monday", "tuesday"]) else None,
                },
                "isFollowUp": True,
            }

    # 3. Direct Intent Classifications
    # A. Mess Menu Intent
    mess_keywords = [
        "mess", "menu", "food", "khana", "lunch", "dinner", "breakfast", "nashta", "snacks",
        "aaj ka menu", "aaj mess", "kal mess", "hostel food", "dining", "meal", "chai"
    ]
    if any(re.search(r"\b" + re.escape(w) + r"\b", lower) for w in mess_keywords) or any(k in lower for k in ["aaj ka mess", "mess menu", "kal ka menu"]):
        date_str, day_str = resolve_relative_date(lower, now)

        # Distinguish specific meal vs full day
        meal_type = None
        for k, m in MEALS_MAP.items():
            if re.search(r"\b" + re.escape(k) + r"\b", lower):
                # Ensure it's not just "today's mess menu" without meal
                meal_type = m
                break

        is_weekly = any(k in lower for k in ["week", "weekly", "poore hafte", "7 days", "schedule"])

        return {
            "intent": INTENTS["MESS_MENU"],
            "language": lang,
            "entities": {
                "date": date_str,
                "dayOfWeek": day_str,
                "meal": meal_type,
                "isWeekly": is_weekly,
                "facility": "Central Mess / Aravalli & Meera Bai Dining Hall",
            },
            "isFollowUp": False,
        }

    # B. Timetable & Next Lecture Intent
    next_class_keywords = ["next class", "next lecture", "agla class", "agli class", "ab konsi class", "current class"]
    if any(k in lower for k in next_class_keywords):
        return {
            "intent": INTENTS["NEXT_CLASS"],
            "language": lang,
            "entities": {
                "currentTime": now.strftime("%H:%M"),
                "currentDay": now.strftime("%A"),
            },
            "isFollowUp": False,
        }

    timetable_keywords = [
        "timetable", "time table", "schedule", "routine", "lectures", "classes",
        "cse timetable", "mera timetable", "class schedule"
    ]
    if any(re.search(r"\b" + re.escape(w) + r"\b", lower) for w in timetable_keywords) or any(k in lower for k in ["cse sem", "third sem", "3rd sem"]):
        date_str, day_str = resolve_relative_date(lower, now)

        dept = "Computer Science & Engineering"
        if "mechanical" in lower:
            dept = "Mechanical Engineering"
        elif "civil" in lower:
            dept = "Civil Engineering"
        elif "electrical" in lower:
            dept = "Electrical Engineering"

        semester = 3
        if "third" in lower or "3rd" in lower or "sem 3" in lower or "semester 3" in lower:
            semester = 3
        elif "first" in lower or "1st" in lower or "sem 1" in lower or "semester 1" in lower:
            semester = 1
        elif "fifth" in lower or "5th" in lower or "sem 5" in lower or "semester 5" in lower:
            semester = 5
        elif "seventh" in lower or "7th" in lower or "sem 7" in lower or "semester 7" in lower:
            semester = 7

        section = "A"
        if "section b" in lower or "sec b" in lower:
            section = "B"

        has_specific_day = any(k in lower for k in list(DAYS_MAP.keys()) + ["tomorrow", "kal", "today", "aaj"])
        day_filter = day_str if has_specific_day else None

        return {
            "intent": INTENTS["TIMETABLE"],
            "language": lang,
            "entities": {
                "department": dept,
                "semester": semester,
                "section": section,
                "dayOfWeek": day_filter,
                "date": date_str,
            },
            "isFollowUp": False,
        }

    # C. Attendance Policy
    if any(k in lower for k in ["attendance", "75%", "shortage", "detained", "condonation", "hazri", "attendance rule"]):
        return {
            "intent": INTENTS["ATTENDANCE_POLICY"],
            "language": lang,
            "entities": {"policy": "Ordinance §4.1 (75% Minimum Attendance)"},
            "isFollowUp": False,
        }

    # D. Library Policies & Hours
    if any(k in lower for k in ["library", "books", "borrow", "lib timing", "reading room", "library close", "library hour", "kitab"]):
        return {
            "intent": INTENTS["LIBRARY_POLICY"],
            "language": lang,
            "entities": {"facility": "Swami Vivekananda Central Library (LIB-03)"},
            "isFollowUp": False,
        }

    # E. Exam Schedule & Academic Calendar
    if any(k in lower for k in ["exam", "mid-term", "midterm", "datesheet", "pariksha", "finals", "vacation", "holiday"]):
        return {
            "intent": INTENTS["EXAM_SCHEDULE"],
            "language": lang,
            "entities": {"term": "Fall Semester 2026"},
            "isFollowUp": False,
        }

    # F. Campus Map & Directions
    if any(k in lower for k in [
        "where is", "direction", "how to reach", "map", "location", "rasta", "kahan hai",
        "kidhar hai", "temple", "mandir", "turing", "b-204", "gate", "parking", "cricket", "gym", "football"
    ]):
        target = "Campus Facility"
        if "library" in lower:
            target = "Swami Vivekananda Central Library (LIB-03)"
        elif "turing" in lower or "b-204" in lower or "eng" in lower:
            target = "Faculty of Engineering & Technology (ENG-02) / Room B-204"
        elif "temple" in lower or "mandir" in lower:
            target = "Mewar Campus Temple & Meditation Shrine"
        elif "mess" in lower or "cafeteria" in lower or "cafe" in lower:
            target = "Central Student Dining Mess (CAF-05)"
        elif "gate" in lower:
            target = "Main Campus Gate 1 (NH-48)"
        elif "parking" in lower:
            target = "Main Campus Vehicle & Visitor Parking Zone"
        elif "football" in lower:
            target = "University Football Ground & Sports Arena"

        return {
            "intent": INTENTS["CAMPUS_MAP"],
            "language": lang,
            "entities": {"targetFacility": target},
            "isFollowUp": False,
        }

    # G. SmartRooms & Pods
    if any(k in lower for k in ["smartroom", "study pod", "quiet room", "pod", "available seats"]):
        return {
            "intent": INTENTS["SMART_ROOM"],
            "language": lang,
            "entities": {},
            "isFollowUp": False,
        }

    # H. Maintenance & Care Complaints
    if any(k in lower for k in ["complaint", "broken", "repair", "leak", "wifi down", "ac not working", "shikayat"]):
        return {
            "intent": INTENTS["CARE_COMPLAINT"],
            "language": lang,
            "entities": {},
            "isFollowUp": False,
        }

    # I. EV Shuttle Transit
    if any(k in lower for k in ["shuttle", "bus", "transit", "ev bus"]):
        return {
            "intent": INTENTS["SHUTTLE_TRANSIT"],
            "language": lang,
            "entities": {},
            "isFollowUp": False,
        }

    # Default: General Campus Query
    return {
        "intent": INTENTS["GENERAL_QUERY"],
        "language": lang,
        "entities": {},
        "isFollowUp": False,
    }
