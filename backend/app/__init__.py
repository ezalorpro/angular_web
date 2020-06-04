import os
import os.path as op

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api
from flask_marshmallow import Marshmallow
from flask_uploads import UploadSet, IMAGES, configure_uploads, patch_request_class
from flask_admin import Admin
from flask_migrate import Migrate
from flask_login import LoginManager
from flask_wtf import CSRFProtect
from flask_cors import CORS

import flask_praetorian as fprae

file_path = op.join(op.dirname(__file__), "static/images")

try:
    os.mkdir(file_path)
except OSError:
    pass

app = Flask(__name__, static_folder="static")
app.config.from_pyfile("../instance/config.py")


cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
api = Api(app)
guard = fprae.Praetorian()
db = SQLAlchemy(app)
migrate = Migrate(app, db, compare_type=True)
ma = Marshmallow(app)
login_manager = LoginManager(app)
login_manager.init_app(app)
photos = UploadSet("photos", IMAGES)
configure_uploads(app, photos)
patch_request_class(app)
csrf = CSRFProtect(app)
csrf.init_app(app)


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
admin.add_view(admin_views.PostView(models.Post, db.session, category="Post"))
admin.add_view(admin_views.ImagesView(models.ImagePost, db.session, category="Post"))
admin.add_view(admin_views.TagsView(models.Tags, db.session, category="Post"))
# admin.add_view(admin_views.CommentsView(models.CommentModel, db.session, category="Post"))
admin.add_view(admin_views.AdminLoginView(endpoint="login"))
