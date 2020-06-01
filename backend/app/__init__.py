from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Resource, Api
from flask_marshmallow import Marshmallow
from flask_cors import CORS

import flask_praetorian as fprae


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql:///php_web"
app.config['SECRET_KEY'] = "157c03c94cc1aa67b95cad155a095b23"
app.config['JWT_ACCESS_LIFESPAN'] = {'seconds': 86400}
app.config['JWT_REFRESH_LIFESPAN'] = {'days': 30}
app.config['PRAETORIAN_HASH_SCHEME'] = 'argon2'

cors = CORS(app)
api = Api(app)
guard = fprae.Praetorian()
db = SQLAlchemy(app)
ma = Marshmallow(app)

from app.models import User, Post
from app.schemas import UserSchema, PostSchema

guard.init_app(app, User)


class Index(Resource):
    def get(self):
        return {'hola': 'hola mundo'}


class Data(Resource):
    
    method_decorators = [fprae.auth_required]
    
    def get(self):
        users = User.query.order_by(User.id).all()
        user_schema = UserSchema(many=True)
        return user_schema.dump(users)
    
    def post(self):
        username = request.get_json()['username']
        user = User.query.filter_by(username=username).first()
        user_schema = UserSchema()
        return user_schema.dump(user)


class PostData(Resource):
    
    method_decorators = [fprae.auth_required]
    
    def get(self, username):
        user = User.query.filter_by(username=username).first()
        posts = Post.query.filter_by(usuario_id=user.id).all()
        post_schema = PostSchema(many=True)
        return post_schema.dump(posts)
        
class Login(Resource):
    def post(self):
        credentials = request.get_json(force=True)
        user = guard.authenticate(**credentials)
        token = guard.encode_jwt_token(user)
        return jsonify({'idToken': token, 'expiresAt': 86400})


class Register(Resource):
    def post(self):
        data = request.get_json(force=True)
        username = data.get('username', None)
        email = data.get('email', None)
        password = data.get('password', None)
        roles = data.get('roles', [])
        
        user = User(
            username=username,
            email=email,
            password=guard.hash_password(password),
            roles=roles,
            )
        db.session.add(user)
        db.session.commit()
        return jsonify({'message': 'Registro exitoso', 'redirect': 'login'})
    
# @app.route("/PostData/<username>", methods=['GET', 'POST'])
# def post_data(username=None):
#     if request.method == 'GET' and username:
#         usuario = User.query.filter_by(username=username).first()
#         posts = Post.query.filter_by(usuario_id=usuario.id).all()
#         data = {'data': []}
#         for post in posts:
#             post_dict = post.to_dict()
#             post_dict['user_id'] = usuario.username
#             data['data'].append(post_dict)
#         return jsonify(data)
#     # else:
#         # Query_result = User.query.order_by(User.id).all()
#         # data = {'data': []}
#         # for user in Query_result:
#         #     user_dict = user.to_dict()
#         #     if isinstance(user_dict['roles'],dict):
#         #         user_dict['roles'] = [role for _,role in user_dict['roles'].items()]
#         #     user_dict['roles'].sort()
#         #     data['data'].append(user_dict)
#         # return jsonify(data)

api.add_resource(Index, '/') 
api.add_resource(Data, '/data/') 
api.add_resource(PostData, '/posts/<string:username>/')
api.add_resource(Login, '/login/')
api.add_resource(Register, '/register/')

