"""
Add tags column to tasks table.

Revision ID: a041627b8068
Revises: 001
Create Date: 2026-01-09 09:53:15.990221+00:00

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = 'a041627b8068'
down_revision: Union[str, None] = '001'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add tags column to tasks table."""
    # Use JSON for SQLite compatibility, ARRAY for PostgreSQL
    from alembic.context import get_context
    from sqlalchemy.engine.reflection import Inspector

    # Check if we're using PostgreSQL or SQLite
    ctx = get_context()
    dialect_name = ctx.dialect.name

    if dialect_name == 'postgresql':
        op.add_column('tasks', sa.Column('tags', postgresql.ARRAY(sa.String()), nullable=True))
    else:
        # For SQLite, use JSON column to store tags as a JSON array
        op.add_column('tasks', sa.Column('tags', sa.JSON(), nullable=True))


def downgrade() -> None:
    """Remove tags column from tasks table."""
    op.drop_column('tasks', 'tags')
