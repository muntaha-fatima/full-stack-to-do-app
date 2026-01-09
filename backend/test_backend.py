import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Test importing the main app
try:
    from app.main import app
    print("Backend app imported successfully!")
    
    # Test importing the settings
    from app.core.config import settings
    print(f"Settings loaded. Environment: {settings.ENVIRONMENT}")
    print(f"Database URL: {settings.DATABASE_URL}")
    print(f"Secret key: {'SET' if settings.SECRET_KEY else 'NOT SET'}")
    
except Exception as e:
    print(f"Error importing backend: {e}")
    import traceback
    traceback.print_exc()