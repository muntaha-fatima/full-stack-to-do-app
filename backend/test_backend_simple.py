import os
import sys
import asyncio
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add the backend directory to the Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    print("Loading configuration...")
    from app.core.config import settings
    print(f"Environment: {settings.ENVIRONMENT}")
    print(f"Database URL: {settings.DATABASE_URL}")
    print(f"Secret key is set: {'Yes' if settings.SECRET_KEY else 'No'}")
    
    print("\nImporting main app...")
    from app.main import app
    print("Main app imported successfully!")
    
    print("\nImporting database session...")
    from app.db.session import engine, init_db
    print("Database session imported successfully!")
    
    print("\nImporting API routes...")
    from app.api.v1.api import api_router
    print("API routes imported successfully!")
    
    print("\nAll imports successful! Backend is properly configured.")
    
except ImportError as e:
    print(f"Import error: {e}")
    import traceback
    traceback.print_exc()
except Exception as e:
    print(f"General error: {e}")
    import traceback
    traceback.print_exc()