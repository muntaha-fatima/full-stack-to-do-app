"""
Alembic migration script template.

Revision ID: c6b5568373fa
Revises: a041627b8068
Create Date: 2026-01-09 15:29:41.029081+00:00

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'c6b5568373fa'
down_revision: Union[str, None] = 'a041627b8068'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Check if we're using PostgreSQL or SQLite
    from alembic.context import get_context
    ctx = get_context()
    dialect_name = ctx.dialect.name

    if dialect_name == 'postgresql':
        # For PostgreSQL, use the original alter_column commands
        op.alter_column('tasks', 'due_date',
                   existing_type=postgresql.TIMESTAMP(),
                   type_=sa.DateTime(timezone=True),
                   existing_nullable=True)
        op.alter_column('tasks', 'created_at',
                   existing_type=postgresql.TIMESTAMP(),
                   type_=sa.DateTime(timezone=True),
                   existing_nullable=False)
        op.alter_column('tasks', 'updated_at',
                   existing_type=postgresql.TIMESTAMP(),
                   type_=sa.DateTime(timezone=True),
                   existing_nullable=False)
    else:
        # For SQLite, we can't alter column types directly, so we'll skip this migration
        # since SQLite doesn't enforce strict data types anyway
        pass


def downgrade() -> None:
    # Check if we're using PostgreSQL or SQLite
    from alembic.context import get_context
    ctx = get_context()
    dialect_name = ctx.dialect.name

    if dialect_name == 'postgresql':
        # For PostgreSQL, use the original alter_column commands
        op.alter_column('tasks', 'updated_at',
                   existing_type=sa.DateTime(timezone=True),
                   type_=postgresql.TIMESTAMP(),
                   existing_nullable=False)
        op.alter_column('tasks', 'created_at',
                   existing_type=sa.DateTime(timezone=True),
                   type_=postgresql.TIMESTAMP(),
                   existing_nullable=False)
        op.alter_column('tasks', 'due_date',
                   existing_type=sa.DateTime(timezone=True),
                   type_=postgresql.TIMESTAMP(),
                   existing_nullable=True)
    else:
        # For SQLite, we can't alter column types directly, so we'll skip this migration
        pass
