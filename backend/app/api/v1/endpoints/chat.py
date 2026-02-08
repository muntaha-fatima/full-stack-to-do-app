from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from app.api.deps import get_current_user
from app.services.async_conversation_service import create_conversation, get_conversation_by_id
from app.services.async_message_service import create_message, get_messages_by_conversation
from app.core.agents import TodoAgent
from app.db.session import get_async_db
from app.models.user import User
from sqlmodel.ext.asyncio.session import AsyncSession
import logging


router = APIRouter()

# Set up logger
logger = logging.getLogger(__name__)


class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[int] = None


class ChatResponse(BaseModel):
    conversation_id: int
    response: str
    tool_calls: Optional[List[Dict[str, Any]]] = None


@router.post("/{user_id}/chat", response_model=ChatResponse)
async def chat(
    user_id: str,
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db_session: AsyncSession = Depends(get_async_db),
    background_tasks: BackgroundTasks = BackgroundTasks()
):
    """
    Process a chat message and return AI response.
    Stateless endpoint that receives a user's chat message, processes it using the AI agent,
    and returns an appropriate response. The conversation state is persisted in the database.
    """
    try:
        logger.info(f"Chat endpoint called with user_id: {user_id}")
        logger.info(f"Current user ID from token: {current_user.id}")

        # Verify that the requesting user is the same as the user_id in the path
        # The user_id from the path should match the user_id from the JWT token
        authenticated_user_id = str(current_user.id)
        
        # Check if the user_id in the path matches the authenticated user
        if authenticated_user_id != user_id:
            logger.error(f"User ID mismatch: authenticated user ID is {authenticated_user_id}, but path parameter is {user_id}")
            logger.error(f"This indicates a potential issue with how the frontend is constructing the request URL")
            raise HTTPException(
                status_code=403,
                detail=f"Not authorized to access this conversation. Expected user ID: {authenticated_user_id}"
            )

        conversation = None
        
        # Get or create conversation - wrapped in try/except to catch database errors
        try:
            if request.conversation_id:
                logger.info(f"Fetching existing conversation: {request.conversation_id}")
                conversation = await get_conversation_by_id(db_session, request.conversation_id)
                if not conversation or str(conversation.user_id) != user_id:
                    raise HTTPException(status_code=404, detail="Conversation not found")
            else:
                logger.info("Creating new conversation")
                conversation = await create_conversation(db_session, user_id)
                logger.info(f"Created new conversation with ID: {conversation.id}")
        except HTTPException:
            # Re-raise HTTP exceptions as-is
            raise
        except Exception as db_error:
            logger.error(f"Database error when fetching/creating conversation: {str(db_error)}")
            import traceback
            traceback.print_exc()
            raise HTTPException(
                status_code=500,
                detail="Database error occurred while managing conversation"
            )

        # Save user message to the conversation - wrapped in try/except
        try:
            user_message = await create_message(
                db_session=db_session,
                user_id=user_id,
                conversation_id=conversation.id,
                role="user",
                content=request.message
            )
            logger.info(f"Saved user message: {request.message}")
        except HTTPException:
            # Re-raise HTTP exceptions as-is
            raise
        except Exception as db_error:
            logger.error(f"Database error when saving user message: {str(db_error)}")
            import traceback
            traceback.print_exc()
            raise HTTPException(
                status_code=500,
                detail="Database error occurred while saving message"
            )

        # Get conversation history for context - wrapped in try/except
        try:
            conversation_history = await get_messages_by_conversation(db_session, conversation.id)
            history_for_agent = [
                {"role": msg.role, "content": msg.content}
                for msg in conversation_history[:-1]  # Exclude the current message
            ]
            logger.info(f"Retrieved {len(history_for_agent)} messages from history")
        except HTTPException:
            # Re-raise HTTP exceptions as-is
            raise
        except Exception as db_error:
            logger.error(f"Database error when fetching conversation history: {str(db_error)}")
            import traceback
            traceback.print_exc()
            raise HTTPException(
                status_code=500,
                detail="Database error occurred while fetching conversation history"
            )

        # Process the message with the AI agent - wrapped in try/except to catch API/agent errors
        try:
            agent = TodoAgent()
            logger.info(f"Processing message with agent: {request.message}")
            result = await agent.process_message(user_id, request.message, history_for_agent)
            logger.info(f"Agent response received successfully")
        except HTTPException:
            # Re-raise HTTP exceptions as-is
            raise
        except Exception as agent_error:
            logger.error(f"AI agent error: {str(agent_error)}")
            import traceback
            traceback.print_exc()
            raise HTTPException(
                status_code=500,
                detail=f"AI agent error occurred while processing message: {str(agent_error)}"
            )

        # Save assistant response to the conversation - wrapped in try/except
        try:
            assistant_message = await create_message(
                db_session=db_session,
                user_id=user_id,  # This might be the system/assistant ID in a real implementation
                conversation_id=conversation.id,
                role="assistant",
                content=result["response"]
            )
            logger.info(f"Saved assistant response")
        except HTTPException:
            # Re-raise HTTP exceptions as-is
            raise
        except Exception as db_error:
            logger.error(f"Database error when saving assistant response: {str(db_error)}")
            import traceback
            traceback.print_exc()
            raise HTTPException(
                status_code=500,
                detail="Database error occurred while saving assistant response"
            )

        # Handle potential Unicode encoding issues in the response
        try:
            response_content = result["response"]
            # Ensure the response is properly encoded
            if isinstance(response_content, str):
                # Try to encode to ensure it's valid
                response_content.encode('utf-8')
            
            return ChatResponse(
                conversation_id=conversation.id,
                response=response_content,
                tool_calls=result.get("tool_calls")
            )
        except UnicodeError as unicode_error:
            logger.error(f"Unicode error in response: {str(unicode_error)}")
            # Return a sanitized response if there are unicode issues
            sanitized_response = result["response"].encode('utf-8', errors='replace').decode('utf-8')
            return ChatResponse(
                conversation_id=conversation.id,
                response=sanitized_response,
                tool_calls=result.get("tool_calls")
            )
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        # Log the error and raise a generic server error
        logger.error(f"Unexpected error in chat endpoint: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error processing chat request: {str(e)}"
        )