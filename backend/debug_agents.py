"""
Debug script to test the agents functionality.
"""

import asyncio
import sys
import os

# Add the backend directory to the path
sys.path.insert(0, os.path.abspath('.'))

async def debug_agents():
    print("Testing agents import...")
    try:
        from app.core.agents import TodoAgent
        print("SUCCESS: Successfully imported TodoAgent")
        
        # Create an instance
        agent = TodoAgent()
        print("SUCCESS: Successfully created TodoAgent instance")
        
        # Test the task service import
        from app.utils.mcp_server import get_task_service
        print("SUCCESS: Successfully imported get_task_service")
        
        task_service = get_task_service()
        print(f"SUCCESS: Successfully got task service: {type(task_service)}")
        
        print("All imports successful!")
        
    except ImportError as e:
        print(f"ERROR: Import error: {e}")
        import traceback
        traceback.print_exc()
    except Exception as e:
        print(f"ERROR: Other error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(debug_agents())