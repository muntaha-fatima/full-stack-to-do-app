"""
Alembic migration script template.

Revision ID: e68b80f10a45
Revises: 006, c6b5568373fa
Create Date: 2026-01-15 11:03:26.956556+00:00

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e68b80f10a45'
down_revision: Union[str, None] = ('006', 'c6b5568373fa')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
