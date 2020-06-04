from app import app, db
from app.models import (Comment, ImagePost, Post, Tags, User)
from wtforms.fields.core import Field


@app.shell_context_processor
def make_shell_context():
    return {
        "db": db,
        "User": User,
        "PostModel": Post,
        "ImagePostModel": ImagePost,
        "TagModel": Tags,
        "CommentModel": Comment,
    }


def populate_obj(self, obj, name):
    """
    Populates `obj.<name>` with the field's data.

    :note: This is a destructive operation. If `obj.<name>` already exists,
            it will be overridden. Use with caution.
    """
    self.data = None if self.data == 'None' else self.data
    setattr(obj, name, self.data)


Field.populate_obj = populate_obj

if __name__ == '__main__':
    app.run()
