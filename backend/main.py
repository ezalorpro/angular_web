from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import JSON
from flask_cors import CORS
from sqlalchemy_serializer import SerializerMixin
import datetime


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql:///php_web"
CORS(app)
db = SQLAlchemy(app)

class User(db.Model, SerializerMixin):
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    username = db.Column(db.String, index=True, unique=True, nullable=False)
    first_name = db.Column(db.String, index=True)
    last_name = db.Column(db.String, index=True)
    email = db.Column(db.String, index=True, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)
    avatar = db.Column(db.String, index=True)
    avatar_url = db.Column(db.String, index=True)
    location = db.Column(db.String, index=True)
    gender = db.Column(JSON)
    information = db.Column(db.Text, index=True)
    roles = db.Column(JSON)

class Post(db.Model, SerializerMixin):
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    title = db.Column(db.String, index=True, nullable=False, unique=True)
    post_text = db.Column(db.Text, index=True)
    post_date = db.Column(
        db.DateTime, index=True, nullable=False, default=datetime.datetime.now
    )
    post_modified = db.Column(
        db.DateTime,
        index=True,
        nullable=False,
        default=datetime.datetime.now,
        onupdate=datetime.datetime.now,
    )
    usuario_id = db.Column(db.Integer, db.ForeignKey("user.id", ondelete="CASCADE"))

 
@app.route("/", methods=['GET'])
def index():
    return "Pagina de inicio"


@app.route("/data/", methods=['GET', 'POST'])
def data():
    if request.method == 'POST':
        username = request.get_data(as_text=True)
        Query_result = User.query.filter_by(username=username).first()
        user_dict = Query_result.to_dict()
        if isinstance(user_dict['roles'],dict):
            user_dict['roles'] = [role for _,role in user_dict['roles'].items()]
        user_dict['roles'].sort()
        data = {'data': [user_dict]}
        return jsonify(data)
    else:
        Query_result = User.query.order_by(User.id).all()
        data = {'data': []}
        for user in Query_result:
            user_dict = user.to_dict()
            if isinstance(user_dict['roles'],dict):
                user_dict['roles'] = [role for _,role in user_dict['roles'].items()]
            user_dict['roles'].sort()
            data['data'].append(user_dict)
        return jsonify(data)

@app.route("/PostData/<username>", methods=['GET', 'POST'])
def post_data(username=None):
    if request.method == 'GET' and username:
        usuario = User.query.filter_by(username=username).first()
        posts = Post.query.filter_by(usuario_id=usuario.id).all()
        data = {'data': []}
        for post in posts:
            post_dict = post.to_dict()
            post_dict['user_id'] = usuario.username
            data['data'].append(post_dict)
        return jsonify(data)
    # else:
        # Query_result = User.query.order_by(User.id).all()
        # data = {'data': []}
        # for user in Query_result:
        #     user_dict = user.to_dict()
        #     if isinstance(user_dict['roles'],dict):
        #         user_dict['roles'] = [role for _,role in user_dict['roles'].items()]
        #     user_dict['roles'].sort()
        #     data['data'].append(user_dict)
        # return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
