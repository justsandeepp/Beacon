import os
import importlib.util
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sys
from dotenv import load_dotenv

# Add the parent directory and nested modules so we can import them
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Load env vars once for all routers (e.g., Slack OAuth config).
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INTEGRATION_MODULE_ROOT = os.path.join(PROJECT_ROOT, "Integration Module")
load_dotenv(os.path.join(PROJECT_ROOT, "Noise filter module", ".env"), override=False)
load_dotenv(os.path.join(PROJECT_ROOT, ".env"), override=False)

# Legacy integration module path still contains spaces; keep it importable for Gmail routes.
if os.path.isdir(INTEGRATION_MODULE_ROOT) and INTEGRATION_MODULE_ROOT not in sys.path:
    sys.path.append(INTEGRATION_MODULE_ROOT)

from .routers import sessions, ingest, review, brd, hitl, slack
from integration_module.routes.gmail_routes import router as gmail_router
from brd_module.storage import init_db


def _load_legacy_gmail_router():
    routes_path = os.path.join(INTEGRATION_MODULE_ROOT, "routes", "gmail_routes.py")
    if not os.path.exists(routes_path):
        return None

    spec = importlib.util.spec_from_file_location("legacy_gmail_routes", routes_path)
    if spec is None or spec.loader is None:
        return None

    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return getattr(module, "router", None)

# Initialize database (PG or SQLite fallback) on startup
try:
    init_db()
except Exception as e:
    print(f"Warning: Database initialization failed: {e}")

app = FastAPI(
    title="BRD Generation API",
    description="API for the Attributed Knowledge Store and BRD Generation Pipeline",
    version="1.0.0"
)

# Allow frontend testing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(sessions.router)
app.include_router(ingest.router)
app.include_router(review.router)
app.include_router(brd.router)
app.include_router(hitl.router)
app.include_router(slack.router)
app.include_router(gmail_router)

try:
    gmail_router = _load_legacy_gmail_router()
    if gmail_router is not None:
        app.include_router(gmail_router)
except Exception as e:
    print(f"Warning: Gmail router not loaded: {e}")

@app.get("/")
def read_root():
    return {"status": "ok", "message": "BRD Generation API is running."}
