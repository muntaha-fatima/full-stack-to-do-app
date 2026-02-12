import asyncio
import sys
import os

# Add the backend directory to the path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from app.core.agents import TodoAgent

async def test_agent():
    agent = TodoAgent()
    
    # Test a simple message
    result = await agent.process_message("1", "Add task: Buy groceries", [])
    print("Agent result:", result)

if __name__ == "__main__":
    asyncio.run(test_agent())