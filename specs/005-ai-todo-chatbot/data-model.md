# Data Model: AI-Powered Todo Chatbot

## Overview
This document defines the data models for the AI-Powered Todo Chatbot feature, extending the existing Phase II full-stack Todo app with new entities to support conversational interfaces.

## Entity: Conversation
Represents a user's conversation with the AI chatbot.

**Fields**:
- `id` (int, Primary Key, Auto-increment): Unique identifier for the conversation
- `user_id` (str): Identifier for the user who owns this conversation
- `created_at` (datetime): Timestamp when the conversation was initiated
- `updated_at` (datetime): Timestamp when the conversation was last updated

**Relationships**:
- One-to-many with Message (one conversation has many messages)

**Validation rules**:
- `user_id` must correspond to an existing user in the system
- `created_at` and `updated_at` are automatically set by the system

## Entity: Message
Represents individual messages in a conversation.

**Fields**:
- `id` (int, Primary Key, Auto-increment): Unique identifier for the message
- `user_id` (str): Identifier for the user who sent this message
- `conversation_id` (int, Foreign Key): Reference to the parent conversation
- `role` (str): Role of the message sender ("user" or "assistant")
- `content` (text): The actual content of the message
- `created_at` (datetime): Timestamp when the message was created

**Relationships**:
- Many-to-one with Conversation (many messages belong to one conversation)

**Validation rules**:
- `user_id` must correspond to an existing user in the system
- `conversation_id` must reference an existing conversation
- `role` must be either "user" or "assistant"
- `content` must not be empty
- `created_at` is automatically set by the system

## Entity: Task (Extended)
Extends the existing Task entity to support chatbot interactions.

**Additional considerations**:
- The existing Task entity already has fields for `id`, `title`, `description`, `status`, `user_id`, `created_at`, and `updated_at`
- No additional fields are needed for the chatbot functionality
- The existing foreign key relationship with User remains unchanged

**Validation rules**:
- All existing validation rules continue to apply
- Task operations through the chatbot must respect the same validation rules as the existing UI

## State Transitions
Tasks can transition between statuses through chat commands:
- Pending → Completed: Via "complete_task" command
- Completed → Pending: Via "update_task" command to change status
- Task deletion: Via "delete_task" command (removes the task entirely)

## Indexes
- Conversation: Index on `user_id` for efficient retrieval of user's conversations
- Message: Index on `conversation_id` for efficient retrieval of messages in a conversation
- Message: Index on `user_id` for efficient retrieval of user's messages
- Task: Index on `user_id` for efficient retrieval of user's tasks