"""Test script to reproduce the exact error"""
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

try:
    from app.core.agents import TodoAgent
    print("Successfully imported TodoAgent")
    
    agent = TodoAgent()
    print("Successfully created TodoAgent instance")
    
    # Try to call the process_message method to see where the error occurs
    import asyncio
    
    async def test_process():
        try:
            result = await agent.process_message("1", "Add task: Buy groceries", [])
            print(f"Successfully processed message: {result}")
        except Exception as e:
            print(f"Error during process_message: {e}")
            import traceback
            traceback.print_exc()
    
    asyncio.run(test_process())
    
except Exception as e:
    print(f"Error importing or creating agent: {e}")
    import traceback
    traceback.print_exc()