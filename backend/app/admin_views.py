import datetime
import json
import os
import re
from datetime import date

import wtforms
from flask import flash, jsonify, redirect, render_template, request, url_for
from flask_admin import AdminIndexView, BaseView, expose, form, helpers
from flask_admin.contrib.sqla import ModelView
from flask_admin.model import typefmt
from flask_login import current_user, login_url, login_user, logout_user
from jinja2 import Markup
from sqlalchemy import func
from sqlalchemy.event import listens_for
from wtforms import validators

from app import app, db, file_path, login_manager, op
from app.forms import LoginForm
from app.models import Post, User
from app.utils import CustomPasswordField, prefix_name, MultiCheckboxField


def date_format(view, value):
    return value.strftime("%d/%m/%Y  %I:%M:%S %p")


MY_DEFAULT_FORMATTERS = dict(typefmt.BASE_FORMATTERS)
MY_DEFAULT_FORMATTERS.update({date: date_format})


class MyAdminIndexView(AdminIndexView):
    column_type_formatters = MY_DEFAULT_FORMATTERS

    @expose("/")
    def index(self):
        self._template_args["posts"] = Post.query.order_by("post_date").all()[::-1]
        self._template_args["usuarios"] = User.query.order_by(User.id).all()[:10]
        return super(MyAdminIndexView, self).index()

    @expose("/logout/")
    def logout(self):
        logout_user()
        return redirect(url_for(".index"))

    def is_accessible(self):
        return current_user.is_authenticated and (
            set.intersection(
                set(current_user.roles), set(["ROLE_ADMIN", "ROLE_EDITOR"])
                )
            )

    def inaccessible_callback(self, name, **kwargs):
        return redirect(url_for("login.admin_login"))


class AdminLoginView(BaseView):
    @expose("/", methods=["GET", "POST"])
    def admin_login(self):
        form = LoginForm()
        if request.method == "POST":
            if helpers.validate_form_on_submit(form):
                user = User.query.filter(User.username == form.username.data).first()
                print(user.roles)
                if (set.intersection(set(user.roles), set(["ROLE_ADMIN", "ROLE_EDITOR"]))):
                    login_user(user, remember=form.recordar.data)
                    if request.form.get("next"):
                        return redirect(request.form.get("next"))
                    return redirect(url_for("admin.index"))
                else:
                    flash("Solo administradores y editores pueden acceder")
                    return self.render("admin/admin_login.html", form=form)
            else:
                return self.render("admin/admin_login.html", form=form)
        else:
            return self.render("admin/admin_login.html", form=form)

    def is_accessible(self):
        return not current_user.is_authenticated

    def inaccessible_callback(self, name, **kwargs):
        return """<h2> Acceso no autorizado </h2> <a href="/">Regresar</a>"""


class UserView(ModelView):
    can_view_details = True
    column_type_formatters = MY_DEFAULT_FORMATTERS
    form_extra_fields = {
        "password1": CustomPasswordField(
            "Contraseña", validators=[validators.InputRequired()]
        ),
        "password2": CustomPasswordField("Contraseña"),
        "avatar": form.ImageUploadField(
            "Avatar",
            base_path=file_path,
            namegen=prefix_name,
            url_relative_path="images/",
        ),
        "gender": wtforms.SelectField(
            validate_choice=False,
            label="Genero",
            choices=[(None, "--"), ("hombre", "Hombre"), ("mujer", "Mujer")],
        ),
        "roles": MultiCheckboxField(
            label="Roles",
            choices=[
                ("ROLE_USER", "Usuario regular"),
                ("ROLE_EDITOR", "Editor"),
                ("ROLE_ADMIN", "Admin"),
            ],
        ),
    }

    column_list = [
        "username",
        "email",
        "first_name",
        "last_name",
        "location",
        "gender",
        "roles",
        "avatar",
    ]

    form_create_rules = [
        form.rules.FieldSet(
            [
                "username",
                "password1",
                "email",
                "first_name",
                "last_name",
                "location",
                "gender",
                "information",
                "roles",
                "avatar",
            ]
        )
    ]

    form_edit_rules = [
        form.rules.FieldSet(
            [
                "username",
                "password2",
                "email",
                "first_name",
                "last_name",
                "location",
                "gender",
                "information",
                "roles",
                "avatar",
            ]
        )
    ]
    form_widget_args = {
        "username": {"Autocomplete": "off"},
        "password1": {"Autocomplete": "off"},
        "password2": {"Autocomplete": "off"},
        "email": {"Autocomplete": "off"},
    }

    def _list_thumbnail(self, context, model, name):
        if not model.avatar:
            return Markup(
                '<img src="%s" height="50">'
                % url_for("static", filename="images/default.png")
            )

        return Markup(
            '<img src="%s" height="50">'
            % url_for(
                "static", filename="images/" + model.avatar
            )
        )

    column_formatters = {"avatar": _list_thumbnail}
    form_formatters = {"avatar": _list_thumbnail}

    def is_accessible(self):
        return current_user.is_authenticated and 'ROLE_ADMIN' in current_user.roles

    def inaccessible_callback(self, name, **kwargs):
        return redirect(url_for("login.admin_login"))


# class PostView(ModelView):
#     can_view_details = True
#     column_type_formatters = MY_DEFAULT_FORMATTERS
#     column_type_formatters_detail = MY_DEFAULT_FORMATTERS
#     details_template = "admin/details_post.html"
#     edit_template = "admin/edit_post.html"
#     create_template = "admin/create_post.html"

#     form_args = dict(
#         user=dict(
#             label="Usuario",
#             validators=[validators.DataRequired()],
#             default=current_user,
#         ),
#         tags=dict(
#             label="Tags",
#             validators=[validators.DataRequired("Debe agregar al menos un tag")],
#         ),
#     )
#     column_list = ["user", "title", "post_date", "post_modified"]
#     column_details_list = [
#         "user",
#         "title",
#         "post_text",
#         "post_date",
#         "post_modified",
#         "tags",
#         "comments",
#     ]
#     form_columns = ["user", "title", "post_text", "tags"]
#     form_widget_args = {
#         "user": {"required": True, "disabled": True},
#         "post_date": {"readonly": True},
#         "post_modified": {"readonly": True},
#     }

#     @staticmethod
#     def after_model_change(form, model, is_created):
#         from flask_web_app.views import manage_images

#         manage_images(model)
#         db.session.commit()

#     def get_query(self):
#         if current_user.role in ["admin"]:
#             return self.session.query(self.model)
#         else:
#             return super(PostView, self).get_query().filter_by(user=current_user)

#     def get_count_query(self):
#         if current_user.role in ["admin"]:
#             return self.session.query(func.count(PostModel.id)).select_from(self.model)
#         else:
#             return (
#                 self.session.query(func.count(PostModel.id))
#                 .select_from(self.model)
#                 .filter_by(user=current_user)
#             )

#     def is_accessible(self):
#         return current_user.is_authenticated and current_user.role in [
#             "admin",
#             "editor",
#         ]

#     def inaccessible_callback(self, name, **kwargs):
#         return redirect(url_for("login.admin_login"))


# class ImagesView(ModelView):
#     column_type_formatters = MY_DEFAULT_FORMATTERS
#     form_args = dict(
#         post=dict(label="Post", validators=[validators.DataRequired()]),
#         user=dict(label="Usuario", validators=[validators.DataRequired()]),
#     )

#     def is_accessible(self):
#         return current_user.is_authenticated and current_user.role == "admin"

#     def inaccessible_callback(self, name, **kwargs):
#         return redirect(url_for("login.admin_login"))


# class TagsView(ModelView):

#     column_list = ["name", "posts"]

#     def is_accessible(self):
#         return current_user.is_authenticated and current_user.role == "admin"

#     def inaccessible_callback(self, name, **kwargs):
#         return redirect(url_for("login.admin_login"))


# class CommentsView(ModelView):
#     column_type_formatters = MY_DEFAULT_FORMATTERS
#     column_type_formatters_detail = MY_DEFAULT_FORMATTERS
#     form_columns = ["comment_text", "postmodel", "user"]
    
#     def is_accessible(self):
#         return current_user.is_authenticated and current_user.role == "admin"

#     def inaccessible_callback(self, name, **kwargs):
#         return redirect(url_for("login.admin_login"))


@login_manager.user_loader
def load_user(id):
    return User.query.get(int(id))


@listens_for(User, "after_delete")
def del_user(mapper, connection, target):
    if target.avatar:
        # Delete image
        try:
            os.remove(op.join(file_path, target.avatar))
        except OSError:
            pass

        # Delete thumbnail
        try:
            os.remove(op.join(file_path, form.thumbgen_filename(target.avatar)))
        except OSError:
            pass