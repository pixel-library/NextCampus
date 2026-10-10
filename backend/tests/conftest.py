import pytest
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.db.connection import connect_db, close_db
import asyncio

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    asyncio.run(connect_db())
    yield
    asyncio.run(close_db())

@pytest.fixture
def client():
    with TestClient(app) as test_client:
        yield test_client
