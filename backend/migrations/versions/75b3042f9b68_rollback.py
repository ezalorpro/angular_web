"""rollback

Revision ID: 75b3042f9b68
Revises: f4b783360d03
Create Date: 2020-06-05 21:24:39.452252

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '75b3042f9b68'
down_revision = 'f4b783360d03'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint('tags_post_tags_id_fkey', 'tags_post', type_='foreignkey')
    op.create_foreign_key(None, 'tags_post', 'tags', ['tags_id'], ['id'])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'tags_post', type_='foreignkey')
    op.create_foreign_key('tags_post_tags_id_fkey', 'tags_post', 'tags', ['tags_id'], ['id'], ondelete='CASCADE')
    # ### end Alembic commands ###
