# Database Migrations with Alembic Skill

## Description
Expert in managing database schema changes using Alembic for SQLAlchemy, including migration creation, version control, and deployment strategies.

## Capabilities

### Migration Management
- **Auto-generation**: Generate migrations from model changes
- **Manual Migrations**: Write custom migration scripts
- **Version Control**: Track schema changes over time
- **Rollback**: Revert migrations safely
- **Branching**: Handle multiple development branches
- **Data Migrations**: Migrate data alongside schema changes

### Migration Operations
- **Create Tables**: Add new tables
- **Alter Tables**: Modify existing tables
- **Add Columns**: Add new columns with defaults
- **Drop Columns**: Remove columns safely
- **Indexes**: Create and drop indexes
- **Constraints**: Add/remove foreign keys, unique constraints
- **Data Transformations**: Migrate existing data

### Best Practices
- **Incremental Changes**: Small, focused migrations
- **Reversible**: Always provide downgrade path
- **Testing**: Test migrations before production
- **Backup**: Always backup before migration
- **Zero-Downtime**: Strategies for production migrations

## Usage Examples

### Alembic Setup

```bash
# Install Alembic
pip install alembic

# Initialize Alembic in your project
cd backend
alembic init alembic

# This creates:
# alembic/
#   ├── env.py
#   ├── script.py.mako
#   └── versions/
# alembic.ini
```

### Alembic Configuration

```python
# alembic/env.py
from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context
import asyncio
from sqlalchemy.ext.asyncio import AsyncEngine

# Import your models and Base
from app.database import Base
from app.models import user, task, comment  # Import all models

# Alembic Config object
config = context.config

# Interpret the config file for Python logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Add your model's MetaData object here for 'autogenerate' support
target_metadata = Base.metadata

def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

def do_run_migrations(connection):
    context.configure(connection=connection, target_metadata=target_metadata)

    with context.begin_transaction():
        context.run_migrations()

async def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    from app.config import settings

    configuration = config.get_section(config.config_ini_section)
    configuration["sqlalchemy.url"] = settings.DATABASE_URL

    connectable = AsyncEngine(
        engine_from_config(
            configuration,
            prefix="sqlalchemy.",
            poolclass=pool.NullPool,
            future=True,
        )
    )

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)

    await connectable.dispose()

if context.is_offline_mode():
    run_migrations_offline()
else:
    asyncio.run(run_migrations_online())
```

```ini
# alembic.ini
[alembic]
script_location = alembic
prepend_sys_path = .
version_path_separator = os

# Template used to generate migration file names
file_template = %%(year)d%%(month).2d%%(day).2d_%%(hour).2d%%(minute).2d_%%(rev)s_%%(slug)s

# Timezone for migration timestamps
timezone = UTC

# Logging configuration
[loggers]
keys = root,sqlalchemy,alembic

[handlers]
keys = console

[formatters]
keys = generic

[logger_root]
level = WARN
handlers = console
qualname =

[logger_sqlalchemy]
level = WARN
handlers =
qualname = sqlalchemy.engine

[logger_alembic]
level = INFO
handlers =
qualname = alembic

[handler_console]
class = StreamHandler
args = (sys.stderr,)
level = NOTSET
formatter = generic

[formatter_generic]
format = %(levelname)-5.5s [%(name)s] %(message)s
datefmt = %H:%M:%S
```

### Creating Migrations

```bash
# Auto-generate migration from model changes
alembic revision --autogenerate -m "create users table"

# Create empty migration for manual changes
alembic revision -m "add custom index"

# Create migration with specific revision ID
alembic revision --rev-id 001 -m "initial schema"
```

### Migration Examples

#### Create Table Migration

```python
# alembic/versions/20240107_1234_create_users_table.py
"""create users table

Revision ID: abc123
Revises:
Create Date: 2024-01-07 12:34:56.789012
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers
revision = 'abc123'
down_revision = None
branch_labels = None
depends_on = None

def upgrade() -> None:
    """Create users table"""
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('email', sa.String(255), nullable=False),
        sa.Column('username', sa.String(50), nullable=False),
        sa.Column('hashed_password', sa.String(255), nullable=False),
        sa.Column('is_active', sa.Boolean(), server_default='true', nullable=False),
        sa.Column('role', sa.String(20), server_default='user', nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )

    # Create indexes
    op.create_index('ix_users_email', 'users', ['email'], unique=True)
    op.create_index('ix_users_username', 'users', ['username'], unique=True)
    op.create_index('ix_users_created_at', 'users', ['created_at'])

def downgrade() -> None:
    """Drop users table"""
    op.drop_index('ix_users_created_at', table_name='users')
    op.drop_index('ix_users_username', table_name='users')
    op.drop_index('ix_users_email', table_name='users')
    op.drop_table('users')
```

#### Add Column Migration

```python
# alembic/versions/20240107_1235_add_user_avatar.py
"""add user avatar column

Revision ID: def456
Revises: abc123
Create Date: 2024-01-07 12:35:00.000000
"""
from alembic import op
import sqlalchemy as sa

revision = 'def456'
down_revision = 'abc123'
branch_labels = None
depends_on = None

def upgrade() -> None:
    """Add avatar_url column to users table"""
    op.add_column(
        'users',
        sa.Column('avatar_url', sa.String(500), nullable=True)
    )

def downgrade() -> None:
    """Remove avatar_url column from users table"""
    op.drop_column('users', 'avatar_url')
```

#### Alter Column Migration

```python
# alembic/versions/20240107_1236_alter_username_length.py
"""alter username max length

Revision ID: ghi789
Revises: def456
Create Date: 2024-01-07 12:36:00.000000
"""
from alembic import op
import sqlalchemy as sa

revision = 'ghi789'
down_revision = 'def456'
branch_labels = None
depends_on = None

def upgrade() -> None:
    """Increase username max length from 50 to 100"""
    op.alter_column(
        'users',
        'username',
        existing_type=sa.String(50),
        type_=sa.String(100),
        existing_nullable=False
    )

def downgrade() -> None:
    """Revert username max length to 50"""
    op.alter_column(
        'users',
        'username',
        existing_type=sa.String(100),
        type_=sa.String(50),
        existing_nullable=False
    )
```

#### Data Migration

```python
# alembic/versions/20240107_1237_migrate_user_roles.py
"""migrate user roles to new format

Revision ID: jkl012
Revises: ghi789
Create Date: 2024-01-07 12:37:00.000000
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql import table, column

revision = 'jkl012'
down_revision = 'ghi789'
branch_labels = None
depends_on = None

def upgrade() -> None:
    """Migrate old role values to new format"""
    # Define table for data migration
    users = table(
        'users',
        column('id', sa.Integer),
        column('role', sa.String)
    )

    # Update role values
    op.execute(
        users.update()
        .where(users.c.role == 'admin_user')
        .values(role='admin')
    )

    op.execute(
        users.update()
        .where(users.c.role == 'regular_user')
        .values(role='user')
    )

def downgrade() -> None:
    """Revert role values to old format"""
    users = table(
        'users',
        column('id', sa.Integer),
        column('role', sa.String)
    )

    op.execute(
        users.update()
        .where(users.c.role == 'admin')
        .values(role='admin_user')
    )

    op.execute(
        users.update()
        .where(users.c.role == 'user')
        .values(role='regular_user')
    )
```

#### Add Foreign Key Migration

```python
# alembic/versions/20240107_1238_add_task_user_fk.py
"""add foreign key from tasks to users

Revision ID: mno345
Revises: jkl012
Create Date: 2024-01-07 12:38:00.000000
"""
from alembic import op
import sqlalchemy as sa

revision = 'mno345'
down_revision = 'jkl012'
branch_labels = None
depends_on = None

def upgrade() -> None:
    """Add foreign key constraint"""
    op.create_foreign_key(
        'fk_tasks_user_id',
        'tasks',
        'users',
        ['user_id'],
        ['id'],
        ondelete='CASCADE'
    )

def downgrade() -> None:
    """Remove foreign key constraint"""
    op.drop_constraint('fk_tasks_user_id', 'tasks', type_='foreignkey')
```

#### Create Index Migration

```python
# alembic/versions/20240107_1239_add_task_indexes.py
"""add indexes for task queries

Revision ID: pqr678
Revises: mno345
Create Date: 2024-01-07 12:39:00.000000
"""
from alembic import op

revision = 'pqr678'
down_revision = 'mno345'
branch_labels = None
depends_on = None

def upgrade() -> None:
    """Create indexes for common queries"""
    # Composite index for user_id and status
    op.create_index(
        'ix_tasks_user_status',
        'tasks',
        ['user_id', 'status']
    )

    # Partial index for incomplete tasks
    op.create_index(
        'ix_tasks_incomplete',
        'tasks',
        ['user_id', 'created_at'],
        postgresql_where=sa.text('completed = false')
    )

    # Full-text search index
    op.execute(
        """
        CREATE INDEX ix_tasks_search ON tasks
        USING GIN(to_tsvector('english', title || ' ' || description))
        """
    )

def downgrade() -> None:
    """Drop indexes"""
    op.drop_index('ix_tasks_search', table_name='tasks')
    op.drop_index('ix_tasks_incomplete', table_name='tasks')
    op.drop_index('ix_tasks_user_status', table_name='tasks')
```

### Running Migrations

```bash
# Show current revision
alembic current

# Show migration history
alembic history

# Show pending migrations
alembic history --verbose

# Upgrade to latest
alembic upgrade head

# Upgrade to specific revision
alembic upgrade abc123

# Upgrade one step
alembic upgrade +1

# Downgrade one step
alembic downgrade -1

# Downgrade to specific revision
alembic downgrade abc123

# Downgrade all
alembic downgrade base

# Show SQL without executing
alembic upgrade head --sql

# Stamp database with revision (without running migration)
alembic stamp head
```

### Migration Script Template

```python
# alembic/script.py.mako
"""${message}

Revision ID: ${up_revision}
Revises: ${down_revision | comma,n}
Create Date: ${create_date}
"""
from alembic import op
import sqlalchemy as sa
${imports if imports else ""}

# revision identifiers, used by Alembic.
revision = ${repr(up_revision)}
down_revision = ${repr(down_revision)}
branch_labels = ${repr(branch_labels)}
depends_on = ${repr(depends_on)}

def upgrade() -> None:
    """Upgrade schema"""
    ${upgrades if upgrades else "pass"}

def downgrade() -> None:
    """Downgrade schema"""
    ${downgrades if downgrades else "pass"}
```

### Zero-Downtime Migration Strategy

```python
# Step 1: Add new column (nullable)
def upgrade() -> None:
    op.add_column('users', sa.Column('new_email', sa.String(255), nullable=True))

# Step 2: Backfill data (separate migration)
def upgrade() -> None:
    op.execute("UPDATE users SET new_email = email WHERE new_email IS NULL")

# Step 3: Make column non-nullable (separate migration)
def upgrade() -> None:
    op.alter_column('users', 'new_email', nullable=False)
    op.create_index('ix_users_new_email', 'users', ['new_email'], unique=True)

# Step 4: Drop old column (separate migration, after deploy)
def upgrade() -> None:
    op.drop_index('ix_users_email', table_name='users')
    op.drop_column('users', 'email')
    op.alter_column('users', 'new_email', new_column_name='email')
```

### Testing Migrations

```python
# tests/test_migrations.py
import pytest
from alembic import command
from alembic.config import Config
from sqlalchemy import create_engine, text

@pytest.fixture
def alembic_config():
    """Create Alembic configuration"""
    config = Config("alembic.ini")
    config.set_main_option("sqlalchemy.url", "postgresql://test:test@localhost/test_db")
    return config

def test_upgrade_downgrade(alembic_config):
    """Test that migrations can upgrade and downgrade"""
    # Upgrade to head
    command.upgrade(alembic_config, "head")

    # Downgrade one step
    command.downgrade(alembic_config, "-1")

    # Upgrade again
    command.upgrade(alembic_config, "head")

def test_migration_data_integrity(alembic_config):
    """Test that data is preserved during migration"""
    engine = create_engine(alembic_config.get_main_option("sqlalchemy.url"))

    # Insert test data
    with engine.connect() as conn:
        conn.execute(text("INSERT INTO users (email, username) VALUES ('test@example.com', 'testuser')"))
        conn.commit()

    # Run migration
    command.upgrade(alembic_config, "head")

    # Verify data still exists
    with engine.connect() as conn:
        result = conn.execute(text("SELECT * FROM users WHERE email = 'test@example.com'"))
        assert result.fetchone() is not None
```

## Best Practices

1. **Small Migrations**: Keep migrations focused and small
2. **Always Reversible**: Provide downgrade path
3. **Test First**: Test migrations on staging before production
4. **Backup Database**: Always backup before running migrations
5. **Review Auto-generated**: Always review auto-generated migrations
6. **Data Migrations**: Separate data migrations from schema changes
7. **Zero-Downtime**: Plan for zero-downtime deployments
8. **Version Control**: Commit migrations to version control
9. **Documentation**: Document complex migrations
10. **Idempotent**: Make migrations idempotent when possible

## Migration Checklist

- [ ] Migration tested locally
- [ ] Migration tested on staging
- [ ] Database backup created
- [ ] Downgrade path tested
- [ ] Data integrity verified
- [ ] Performance impact assessed
- [ ] Rollback plan documented
- [ ] Team notified of migration
- [ ] Migration reviewed by peer
- [ ] Production deployment scheduled

## Common Issues

### Issue: Auto-generate misses changes
**Solution**: Manually review and edit generated migrations

### Issue: Migration fails mid-way
**Solution**: Use transactions and test rollback

### Issue: Slow migration on large table
**Solution**: Use batched updates or online schema change tools

### Issue: Conflicting migrations
**Solution**: Use Alembic's branching and merging features

## Resources

- [Alembic Documentation](https://alembic.sqlalchemy.org/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [Database Migration Best Practices](https://www.brunton-spall.co.uk/post/2014/05/06/database-migrations-done-right/)
- [Zero-Downtime Migrations](https://stripe.com/blog/online-migrations)
