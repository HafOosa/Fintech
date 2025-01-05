"""add category to wallet transaction

Revision ID: 6c8991434012
Revises: 
Create Date: 2025-01-04 16:01:27.026467

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '6c8991434012'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.add_column('wallet_transactions', sa.Column('category', sa.String(length=255), nullable=True))

def downgrade():
    op.drop_column('wallet_transactions', 'category')
