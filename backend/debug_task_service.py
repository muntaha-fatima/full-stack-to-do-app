"""
Debug script to test the task service functionality.
"""

import asyncio
import sys
import os

# Add the backend directory to the path
sys.path.insert(0, os.path.abspath('.'))

async def debug_task_service():
    print("Testing task service functionality...")
    try:
        # Test the repository import
        from app.repositories.task_repository import TaskRepository
        print("SUCCESS: Successfully imported TaskRepository")
        
        # Test the database session import
        from app.db.session import AsyncSessionLocal
        print("SUCCESS: Successfully imported AsyncSessionLocal")
        
        # Test getting the task service
        from app.utils.mcp_server import get_task_service
        print("SUCCESS: Successfully imported get_task_service")
        
        task_service = get_task_service()
        print(f"SUCCESS: Got task service instance: {type(task_service)}")
        
        # Test if we can call a method on the task service
        # We won't actually execute it to avoid database changes, but we can check if the method exists
        method_names = [method for method in dir(task_service) if not method.startswith('_')]
        print(f"Available methods in task service: {method_names}")
        
        print("Task service functionality test completed successfully!")
        
    except ImportError as e:
        print(f"ERROR: Import error: {e}")
        import traceback
        traceback.print_exc()
    except Exception as e:
        print(f"ERROR: Other error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(debug_task_service())