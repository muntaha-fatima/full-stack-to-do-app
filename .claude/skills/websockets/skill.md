# WebSockets & Real-Time Communication Skill

## Description
Expert in implementing real-time features using WebSockets, Server-Sent Events (SSE), and real-time communication patterns for interactive applications.

## Capabilities

### WebSocket Technologies
- **Native WebSockets**: Browser WebSocket API
- **Socket.IO**: Real-time bidirectional communication
- **FastAPI WebSockets**: Python WebSocket support
- **Next.js WebSockets**: Real-time in Next.js apps
- **WebSocket Authentication**: Secure WebSocket connections
- **Connection Management**: Reconnection and heartbeat

### Real-Time Patterns
- **Chat Applications**: Real-time messaging
- **Live Updates**: Real-time data synchronization
- **Notifications**: Push notifications
- **Collaborative Editing**: Multi-user editing
- **Live Dashboards**: Real-time metrics
- **Presence Detection**: Online/offline status

### Server-Sent Events (SSE)
- **One-Way Communication**: Server to client updates
- **Event Streams**: Continuous data streams
- **Auto-Reconnection**: Built-in reconnection
- **Simple Protocol**: HTTP-based streaming

## Usage Examples

### FastAPI WebSocket Server

```python
# app/websocket/manager.py
from fastapi import WebSocket, WebSocketDisconnect
from typing import Dict, List
import json
import logging

logger = logging.getLogger(__name__)

class ConnectionManager:
    """Manage WebSocket connections"""

    def __init__(self):
        # Store active connections by user_id
        self.active_connections: Dict[int, List[WebSocket]] = {}
        # Store connections by room
        self.rooms: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, user_id: int):
        """Accept and store a new connection"""
        await websocket.accept()

        if user_id not in self.active_connections:
            self.active_connections[user_id] = []

        self.active_connections[user_id].append(websocket)

        logger.info(f"User {user_id} connected. Total connections: {self.get_connection_count()}")

    def disconnect(self, websocket: WebSocket, user_id: int):
        """Remove a connection"""
        if user_id in self.active_connections:
            self.active_connections[user_id].remove(websocket)

            if not self.active_connections[user_id]:
                del self.active_connections[user_id]

        # Remove from all rooms
        for room_connections in self.rooms.values():
            if websocket in room_connections:
                room_connections.remove(websocket)

        logger.info(f"User {user_id} disconnected. Total connections: {self.get_connection_count()}")

    async def send_personal_message(self, message: dict, user_id: int):
        """Send message to specific user"""
        if user_id in self.active_connections:
            for connection in self.active_connections[user_id]:
                try:
                    await connection.send_json(message)
                except Exception as e:
                    logger.error(f"Error sending message to user {user_id}: {e}")

    async def broadcast(self, message: dict, exclude_user: int = None):
        """Broadcast message to all connected users"""
        for user_id, connections in self.active_connections.items():
            if exclude_user and user_id == exclude_user:
                continue

            for connection in connections:
                try:
                    await connection.send_json(message)
                except Exception as e:
                    logger.error(f"Error broadcasting to user {user_id}: {e}")

    async def join_room(self, websocket: WebSocket, room: str):
        """Add connection to a room"""
        if room not in self.rooms:
            self.rooms[room] = []

        if websocket not in self.rooms[room]:
            self.rooms[room].append(websocket)

        logger.info(f"Connection joined room {room}")

    async def leave_room(self, websocket: WebSocket, room: str):
        """Remove connection from a room"""
        if room in self.rooms and websocket in self.rooms[room]:
            self.rooms[room].remove(websocket)

            if not self.rooms[room]:
                del self.rooms[room]

        logger.info(f"Connection left room {room}")

    async def broadcast_to_room(self, message: dict, room: str):
        """Broadcast message to all connections in a room"""
        if room in self.rooms:
            for connection in self.rooms[room]:
                try:
                    await connection.send_json(message)
                except Exception as e:
                    logger.error(f"Error broadcasting to room {room}: {e}")

    def get_connection_count(self) -> int:
        """Get total number of active connections"""
        return sum(len(connections) for connections in self.active_connections.values())

    def get_room_users(self, room: str) -> int:
        """Get number of users in a room"""
        return len(self.rooms.get(room, []))

# Create global connection manager
manager = ConnectionManager()

# app/routers/websocket.py
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from app.websocket.manager import manager
from app.auth.jwt import get_current_user_ws
from app.models.user import User

router = APIRouter()

@router.websocket("/ws/{client_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    client_id: str,
    token: str = None
):
    """WebSocket endpoint for real-time communication"""

    # Authenticate user
    try:
        user = await get_current_user_ws(token)
    except Exception:
        await websocket.close(code=1008, reason="Unauthorized")
        return

    # Connect user
    await manager.connect(websocket, user.id)

    try:
        # Send welcome message
        await manager.send_personal_message({
            "type": "connection",
            "message": "Connected successfully",
            "user_id": user.id
        }, user.id)

        # Broadcast user joined
        await manager.broadcast({
            "type": "user_joined",
            "user_id": user.id,
            "username": user.username
        }, exclude_user=user.id)

        # Listen for messages
        while True:
            data = await websocket.receive_json()

            message_type = data.get("type")

            if message_type == "message":
                # Broadcast message to all users
                await manager.broadcast({
                    "type": "message",
                    "user_id": user.id,
                    "username": user.username,
                    "content": data.get("content"),
                    "timestamp": datetime.utcnow().isoformat()
                })

            elif message_type == "join_room":
                room = data.get("room")
                await manager.join_room(websocket, room)
                await manager.broadcast_to_room({
                    "type": "user_joined_room",
                    "user_id": user.id,
                    "username": user.username,
                    "room": room
                }, room)

            elif message_type == "leave_room":
                room = data.get("room")
                await manager.leave_room(websocket, room)
                await manager.broadcast_to_room({
                    "type": "user_left_room",
                    "user_id": user.id,
                    "username": user.username,
                    "room": room
                }, room)

            elif message_type == "typing":
                # Broadcast typing indicator
                await manager.broadcast({
                    "type": "typing",
                    "user_id": user.id,
                    "username": user.username
                }, exclude_user=user.id)

    except WebSocketDisconnect:
        manager.disconnect(websocket, user.id)
        await manager.broadcast({
            "type": "user_left",
            "user_id": user.id,
            "username": user.username
        })
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        manager.disconnect(websocket, user.id)
```

### React WebSocket Client

```typescript
// hooks/useWebSocket.ts
import { useEffect, useRef, useState, useCallback } from 'react'

interface WebSocketMessage {
  type: string
  [key: string]: any
}

interface UseWebSocketOptions {
  url: string
  token?: string
  onMessage?: (message: WebSocketMessage) => void
  onConnect?: () => void
  onDisconnect?: () => void
  onError?: (error: Event) => void
  reconnectInterval?: number
  maxReconnectAttempts?: number
}

export function useWebSocket({
  url,
  token,
  onMessage,
  onConnect,
  onDisconnect,
  onError,
  reconnectInterval = 3000,
  maxReconnectAttempts = 5,
}: UseWebSocketOptions) {
  const [isConnected, setIsConnected] = useState(false)
  const [reconnectAttempts, setReconnectAttempts] = useState(0)
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>()

  const connect = useCallback(() => {
    try {
      const wsUrl = token ? `${url}?token=${token}` : url
      const ws = new WebSocket(wsUrl)

      ws.onopen = () => {
        console.log('WebSocket connected')
        setIsConnected(true)
        setReconnectAttempts(0)
        onConnect?.()
      }

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data)
          onMessage?.(message)
        } catch (error) {
          console.error('Error parsing WebSocket message:', error)
        }
      }

      ws.onclose = () => {
        console.log('WebSocket disconnected')
        setIsConnected(false)
        onDisconnect?.()

        // Attempt reconnection
        if (reconnectAttempts < maxReconnectAttempts) {
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log(`Reconnecting... (attempt ${reconnectAttempts + 1})`)
            setReconnectAttempts(prev => prev + 1)
            connect()
          }, reconnectInterval)
        }
      }

      ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        onError?.(error)
      }

      wsRef.current = ws
    } catch (error) {
      console.error('Error creating WebSocket:', error)
    }
  }, [url, token, reconnectAttempts, maxReconnectAttempts, reconnectInterval])

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
  }, [])

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message))
    } else {
      console.warn('WebSocket is not connected')
    }
  }, [])

  useEffect(() => {
    connect()
    return () => disconnect()
  }, [connect, disconnect])

  return {
    isConnected,
    sendMessage,
    disconnect,
    reconnect: connect,
  }
}

// components/Chat.tsx
import { useState, useEffect, useRef } from 'react'
import { useWebSocket } from '@/hooks/useWebSocket'

interface Message {
  id: string
  user_id: number
  username: string
  content: string
  timestamp: string
}

export function Chat({ userId, token }: { userId: number; token: string }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set())
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  const { isConnected, sendMessage } = useWebSocket({
    url: `ws://localhost:8000/ws/${userId}`,
    token,
    onMessage: (message) => {
      switch (message.type) {
        case 'message':
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            user_id: message.user_id,
            username: message.username,
            content: message.content,
            timestamp: message.timestamp,
          }])
          break

        case 'typing':
          setTypingUsers(prev => new Set(prev).add(message.username))
          setTimeout(() => {
            setTypingUsers(prev => {
              const next = new Set(prev)
              next.delete(message.username)
              return next
            })
          }, 3000)
          break

        case 'user_joined':
          console.log(`${message.username} joined`)
          break

        case 'user_left':
          console.log(`${message.username} left`)
          break
      }
    },
    onConnect: () => {
      console.log('Connected to chat')
    },
    onDisconnect: () => {
      console.log('Disconnected from chat')
    },
  })

  const handleSendMessage = () => {
    if (inputValue.trim() && isConnected) {
      sendMessage({
        type: 'message',
        content: inputValue.trim(),
      })
      setInputValue('')
    }
  }

  const handleTyping = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    sendMessage({ type: 'typing' })

    typingTimeoutRef.current = setTimeout(() => {
      // Stop typing indicator after 3 seconds
    }, 3000)
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto">
      {/* Connection status */}
      <div className={`p-2 text-center ${isConnected ? 'bg-green-100' : 'bg-red-100'}`}>
        {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.user_id === userId ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                message.user_id === userId
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-900'
              }`}
            >
              {message.user_id !== userId && (
                <p className="text-xs font-semibold mb-1">{message.username}</p>
              )}
              <p>{message.content}</p>
              <p className="text-xs opacity-75 mt-1">
                {new Date(message.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Typing indicator */}
      {typingUsers.size > 0 && (
        <div className="px-4 py-2 text-sm text-gray-600">
          {Array.from(typingUsers).join(', ')} {typingUsers.size === 1 ? 'is' : 'are'} typing...
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value)
              handleTyping()
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage()
              }
            }}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border rounded-lg"
            disabled={!isConnected}
          />
          <button
            onClick={handleSendMessage}
            disabled={!isConnected || !inputValue.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
```

### Server-Sent Events (SSE)

```python
# app/routers/sse.py
from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse
import asyncio
import json
from datetime import datetime

router = APIRouter()

async def event_generator(request: Request):
    """Generate server-sent events"""
    try:
        while True:
            # Check if client is still connected
            if await request.is_disconnected():
                break

            # Generate event data
            data = {
                "timestamp": datetime.utcnow().isoformat(),
                "message": "Server update",
                "value": random.randint(1, 100)
            }

            # Format as SSE
            yield f"data: {json.dumps(data)}\n\n"

            # Wait before next event
            await asyncio.sleep(1)

    except asyncio.CancelledError:
        print("Client disconnected")

@router.get("/events")
async def sse_endpoint(request: Request):
    """SSE endpoint for real-time updates"""
    return StreamingResponse(
        event_generator(request),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"  # Disable nginx buffering
        }
    )

# React SSE client
import { useEffect, useState } from 'react'

export function useSSE(url: string) {
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const eventSource = new EventSource(url)

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        setData(data)
      } catch (err) {
        setError(err as Error)
      }
    }

    eventSource.onerror = (err) => {
      console.error('SSE error:', err)
      setError(new Error('SSE connection error'))
      eventSource.close()
    }

    return () => {
      eventSource.close()
    }
  }, [url])

  return { data, error }
}

// Usage
function LiveDashboard() {
  const { data, error } = useSSE('/api/events')

  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <h1>Live Dashboard</h1>
      {data && (
        <div>
          <p>Timestamp: {data.timestamp}</p>
          <p>Value: {data.value}</p>
        </div>
      )}
    </div>
  )
}
```

### Presence Detection

```python
# app/websocket/presence.py
from typing import Dict, Set
from datetime import datetime

class PresenceManager:
    """Track online/offline status of users"""

    def __init__(self):
        self.online_users: Set[int] = set()
        self.last_seen: Dict[int, datetime] = {}

    def user_online(self, user_id: int):
        """Mark user as online"""
        self.online_users.add(user_id)
        self.last_seen[user_id] = datetime.utcnow()

    def user_offline(self, user_id: int):
        """Mark user as offline"""
        self.online_users.discard(user_id)
        self.last_seen[user_id] = datetime.utcnow()

    def is_online(self, user_id: int) -> bool:
        """Check if user is online"""
        return user_id in self.online_users

    def get_online_users(self) -> list[int]:
        """Get list of online users"""
        return list(self.online_users)

    def get_last_seen(self, user_id: int) -> datetime | None:
        """Get last seen timestamp"""
        return self.last_seen.get(user_id)

presence_manager = PresenceManager()
```

## Best Practices

1. **Authentication**: Secure WebSocket connections with tokens
2. **Heartbeat**: Implement ping/pong for connection health
3. **Reconnection**: Auto-reconnect with exponential backoff
4. **Message Validation**: Validate all incoming messages
5. **Rate Limiting**: Prevent message flooding
6. **Error Handling**: Graceful error handling and recovery
7. **Connection Limits**: Limit connections per user
8. **Message Queue**: Queue messages during disconnection
9. **Scalability**: Use Redis for multi-server setups
10. **Monitoring**: Track connection metrics

## WebSocket Checklist

- [ ] Authentication implemented
- [ ] Reconnection logic working
- [ ] Heartbeat/ping-pong configured
- [ ] Error handling in place
- [ ] Message validation
- [ ] Rate limiting configured
- [ ] Connection cleanup on disconnect
- [ ] Scalability considered
- [ ] Monitoring and logging
- [ ] Security headers set

## Resources

- [FastAPI WebSockets](https://fastapi.tiangolo.com/advanced/websockets/)
- [MDN WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [Socket.IO Documentation](https://socket.io/docs/)
- [Server-Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
