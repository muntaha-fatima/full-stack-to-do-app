"""Test to simulate the exact conditions of the API call"""
import sys
import os
sys.path.insert(0, os.path.abspath('.'))

print("Simulating API call conditions...")

try:
    # Import the same way as the API endpoint
    from app.api.deps import get_current_user
    from app.db.session import get_async_db
    from app.services.async_conversation_service import create_conversation, get_conversation_by_id
    from app.services.async_message_service import create_message, get_messages_by_conversation
    from app.core.agents import TodoAgent
    from app.models.user import User
    from sqlmodel.ext.asyncio.session import AsyncSession
    
    print("+ All imports successful")
    
    # Test creating the agent
    agent = TodoAgent()
    print("+ Agent created successfully")
    
    # Test the task service import specifically
    from app.utils.mcp_server import get_task_service
    task_service = get_task_service()
    print(f"+ Task service retrieved: {type(task_service)}")
    
    # Test the actual agent processing
    import asyncio
    
    async def test_processing():
        print("Testing agent processing...")
        try:
            result = await agent.process_message("1", "Add task: Buy groceries", [])
            print(f"+ Processing successful: {len(result.get('response', ''))} chars in response")
            print(f"+ Tool calls: {len(result.get('tool_calls', []))}")
        except Exception as e:
            print(f"- Error in processing: {e}")
            import traceback
            traceback.print_exc()
    
    asyncio.run(test_processing())
    
except ImportError as e:
    print(f"- ImportError: {e}")
    import traceback
    traceback.print_exc()
except Exception as e:
    print(f"- General error: {e}")
    import traceback
    traceback.print_exc()