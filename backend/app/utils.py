import os.path as op

import wtforms
from functools import wraps
from werkzeug.security import generate_password_hash
from werkzeug.utils import secure_filename
from wtforms import ValidationError, SelectMultipleField, widgets
from flask import current_app

from app import login_manager
from flask_login import current_user
from app.models import User, Post, ph


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