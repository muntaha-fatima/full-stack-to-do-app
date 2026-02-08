"""Test the specific task creation functionality"""
import sys
import os
sys.path.insert(0, os.path.abspath('.'))

print("Testing task creation functionality...")

try:
    from app.core.agents import TodoAgent
    print("+ Successfully imported TodoAgent")
    
    agent = TodoAgent()
    print("+ Successfully created TodoAgent instance")
    
    # Try the specific command that's failing
    import asyncio
    
    async def test():
        print("Testing task creation command...")
        try:
            result = await agent.process_message("1", "Add task: Buy groceries", [])
            print(f"+ Processed task creation successfully: {result['response'][:50]}...")
            print(f"  Tool calls: {result.get('tool_calls', [])}")
        except Exception as e:
            print(f"- Error in task creation: {e}")
            import traceback
            traceback.print_exc()
    
    asyncio.run(test())
    
except Exception as e:
    print(f"- General error: {e}")
    import traceback
    traceback.print_exc()