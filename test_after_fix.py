import asyncio
import sys
import os

# Add the backend directory to the path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from app.utils.mcp_server import get_task_service

async def test_add_task():
    print("Testing add_task directly...")
    
    # Get the task service directly
    task_service = get_task_service()
    
    print("\nTesting add_task:")
    try:
        result = await task_service.add_task("1", "Test task after fix", "")
        print(f"add_task result: {result}")
    except Exception as e:
        print(f"add_task error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_add_task())