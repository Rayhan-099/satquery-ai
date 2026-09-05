"""add bands_metadata

Revision ID: 9a59ed83378d
Revises: 8a49ed83378c
Create Date: 2026-09-05 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '9a59ed83378d'
down_revision = '8a49ed83378c'
branch_labels = None
depends_on = None

def upgrade() -> None:
    op.add_column('scenes', sa.Column('bands_metadata', sa.JSON(), nullable=True))

def downgrade() -> None:
    op.drop_column('scenes', 'bands_metadata')
