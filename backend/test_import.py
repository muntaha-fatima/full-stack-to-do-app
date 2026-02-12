"""
Test script to check if modules can be imported properly.
"""

try:
    print("Testing import from app.utils.mcp_server...")
    from app.utils.mcp_server import get_task_service
    print("SUCCESS: Successfully imported get_task_service from app.utils.mcp_server")
    
    print("\nTesting getting task service instance...")
    task_service = get_task_service()
    print(f"SUCCESS: Successfully got task service instance: {type(task_service)}")
    
    print("\nTesting repository import...")
    from app.repositories.task_repository import TaskRepository
    print("SUCCESS: Successfully imported TaskRepository")
    
    print("\nTesting database session import...")
    from app.db.session import AsyncSessionLocal
    print("SUCCESS: Successfully imported AsyncSessionLocal")
    
    print("\nAll imports successful!")
    
except ImportError as e:
    print(f"ERROR: Import error: {e}")
    import traceback
    traceback.print_exc()
except Exception as e:
    print(f"ERROR: Other error: {e}")
    import traceback
    traceback.print_exc()