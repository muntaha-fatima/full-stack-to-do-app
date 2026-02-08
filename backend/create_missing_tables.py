"""
Script to create missing conversation and message tables directly using SQL.
"""

import sqlite3

def create_missing_tables():
    """
    Create missing conversation and message tables directly using SQL.
    """
    print("Connecting to database...")
    conn = sqlite3.connect("./todoapp.db")
    cursor = conn.cursor()
    
    print("Creating conversation table if it doesn't exist...")
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS conversation (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    print("Creating message table if it doesn't exist...")
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS message (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            conversation_id INTEGER NOT NULL,
            role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
            content TEXT NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (conversation_id) REFERENCES conversation (id)
        )
    """)
    
    conn.commit()
    conn.close()
    print("Missing tables created successfully!")


if __name__ == "__main__":
    create_missing_tables()