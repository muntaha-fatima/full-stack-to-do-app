"""
Create login_history table for tracking login activities.

Revision ID: 006
Revises: 005
Create Date: 2026-01-13

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '006'
down_revision: Union[str, None] = '005'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """
    Create login_history table with all required columns and indexes for tracking login activities.
    """
    # Create the login_history table
    op.create_table(
        'login_history',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('ip_address', sa.String(length=45), nullable=False),  # Supports IPv6
        sa.Column('user_agent', sa.String(length=500), nullable=False),
        sa.Column('success', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

    # Create indexes for better query performance
    op.create_index(op.f('ix_login_history_id'), 'login_history', ['id'], unique=False)
    op.create_index(op.f('ix_login_history_user_id'), 'login_history', ['user_id'], unique=False)
    op.create_index(op.f('ix_login_history_created_at'), 'login_history', ['created_at'], unique=False)


def downgrade() -> None:
    """
    Drop login_history table and associated indexes.
    """
    op.drop_index(op.f('ix_login_history_created_at'), table_name='login_history')
    op.drop_index(op.f('ix_login_history_user_id'), table_name='login_history')
    op.drop_index(op.f('ix_login_history_id'), table_name='login_history')
    op.drop_table('login_history')