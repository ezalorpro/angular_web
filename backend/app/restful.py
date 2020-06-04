from flask_praetorian.utilities import current_user_id
from app.schemas import UserSchema, PostSchema
from flask import request, jsonify, abort, url_for
from flask_restful import Resource
from app.models import User, Post, Tags, Comment, ImagePost
from app import db, guard, api, photos

import flask_praetorian as fprae


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
    def get(self):
        posts = Post.query.all()
        post_schema = PostSchema(many=True)
        return post_schema.dump(posts)
        
class LoginApi(Resource):
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
        first_name = data.get('first_name', None)
        last_name = data.get('last_name', None)
        roles = data.get('roles', [])
        
        if User.query.filter_by(username=username).first():
            return abort(409, 'Usuario ya registrado')
        
        if User.query.filter_by(email=email).first():
            return abort(409, 'Correo ya registrado')
        
        user = User(
            username=username,
            email=email,
            password=guard.hash_password(password),
            first_name=first_name,
            last_name=last_name,
            roles=roles,
            )
        db.session.add(user)
        db.session.commit()
        return jsonify({'message': 'Registro exitoso', 'redirect': 'register_succes'})
    
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

class PostImageHandlerApi(Resource):
    
    method_decorators = [fprae.auth_required]
    
    def post(self):
        image = request.files["file"]
        image_name = request.files["file"].filename
        user = User.query.get(current_user_id())
        image_db = ImagePost(user=user)
        db.session.add(image_db)
        db.session.flush()
        image_db.path = str(image_db.id) + "-" + image_name
        image_name = image_db.path
        db.session.commit()
        photos.save(image, name=image_name)
        return jsonify({"location": url_for("static", filename="images/" + image_name)})

api.add_resource(Data, '/api/data/') 
api.add_resource(PostData, '/api/posts/')
api.add_resource(LoginApi, '/api/login/')
api.add_resource(Register, '/api/register/')
api.add_resource(PostImageHandlerApi, '/api/post_image_handler/')