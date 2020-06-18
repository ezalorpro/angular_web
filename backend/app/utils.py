import os.path as op

import wtforms
from functools import wraps
from werkzeug.security import generate_password_hash
from werkzeug.utils import secure_filename
from wtforms import ValidationError, SelectMultipleField, widgets
from flask import current_app

from app import login_manager, db
from flask_login import current_user
from app.models import User, Post, ph, ImagePost, Tags


class CustomPasswordField(wtforms.PasswordField):
    def populate_obj(self, obj, name):
        if obj.password:
            if not obj.check_password(self.data) and self.data:
                setattr(obj, "password", ph.hash(self.data))
        else:
            if self.data:
                setattr(obj, "password", ph.hash(self.data))

def prefix_name(obj, file_data):
    parts = op.splitext(file_data.filename)
    return secure_filename(obj.username + "-%s%s" % parts)


class MultiCheckboxField(SelectMultipleField):
    widget = widgets.TableWidget(with_table_tag=False)
    option_widget = widgets.CheckboxInput()

  
def manage_images(post):
    images1 = ImagePost.query.filter_by(post=None).all()
    if images1:
        for image in images1:
            print(image.image_name)
            print(post.post_text)
            print(image.image_name in post.post_text)
            if image.image_name in post.post_text:
                image.post = post
            elif image.user == post.user:
                db.session.delete(image)

    images2 = ImagePost.query.filter_by(post=post).all()
    if images2:
        for image in images2:
            if image.image_name not in post.post_text:
                db.session.delete(image)
                

def add_tags(tag):
    existing_tag = Tags.query.filter(Tags.name == tag.lower()).first()
    if existing_tag is not None:
        return existing_tag
    else:
       new_tag = Tags()
       new_tag.name = tag.lower()
       return new_tag