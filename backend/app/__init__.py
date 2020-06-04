import os
import os.path as op

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api
from flask_marshmallow import Marshmallow
from flask_admin import Admin
from flask_login import LoginManager
from flask_cors import CORS

import flask_praetorian as fprae

file_path = op.join(op.dirname(__file__), "static/images")

try:
    os.mkdir(file_path)
except OSError:
    pass

app = Flask(__name__, static_folder="static")
app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql:///php_web"
app.config['SECRET_KEY'] = "157c03c94cc1aa67b95cad155a095b23"
app.config['JWT_ACCESS_LIFESPAN'] = {'seconds': 86400}
app.config['JWT_REFRESH_LIFESPAN'] = {'days': 30}
app.config['PRAETORIAN_HASH_SCHEME'] = 'argon2'

cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
api = Api(app)
guard = fprae.Praetorian()
db = SQLAlchemy(app)
ma = Marshmallow(app)
login_manager = LoginManager(app)
login_manager.init_app(app)


from app import admin_views


admin = Admin(
    app,
    name="Flask Web",
    template_mode="bootstrap3",
    index_view=admin_views.MyAdminIndexView(name='Resumen'),
    base_template='admin/mybase.html'
)


from app import admin_views, forms, models, views, restful


guard.init_app(app, models.User)

admin.add_view(admin_views.UserView(models.User, db.session, category="Usuario"))
# admin.add_view(admin_views.PostView(models.PostModel, db.session, category="Post"))
# admin.add_view(admin_views.ImagesView(models.ImagePostModel, db.session, category="Post"))
# admin.add_view(admin_views.TagsView(models.TagModel, db.session, category="Post"))
# admin.add_view(admin_views.CommentsView(models.CommentModel, db.session, category="Post"))
admin.add_view(admin_views.AdminLoginView(endpoint="login"))
