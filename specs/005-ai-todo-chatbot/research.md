# Research: AI-Powered Todo Chatbot

## Overview
This document captures research findings for implementing the AI-Powered Todo Chatbot feature, which extends the existing Phase II full-stack Todo app with a conversational AI interface.

## Decision: MCP Server Implementation
**Rationale**: The specification requires implementing an MCP (Model Context Protocol) server to expose 5 specific tools (add_task, list_tasks, complete_task, delete_task, update_task) using the Official MCP SDK. This approach enables the OpenAI Agent to intelligently invoke tools and chain them when needed.

**Alternatives considered**:
- Direct API calls from the agent: Would bypass the MCP standard and reduce interoperability
- Custom tool framework: Would require more development effort and lack official support

## Decision: OpenAI Agents SDK Integration
**Rationale**: Using the OpenAI Agents SDK allows us to create an intelligent agent that can interpret natural language commands and appropriately call the exposed MCP tools. This SDK provides the necessary infrastructure to connect natural language understanding with tool execution.

**Alternatives considered**:
- Custom NLP solution: Would require significant development effort and likely be less reliable
- Third-party agent frameworks: Might not integrate as seamlessly with the MCP tools

## Decision: Stateless Architecture with Neon DB
**Rationale**: The specification requires a stateless server architecture where all state (tasks, conversations, messages) is stored in Neon DB. This ensures scalability and reliability while maintaining conversation context across requests and server restarts.

**Alternatives considered**:
- In-memory state: Would be lost on server restarts and doesn't scale horizontally
- Client-side storage: Would be less secure and harder to maintain consistency

## Decision: OpenAI ChatKit for Frontend
**Rationale**: The specification explicitly requires integrating OpenAI ChatKit in the frontend for a beautiful, responsive chat UI. This provides a proven, accessible chat interface that handles many UI complexities out of the box.

**Alternatives considered**:
- Custom-built chat interface: Would require significant frontend development effort
- Alternative chat libraries: Might not provide the same level of polish and accessibility

## Decision: SQLModel for New Data Models
**Rationale**: The existing backend uses SQLModel for database interactions, so continuing with this ORM for the new Conversation and Message models maintains consistency and leverages existing infrastructure.

**Alternatives considered**:
- Pure SQLAlchemy: Would require more code changes and break consistency with existing code
- Pydantic only: Would lack ORM capabilities needed for database operations

## Decision: Better Auth Integration
**Rationale**: The specification requires using Better Auth for user_id in tools and endpoints, ensuring proper user identification and authorization for all operations.

**Alternatives considered**:
- JWT tokens: Would require more custom implementation
- Session-based auth: Would add complexity and statefulness