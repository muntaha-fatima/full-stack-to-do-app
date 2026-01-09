# PostgreSQL Database Skill

## Description
Expert PostgreSQL database architect specializing in schema design, query optimization, indexing strategies, and async operations with SQLAlchemy 2.0.

## Capabilities

### Database Design
- **Schema Design**: Normalized database structures with proper relationships
- **Data Modeling**: Entity-relationship diagrams and table design
- **Constraints**: Primary keys, foreign keys, unique, check constraints
- **Indexes**: B-tree, Hash, GiST, GIN indexes for performance
- **Partitioning**: Table partitioning for large datasets
- **Views**: Materialized and regular views for complex queries

### SQLAlchemy 2.0 ORM
- **Declarative Models**: Type-annotated ORM models with Mapped types
- **Relationships**: One-to-many, many-to-many, one-to-one relationships
- **Async Operations**: Full async/await support with asyncpg
- **Query Building**: Modern select() syntax with type safety
- **Session Management**: Async session handling and connection pooling
- **Migrations**: Alembic for version-controlled schema changes

### Query Optimization
- **EXPLAIN ANALYZE**: Query plan analysis and optimization
- **Index Strategies**: Choosing the right index types
- **Query Rewriting**: Optimizing slow queries
- **Join Optimization**: Efficient join strategies
- **Subquery vs CTE**: When to use each approach
- **Batch Operations**: Bulk inserts and updates

### Data Types
- **Numeric**: INTEGER, BIGINT, DECIMAL, NUMERIC
- **Text**: VARCHAR, TEXT, CHAR
- **Date/Time**: TIMESTAMP, DATE, TIME, INTERVAL
- **JSON**: JSON, JSONB for semi-structured data
- **Arrays**: Array types for lists
- **UUID**: Universally unique identifiers
- **Custom Types**: ENUM and composite types

### Advanced Features
- **Transactions**: ACID compliance and isolation levels
- **Triggers**: Automated actions on data changes
- **Stored Procedures**: PL/pgSQL functions
- **Full-Text Search**: Text search with tsvector and tsquery
- **Window Functions**: Advanced analytical queries
- **CTEs**: Common Table Expressions for complex queries

### Performance & Monitoring
- **Connection Pooling**: PgBouncer or SQLAlchemy pooling
- **Query Performance**: Monitoring slow queries
- **Index Usage**: Analyzing index effectiveness
- **Vacuum & Analyze**: Maintenance operations
- **Replication**: Read replicas for scaling
- **Backup & Recovery**: Point-in-time recovery strategies

## Usage Examples

### SQLAlchemy 2.0 Models

#### Basic Model
```python
from sqlalchemy import String, Integer, Boolean, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, DeclarativeBase
from datetime import datetime

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    username: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
```

#### One-to-Many Relationship
```python
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(50))

    # Relationship
    tasks: Mapped[list["Task"]] = relationship(back_populates="user")

class Task(Base):
    __tablename__ = "tasks"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(200))
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))

    # Relationship
    user: Mapped["User"] = relationship(back_populates="tasks")
```

#### Many-to-Many Relationship
```python
from sqlalchemy import Table, Column, ForeignKey

# Association table
task_tags = Table(
    "task_tags",
    Base.metadata,
    Column("task_id", ForeignKey("tasks.id", ondelete="CASCADE"), primary_key=True),
    Column("tag_id", ForeignKey("tags.id", ondelete="CASCADE"), primary_key=True),
)

class Task(Base):
    __tablename__ = "tasks"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(200))

    tags: Mapped[list["Tag"]] = relationship(
        secondary=task_tags, back_populates="tasks"
    )

class Tag(Base):
    __tablename__ = "tags"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50), unique=True)

    tasks: Mapped[list["Task"]] = relationship(
        secondary=task_tags, back_populates="tags"
    )
```

### Async Database Operations

#### Query Examples
```python
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

# Select single record
async def get_user_by_id(db: AsyncSession, user_id: int):
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    return result.scalar_one_or_none()

# Select multiple records with filter
async def get_active_users(db: AsyncSession):
    result = await db.execute(
        select(User).where(User.is_active == True).order_by(User.created_at.desc())
    )
    return result.scalars().all()

# Join query
async def get_user_with_tasks(db: AsyncSession, user_id: int):
    result = await db.execute(
        select(User)
        .options(selectinload(User.tasks))
        .where(User.id == user_id)
    )
    return result.scalar_one_or_none()

# Aggregate query
async def count_tasks_by_user(db: AsyncSession):
    result = await db.execute(
        select(User.username, func.count(Task.id))
        .join(Task)
        .group_by(User.username)
    )
    return result.all()
```

#### CRUD Operations
```python
# Create
async def create_task(db: AsyncSession, task_data: dict):
    task = Task(**task_data)
    db.add(task)
    await db.commit()
    await db.refresh(task)
    return task

# Update
async def update_task(db: AsyncSession, task_id: int, updates: dict):
    result = await db.execute(
        select(Task).where(Task.id == task_id)
    )
    task = result.scalar_one_or_none()
    if task:
        for key, value in updates.items():
            setattr(task, key, value)
        await db.commit()
        await db.refresh(task)
    return task

# Delete
async def delete_task(db: AsyncSession, task_id: int):
    result = await db.execute(
        select(Task).where(Task.id == task_id)
    )
    task = result.scalar_one_or_none()
    if task:
        await db.delete(task)
        await db.commit()
    return task
```

### Indexing Strategies

```sql
-- B-tree index (default) for equality and range queries
CREATE INDEX idx_users_email ON users(email);

-- Partial index for filtered queries
CREATE INDEX idx_active_users ON users(email) WHERE is_active = true;

-- Composite index for multi-column queries
CREATE INDEX idx_tasks_user_status ON tasks(user_id, status);

-- GIN index for full-text search
CREATE INDEX idx_tasks_search ON tasks USING GIN(to_tsvector('english', title || ' ' || description));

-- Index for JSONB columns
CREATE INDEX idx_metadata ON tasks USING GIN(metadata);

-- Unique index
CREATE UNIQUE INDEX idx_users_username ON users(LOWER(username));
```

### Alembic Migrations

```python
# alembic/versions/001_create_users_table.py
from alembic import op
import sqlalchemy as sa

def upgrade():
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('email', sa.String(255), nullable=False),
        sa.Column('username', sa.String(50), nullable=False),
        sa.Column('hashed_password', sa.String(255), nullable=False),
        sa.Column('is_active', sa.Boolean(), server_default='true'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('idx_users_email', 'users', ['email'], unique=True)
    op.create_index('idx_users_username', 'users', ['username'], unique=True)

def downgrade():
    op.drop_index('idx_users_username')
    op.drop_index('idx_users_email')
    op.drop_table('users')
```

## Best Practices

1. **Use Proper Data Types**: Choose the most appropriate type for each column
2. **Index Strategically**: Index foreign keys and frequently queried columns
3. **Normalize Appropriately**: Balance normalization with query performance
4. **Use Constraints**: Enforce data integrity at the database level
5. **Async All The Way**: Use async operations throughout the stack
6. **Connection Pooling**: Configure appropriate pool sizes
7. **Migrations**: Version control all schema changes with Alembic
8. **Transactions**: Use transactions for data consistency
9. **Query Optimization**: Use EXPLAIN ANALYZE to optimize slow queries
10. **Backup Regularly**: Implement automated backup strategies

## Common Patterns

### Soft Delete
```python
class Task(Base):
    __tablename__ = "tasks"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(200))
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

# Query only non-deleted records
async def get_active_tasks(db: AsyncSession):
    result = await db.execute(
        select(Task).where(Task.deleted_at.is_(None))
    )
    return result.scalars().all()
```

### Audit Trail
```python
class AuditMixin:
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    created_by: Mapped[int | None] = mapped_column(ForeignKey("users.id"))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
    updated_by: Mapped[int | None] = mapped_column(ForeignKey("users.id"))

class Task(Base, AuditMixin):
    __tablename__ = "tasks"
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(200))
```

### UUID Primary Keys
```python
import uuid
from sqlalchemy.dialects.postgresql import UUID

class Task(Base):
    __tablename__ = "tasks"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    title: Mapped[str] = mapped_column(String(200))
```

## Performance Tips

1. **Use Eager Loading**: Avoid N+1 queries with selectinload() or joinedload()
2. **Batch Operations**: Use bulk_insert_mappings() for large inserts
3. **Limit Results**: Always use pagination for large result sets
4. **Index Foreign Keys**: Automatically index all foreign key columns
5. **Analyze Queries**: Regularly run EXPLAIN ANALYZE on slow queries
6. **Connection Pooling**: Configure pool_size and max_overflow appropriately
7. **Vacuum Regularly**: Schedule VACUUM and ANALYZE operations
8. **Monitor Slow Queries**: Use pg_stat_statements extension

## Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [SQLAlchemy 2.0 Documentation](https://docs.sqlalchemy.org/en/20/)
- [Alembic Documentation](https://alembic.sqlalchemy.org/)
- [PostgreSQL Performance Tips](https://wiki.postgresql.org/wiki/Performance_Optimization)
