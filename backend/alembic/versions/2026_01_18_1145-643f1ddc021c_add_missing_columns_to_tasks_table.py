"""
Add missing columns to tasks table.

Revision ID: 643f1ddc021c
Revises: e68b80f10a45
Create Date: 2026-01-18 11:45:51.266982+00:00

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '643f1ddc021c'
down_revision: Union[str, None] = 'e68b80f10a45'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Use batch mode for SQLite compatibility - add columns first without constraints
    with op.batch_alter_table('tasks') as batch_op:
        # Add missing columns to tasks table
        batch_op.add_column(sa.Column('reminder_time', sa.DateTime(timezone=True), nullable=True))
        batch_op.add_column(sa.Column('recurrence_pattern', sa.Enum('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY', name='recurrencepattern'), nullable=True))
        batch_op.add_column(sa.Column('recurrence_interval', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('recurrence_end_date', sa.DateTime(timezone=True), nullable=True))
        batch_op.add_column(sa.Column('parent_task_id', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('owner_id', sa.Integer(), nullable=True))  # Making it nullable initially
        batch_op.add_column(sa.Column('category_id', sa.Integer(), nullable=True))

        # Create indexes
        batch_op.create_index(op.f('ix_tasks_category_id'), ['category_id'], unique=False)
        batch_op.create_index(op.f('ix_tasks_owner_id'), ['owner_id'], unique=False)
        batch_op.create_index(op.f('ix_tasks_parent_task_id'), ['parent_task_id'], unique=False)

    # Update the owner_id column to be non-nullable after populating existing records
    # First, set any NULL values to a default user ID (e.g., 1) or handle appropriately
    # For this migration, we'll assume all existing tasks belong to user ID 1
    op.execute("UPDATE tasks SET owner_id = 1 WHERE owner_id IS NULL")

    # Now make the owner_id column non-nullable
    with op.batch_alter_table('tasks') as batch_op:
        batch_op.alter_column('owner_id', nullable=False)


def downgrade() -> None:
    # Reverse the changes
    with op.batch_alter_table('tasks') as batch_op:
        batch_op.alter_column('owner_id', nullable=True)

    with op.batch_alter_table('tasks') as batch_op:
        # Drop indexes
        batch_op.drop_index(op.f('ix_tasks_parent_task_id'))
        batch_op.drop_index(op.f('ix_tasks_owner_id'))
        batch_op.drop_index(op.f('ix_tasks_category_id'))

        # Drop columns
        batch_op.drop_column('category_id')
        batch_op.drop_column('owner_id')
        batch_op.drop_column('parent_task_id')
        batch_op.drop_column('recurrence_end_date')
        batch_op.drop_column('recurrence_interval')
        batch_op.drop_column('recurrence_pattern')
        batch_op.drop_column('reminder_time')
