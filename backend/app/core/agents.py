import cohere
from typing import Dict, Any, List
import os
import asyncio
from app.utils.mcp_server import get_task_service
import re


class TodoAgent:
    def __init__(self):
        api_key = os.getenv("COHERE_API_KEY")
        if not api_key:
            print("Warning: COHERE_API_KEY not found in environment. Using enhanced mock responses.")
            self.cohere_client = None
        else:
            self.cohere_client = cohere.Client(api_key=api_key)

    async def process_message(self, user_id: str, message: str, conversation_history: List[Dict[str, str]] = None) -> Dict[str, Any]:
        """
        Process a user message using intent detection and task service.
        """
        if conversation_history is None:
            conversation_history = []

        # Get the task service instance
        task_service = get_task_service()

        # Call task service based on the message
        tool_results = []
        try:
            tool_results = await self._call_task_service(message, user_id, task_service)
        except Exception as e:
            print(f"Error calling task service: {e}")
            # Log the error but continue with empty tool results
            # This means the command wasn't recognized or there was an error executing it
            # So we'll fall back to the default response

        # Generate the final response based on tool results using local logic
        try:
            final_response = await self._generate_response_with_tool_results(message, tool_results)
        except Exception as e:
            print(f"Error generating response: {e}")
            final_response = "I'm sorry, I encountered an error processing your request."

        return {
            "response": final_response,
            "tool_calls": tool_results
        }

    async def _call_task_service(self, message: str, user_id: str, task_service) -> List[Dict[str, Any]]:
        """
        Call task service based on the user message using improved intent detection.
        """
        message_lower = message.lower().strip()
        tool_results = []

        # Intent detection patterns
        # Add task: "Add task: buy groceries", "Create task: buy groceries", "New task: call mom"
        add_task_patterns = [
            r"(?:add|create|new)\s+task[:\-\s]+(.+?)(?:$|[.!?])",
            r"(?:add|create|new)\s+(.+?)(?:$|[.!?])"
        ]

        for pattern in add_task_patterns:
            match = re.search(pattern, message_lower, re.IGNORECASE)
            if match:
                task_text = match.group(1).strip()

                # Split title and description if present
                if ':' in task_text:
                    title, description = task_text.split(':', 1)
                    title = title.strip()
                    description = description.strip()
                else:
                    title = task_text
                    description = ""

                # Call the add_task service
                result = await task_service.add_task(user_id, title, description)
                tool_results.append({
                    "name": "add_task",
                    "arguments": {"user_id": user_id, "title": title, "description": description},
                    "result": result
                })
                break  # Only process the first match

        # List tasks: "Show my tasks", "List tasks", "Show pending tasks", "Show completed tasks", "What are my tasks?"
        list_task_patterns = [
            r"(?:show|list|display|what are|view)\s+(?:my\s+)?(?:pending\s+)?tasks?",
            r"(?:show|list|display|what are|view)\s+(?:my\s+)?(?:completed\s+)?tasks?",
            r"(?:show|list|display|what are|view)\s+(?:my\s+)?tasks?\s+(?:that are\s+)?(?:pending|completed)"
        ]

        for pattern in list_task_patterns:
            if re.search(pattern, message_lower, re.IGNORECASE):
                # Determine status filter
                status = "all"
                if "pending" in message_lower:
                    status = "pending"
                elif "completed" in message_lower:
                    status = "completed"

                # Call the list_tasks service
                result = await task_service.list_tasks(user_id, status)
                tool_results.append({
                    "name": "list_tasks",
                    "arguments": {"user_id": user_id, "status": status},
                    "result": result
                })
                break  # Only process the first match

        # Complete task: "Complete task 5", "Finish task 5", "Mark task 5 complete", "Task 5 is done"
        complete_task_patterns = [
            r"(?:complete|finish|mark|done)\s+(?:task\s+|#|no\.?\s*)?(\d+)",
            r"(?:task\s+|#|no\.?\s*)(\d+)\s+(?:is\s+)?(?:complete|finished|done)"
        ]

        for pattern in complete_task_patterns:
            match = re.search(pattern, message_lower, re.IGNORECASE)
            if match:
                task_id = int(match.group(1))

                # Call the complete_task service
                result = await task_service.complete_task(user_id, task_id)
                tool_results.append({
                    "name": "complete_task",
                    "arguments": {"user_id": user_id, "task_id": task_id},
                    "result": result
                })
                break  # Only process the first match

        # Delete task: "Delete task 5", "Remove task 5", "Cancel task 5"
        delete_task_patterns = [
            r"(?:delete|remove|cancel|eliminate)\s+(?:task\s+|#|no\.?\s*)?(\d+)"
        ]

        for pattern in delete_task_patterns:
            match = re.search(pattern, message_lower, re.IGNORECASE)
            if match:
                task_id = int(match.group(1))

                # Call the delete_task service
                result = await task_service.delete_task(user_id, task_id)
                tool_results.append({
                    "name": "delete_task",
                    "arguments": {"user_id": user_id, "task_id": task_id},
                    "result": result
                })
                break  # Only process the first match

        # Update task: "Update task 5: new title", "Change task 5 to: new title", "Modify task 5: new title"
        update_task_patterns = [
            r"(?:update|change|modify|edit)\s+(?:task\s+|#|no\.?\s*)(\d+)(?:\s+(?:to|with|as):\s*(.+)|\s*:\s*(.+))",
            r"(?:task\s+|#|no\.?\s*)(\d+)\s+(?:update|change|modify|edit)\s+(?:to|with|as):\s*(.+)"
        ]

        for pattern in update_task_patterns:
            match = re.search(pattern, message_lower, re.IGNORECASE)
            if match:
                task_id = int(match.group(1))
                # Handle different capture groups depending on the pattern that matched
                title = match.group(2) if match.group(2) else (match.group(3) if match.group(3) else "")
                title = title.strip() if title else ""

                # Call the update_task service
                result = await task_service.update_task(user_id, task_id, title)
                tool_results.append({
                    "name": "update_task",
                    "arguments": {"user_id": user_id, "task_id": task_id, "title": title},
                    "result": result
                })
                break  # Only process the first match

        return tool_results

    async def _generate_response_with_tool_results(self, original_message: str, tool_results: List[Dict[str, Any]]) -> str:
        """
        Generate a natural language response based on the original message and tool results.
        """
        if not tool_results:
            # If no tools were called, provide a helpful response with examples
            return (
                "I'm your Todo Chat Assistant! I can help you manage your tasks. "
                "Try commands like:\n"
                "- \"Add task: Buy groceries\" to create a new task\n"
                "- \"Show my tasks\" to see all your tasks\n"
                "- \"Complete task 5\" to mark a task as done\n"
                "- \"Delete task 3\" to remove a task\n"
                "- \"Update task 2: Call mom tomorrow\" to change a task"
            )

        # Create a response based on the tool results
        responses = []
        for result in tool_results:
            tool_name = result["name"]
            tool_result = result["result"]

            if tool_name == "add_task":
                if tool_result and "title" in tool_result:
                    responses.append(f"✅ I've added the task '{tool_result['title']}' to your list!")
                else:
                    responses.append("❌ Sorry, I couldn't add that task. Please try again.")

            elif tool_name == "list_tasks":
                tasks = tool_result
                if tasks:
                    task_list = "\n".join([f"• {task['title']} (ID: {task['id']})" for task in tasks])
                    status_msg = "all" if not result["arguments"].get("status") or result["arguments"]["status"] == "all" else result["arguments"]["status"]
                    responses.append(f"📋 Here are your {status_msg} tasks:\n{task_list}")
                else:
                    status_msg = "any" if not result["arguments"].get("status") or result["arguments"]["status"] == "all" else result["arguments"]["status"]
                    responses.append(f"You don't have any {status_msg} tasks right now.")

            elif tool_name == "complete_task":
                if tool_result:
                    responses.append(f"✅ Great! I've marked that task as completed.")
                else:
                    responses.append("❌ Sorry, I couldn't find or complete that task. Please check the task ID.")

            elif tool_name == "delete_task":
                if tool_result:
                    responses.append(f"🗑️ I've removed that task from your list.")
                else:
                    responses.append("❌ Sorry, I couldn't find or delete that task. Please check the task ID.")

            elif tool_name == "update_task":
                if tool_result:
                    responses.append(f"✏️ I've updated that task for you.")
                else:
                    responses.append("❌ Sorry, I couldn't find or update that task. Please check the task ID.")
            else:
                responses.append("Operation completed.")

        return " ".join(responses)