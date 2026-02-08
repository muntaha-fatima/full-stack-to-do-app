"""Direct test of the TodoAgent import and functionality"""
import sys
import os
sys.path.insert(0, os.path.abspath('.'))

print("Testing TodoAgent import...")

try:
    from app.core.agents import TodoAgent
    print("+ Successfully imported TodoAgent")
    
    agent = TodoAgent()
    print("+ Successfully created TodoAgent instance")
    
    # Test the get_task_service import
    from app.utils.mcp_server import get_task_service
    print("+ Successfully imported get_task_service")
    
    task_service = get_task_service()
    print(f"+ Successfully got task service: {type(task_service)}")
    
    # Try a simple call to see where the error occurs
    import asyncio
    
    async def test():
        print("Testing agent process_message...")
        try:
            result = await agent.process_message("1", "Hello", [])
            print(f"+ Processed message successfully: {result['response'][:50]}...")
        except Exception as e:
            print(f"- Error in process_message: {e}")
            import traceback
            traceback.print_exc()
    
    asyncio.run(test())
    
except ImportError as e:
    print(f"- ImportError: {e}")
    import traceback
    traceback.print_exc()
except Exception as e:
    print(f"- General error: {e}")
    import traceback
    traceback.print_exc()