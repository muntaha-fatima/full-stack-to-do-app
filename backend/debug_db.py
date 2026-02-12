from app.core.config import settings
from app.db.session import engine
import asyncio

async def debug_db():
    print("Database URL:", settings.DATABASE_URL)
    print("Engine URL:", engine.url)
    
    # Try to connect and check if the users table exists
    async with engine.connect() as conn:
        print("Connected to database")
        
        # Check if users table exists
        from sqlalchemy import inspect
        insp = inspect(conn)
        tables = insp.get_table_names()
        print("Tables in database:", tables)
        
        if 'users' in tables:
            # Get column info for users table
            columns = insp.get_columns('users')
            print("Columns in users table:")
            for col in columns:
                print(f"  - {col['name']} ({col['type']})")

if __name__ == "__main__":
    asyncio.run(debug_db())