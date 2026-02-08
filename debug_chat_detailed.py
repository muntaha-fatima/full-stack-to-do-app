import asyncio
import sys
import os

# Add the backend directory to the path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from app.core.agents import TodoAgent
from app.utils.mcp_server import get_task_service

async def test_agent():
    print("Testing the TodoAgent...")
    
    # Get the task service directly
    task_service = get_task_service()
    
    print("\n1. Testing add_task directly:")
    try:
        result = await task_service.add_task("1", "Buy groceries", "")
        print(f"Direct add_task result: {result}")
    except Exception as e:
        print(f"Direct add_task error: {e}")
        import traceback
        traceback.print_exc()
    
    print("\n2. Testing with the agent:")
    agent = TodoAgent()
    try:
        result = await agent.process_message("1", "Add task: Buy groceries", [])
        print(f"Agent result: {result}")
    except Exception as e:
        print(f"Agent error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_agent())