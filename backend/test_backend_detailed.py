import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Add current directory to Python path
os.chdir(os.path.dirname(os.path.abspath(__file__)))

# Test importing the main app
try:
    print("Attempting to import backend app...")
    from app.main import app
    print("SUCCESS: Backend app imported successfully!")
    
    # Test importing the settings
    from app.core.config import settings
    print(f"SUCCESS: Settings loaded. Environment: {settings.ENVIRONMENT}")
    print(f"SUCCESS: Database URL: {settings.DATABASE_URL}")
    print(f"SUCCESS: Secret key: {'SET' if settings.SECRET_KEY else 'NOT SET'}")
    
    # Test importing the database session
    from app.db.session import engine, init_db
    print("SUCCESS: Database session imported")
    
    # Test importing the API routes
    from app.api.v1.api import api_router
    print("SUCCESS: API routes imported")
    
    print("\nAll imports successful! The backend should work.")
    
except Exception as e:
    print(f"ERROR importing backend: {e}")
    import traceback
    traceback.print_exc()