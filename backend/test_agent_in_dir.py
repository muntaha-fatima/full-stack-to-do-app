import sys
import os
sys.path.insert(0, os.getcwd())

import asyncio
from app.core.agents import TodoAgent

async def test_agent():
    agent = TodoAgent()
    try:
        result = await agent.process_message("1", "Add task: Buy groceries", [])
        print(f"Success: {result}")
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_agent())