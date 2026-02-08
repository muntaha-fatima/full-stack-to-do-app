"""Add Conversation and Message models

Revision ID: 2026_02_03_1200-conversation_message_models
Revises: 2026_01_18_1145-643f1ddc021c_add_missing_columns_to_tasks_table
Create Date: 2026-02-03 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel
from sqlalchemy.dialects import postgresql

# revision identifiers
revision = '2026_02_03_1200-conversation_message_models'
down_revision = '2026_01_18_1145-643f1ddc021c_add_missing_columns_to_tasks_table'
branch_labels = None
depends_on = None


def upgrade():
    # Create conversation table
    op.create_table('conversation',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.String(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_conversation_user_id'), 'conversation', ['user_id'], unique=False)

    # Create message table
    op.create_table('message',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.String(), nullable=False),
        sa.Column('conversation_id', sa.Integer(), nullable=False),
        sa.Column('role', sa.String(), nullable=False),
        sa.Column('content', sa.String(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_message_user_id'), 'message', ['user_id'], unique=False)
    op.create_index(op.f('ix_message_conversation_id'), 'message', ['conversation_id'], unique=False)
    
    # Add foreign key constraint
    op.create_foreign_key(
        'fk_message_conversation_id_conversation',
        'message', 'conversation',
        ['conversation_id'], ['id']
    )


def downgrade():
    # Drop foreign key constraint
    op.drop_constraint(
        'fk_message_conversation_id_conversation',
        'message',
        type_='foreignkey'
    )

    # Drop indexes
    op.drop_index(op.f('ix_message_conversation_id'), table_name='message')
    op.drop_index(op.f('ix_message_user_id'), table_name='message')
    op.drop_index(op.f('ix_conversation_user_id'), table_name='conversation')

    # Drop tables
    op.drop_table('message')
    op.drop_table('conversation')