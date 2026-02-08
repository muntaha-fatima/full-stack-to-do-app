import uvicorn
import sys
import os

# Change to the backend directory
os.chdir(r'C:\Users\dell\full-stack-phase-2\full-stack-to-do-app\backend')

print("Starting backend server...")

try:
    # Import the app to test if there are any import errors
    from app.main import app
    print("App imported successfully")

    # Try to run the server
    print("Attempting to run server on port 8001...")
    uvicorn.run("app.main:app", host="127.0.0.1", port=8001, reload=False)

except ImportError as e:
    print(f"Import error: {e}")
    import traceback
    traceback.print_exc()
except Exception as e:
    print(f"Error running server: {e}")
    import traceback
    traceback.print_exc()