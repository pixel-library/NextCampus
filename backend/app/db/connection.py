import copy
from typing import Optional
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from backend.app.core.config import settings
from backend.app.core.logging import logger
from backend.app.db.seed_data import (
    SEED_USERS,
    SEED_ENROLLMENTS,
    SEED_LOCATIONS,
    SEED_ROOMS,
    SEED_COMPLAINTS,
    SEED_PROJECTS,
    SEED_METRICS,
    SEED_ANNOUNCEMENTS,
    SEED_TIMETABLES,
    SEED_MESS_MENUS,
    SEED_AUDIT_LOGS,
    SEED_GATE_PASSES,
)

# Global client and database instances
client: Optional[AsyncIOMotorClient] = None
db: Optional[AsyncIOMotorDatabase] = None
_is_connected: bool = False

# Resilient in-memory stores for decoupled / offline fallback
IN_MEMORY_USERS = copy.deepcopy(SEED_USERS)
IN_MEMORY_ENROLLMENTS = copy.deepcopy(SEED_ENROLLMENTS)
IN_MEMORY_LOCATIONS = copy.deepcopy(SEED_LOCATIONS)
IN_MEMORY_ROOMS = copy.deepcopy(SEED_ROOMS)
IN_MEMORY_COMPLAINTS = copy.deepcopy(SEED_COMPLAINTS)
IN_MEMORY_PROJECTS = copy.deepcopy(SEED_PROJECTS)
IN_MEMORY_METRICS = copy.deepcopy(SEED_METRICS)
IN_MEMORY_ANNOUNCEMENTS = copy.deepcopy(SEED_ANNOUNCEMENTS)
IN_MEMORY_TIMETABLES = copy.deepcopy(SEED_TIMETABLES)
IN_MEMORY_MESS_MENUS = copy.deepcopy(SEED_MESS_MENUS)
IN_MEMORY_AUDIT_LOGS = copy.deepcopy(SEED_AUDIT_LOGS)
IN_MEMORY_GATE_PASSES = copy.deepcopy(SEED_GATE_PASSES)



async def connect_db():
    """Connect to MongoDB with resilience and seed initial datasets if empty."""
    global client, db, _is_connected
    try:
        conn_str = settings.MONGODB_URI or "mongodb://localhost:27017/nextcampus"
        client = AsyncIOMotorClient(conn_str, serverSelectionTimeoutMS=2000)
        # Test connectivity with ping
        await client.admin.command("ping")
        db = client[settings.DB_NAME]
        _is_connected = True
        logger.info(f"[NextCampus DB] MongoDB Connected to database '{settings.DB_NAME}'")

        # Initialize collections with seed records if empty
        await _seed_collections_if_empty()
    except Exception as e:
        _is_connected = False
        logger.warning(f"[NextCampus DB Connection Failure]: {str(e)}")
        logger.warning("[NextCampus DB Info] Running in decoupled/mock fallback mode.")

async def _seed_collections_if_empty():
    """Populate empty collections with canonical seed records."""
    if not _is_connected or db is None:
        return

    try:
        if await db.locations.count_documents({}) == 0:
            await db.locations.insert_many(copy.deepcopy(SEED_LOCATIONS))
            logger.info(f"[NextCampus DB] Seeded {len(SEED_LOCATIONS)} locations")

        if await db.rooms.count_documents({}) == 0:
            await db.rooms.insert_many(copy.deepcopy(SEED_ROOMS))
            logger.info(f"[NextCampus DB] Seeded {len(SEED_ROOMS)} rooms")

        if await db.enrollments.count_documents({}) == 0:
            await db.enrollments.insert_many(copy.deepcopy(SEED_ENROLLMENTS))
            logger.info(f"[NextCampus DB] Seeded {len(SEED_ENROLLMENTS)} student enrollments")

        if await db.users.count_documents({}) == 0:
            await db.users.insert_many(copy.deepcopy(SEED_USERS))
            logger.info(f"[NextCampus DB] Seeded {len(SEED_USERS)} users")

        if await db.complaints.count_documents({}) == 0:
            await db.complaints.insert_many(copy.deepcopy(SEED_COMPLAINTS))
            logger.info(f"[NextCampus DB] Seeded {len(SEED_COMPLAINTS)} complaints")

        if await db.projects.count_documents({}) == 0:
            await db.projects.insert_many(copy.deepcopy(SEED_PROJECTS))
            logger.info(f"[NextCampus DB] Seeded {len(SEED_PROJECTS)} projects")

        if await db.sustainabilities.count_documents({}) == 0:
            await db.sustainabilities.insert_many(copy.deepcopy(SEED_METRICS))
            logger.info(f"[NextCampus DB] Seeded {len(SEED_METRICS)} sustainability metrics")

        if await db.announcements.count_documents({}) == 0:
            await db.announcements.insert_many(copy.deepcopy(SEED_ANNOUNCEMENTS))
            logger.info(f"[NextCampus DB] Seeded {len(SEED_ANNOUNCEMENTS)} announcements")

        if await db.timetables.count_documents({}) == 0:
            await db.timetables.insert_many(copy.deepcopy(SEED_TIMETABLES))
            logger.info(f"[NextCampus DB] Seeded {len(SEED_TIMETABLES)} timetable entries")

        if await db.mess_menus.count_documents({}) == 0:
            await db.mess_menus.insert_many(copy.deepcopy(SEED_MESS_MENUS))
            logger.info(f"[NextCampus DB] Seeded {len(SEED_MESS_MENUS)} mess menu records")

        if await db.audit_logs.count_documents({}) == 0:
            await db.audit_logs.insert_many(copy.deepcopy(SEED_AUDIT_LOGS))
            logger.info(f"[NextCampus DB] Seeded {len(SEED_AUDIT_LOGS)} initial audit log entries")

        if await db.gate_passes.count_documents({}) == 0:
            await db.gate_passes.insert_many(copy.deepcopy(SEED_GATE_PASSES))
            logger.info(f"[NextCampus DB] Seeded {len(SEED_GATE_PASSES)} gate pass requests")
    except Exception as e:

        logger.warning(f"[NextCampus DB] Seeding warning: {str(e)}")

async def close_db():
    """Gracefully close MongoDB connection."""
    global client, db, _is_connected
    if client:
        client.close()
        _is_connected = False
        logger.info("[NextCampus DB] MongoDB connection closed.")

def get_database() -> Optional[AsyncIOMotorDatabase]:
    """Get active database instance."""
    return db

def is_db_connected() -> bool:
    """Return whether MongoDB connection is active."""
    return _is_connected
