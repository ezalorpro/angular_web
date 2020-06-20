import datetime

from flask_praetorian.utilities import current_user_id
from app.schemas import UserSchema, PostSchema, TagsSchema, CommentSchema
from werkzeug.datastructures import FileStorage
from werkzeug.utils import secure_filename
from base64 import b64decode
from io import BytesIO
from flask import request, jsonify, abort, url_for
from flask_restful import Resource
from app.models import User, Post, Tags, Comment, ImagePost
from app import db, guard, api, photos
from app.utils import prefix_name, add_tags, manage_images

import flask_praetorian as fprae


class UserData(Resource):
    
    method_decorators = [fprae.auth_required]
    
    def get(self):
        user = User.query.filter_by(id=current_user_id()).first()
        user_schema = UserSchema(exclude=['password', 'avatar', 'roles'])
        return user_schema.dump(user)

    def post(self):
        user = User.query.filter_by(id=current_user_id()).first()
        new_data = request.get_json(force=True)
        if User.query.filter_by(email=new_data.get('email', None)).first() and user.email != new_data.get('email', None):
            return abort(409, 'Correo ya registrado')
        
        for key, value in new_data.items():
            if 'avatar' not in key:
                setattr(user, key, value)
                
        avatar_image = new_data.get('avatar_file_data', None)
        
        if avatar_image:
            avatar_image = avatar_image.replace('data:image/png;base64,', '')
            image_storage = FileStorage(BytesIO(b64decode(avatar_image)), 
                                        filename=new_data.get('avatar'))
            file_name = prefix_name(user, image_storage)
            photos.save(image_storage, name=file_name)
            user.avatar = file_name
            user.avatar_url = url_for('static', filename='images/'+file_name)
                        
        db.session.commit()
        return jsonify({'message': 'Perfil editado exitosamente!', 'redirect': 'profile'})
    
    
class PostData(Resource):
    
    method_decorators = {
        'post': [fprae.auth_required], 
        'put': [fprae.auth_required], 
        'delete': [fprae.auth_required]
        }
      
    def get(self, param=None):
        
        if not param:
            posts = Post.query.order_by('post_date').all()[::-1]
            post_schema = PostSchema(many=True)
            posts_dump = post_schema.dump(posts)
                        
            return posts_dump 
        
        elif param.isdigit():
            post = Post.query.get(param)
            if post:
                post_schema = PostSchema()
                post_dump = post_schema.dump(post)
                return post_dump
            else:
                return abort(404)
       
        else:
            user = User.query.filter_by(username=param).first()
            if user:
                post = Post.query.filter_by(usuario_id=user.id).order_by('post_date').all()[::-1]
                post_schema = PostSchema(many=True, only=['title', 'post_date', 'id'])
                post_dump = post_schema.dump(post)
                return post_dump
            else:
                return abort(404)
    
    def post(self, tipo=None):
        data = request.get_json(force=True)
        post = Post()
        user = User.query.get(current_user_id())
        
        if Post.query.filter_by(title=data['title']).first():
            return abort(409, 'Ya existe un post con ese titulo.')
            
        post.user = user
        post.title = data['title']
        post.post_text = data['post_text']
        post.post_date = datetime.datetime.now()
        post.post_modified = datetime.datetime.now()
        
        tag_acum = []
        for tag in data['tags']:
            if tag:
                tag_acum.append(add_tags(tag))
                
        post.tags = tag_acum
        db.session.flush()
        manage_images(post)
        db.session.commit()
        
        return jsonify({
            'message': 'Post creado exitosamente', 
            'redirect': f'posts/view/{post.id}'
            })

    def put(self, tipo=None):
        data = request.get_json(force=True)
        post = Post.query.get(data['id'])
        title_check = Post.query.filter_by(title=data['title']).first()
        
        if title_check:
            if title_check.id != post.id:
                return abort(409, 'Ya existe un post con ese titulo.')
        
        if post.user.id != current_user_id():
            return abort(401, 'Solo el autor del post o un admin pueden editar el post.')

        post.title = data['title']
        post.post_text = data['post_text']
        post.post_modified = datetime.datetime.now()
        
        tag_acum = []
        for tag in data['tags']:
            if tag:
                tag_acum.append(add_tags(tag))
                
        post.tags = tag_acum
        db.session.flush()
        manage_images(post)
        db.session.commit()
        
        return jsonify({
            'message': 'Post editado exitosamente', 
            'redirect': f'posts/view/{post.id}'
            })
    
    def delete(self, param):
        post = Post.query.get(param)
        db.session.delete(post)
        db.session.commit()
        
        return jsonify({
            'message': 'Post borrado exitosamente', 
            'redirect': f'profile/view'
            })


class TagsData(Resource):    
    def get(self):
        tags = Tags.query.all()
        tags_schema = TagsSchema(many=True, exclude=['posts'])
        tags_dump = tags_schema.dump(tags)  
        return tags_dump 


class CommentsData(Resource):
    
    method_decorators = {
        'post': [fprae.auth_required], 
        'put': [fprae.auth_required], 
        'delete': [fprae.auth_required]
        }
    
    def get(self, param=None):
        comments = Comment.query.filter_by(post_id=param).order_by('date').all()
        comments_schema = CommentSchema(many=True)
        comments_dump = comments_schema.dump(comments)
        return comments_dump
    
    def post(self, param=None):
        data = request.get_json(force=True)
        comment = Comment()
        user = User.query.get(2)
        comment.user = user
        comment.content = data.get('content', None)
        comment.date = datetime.datetime.now()
        post = Post.query.get(param)
        post.comments.append(comment)
        db.session.commit()
        
        return jsonify({
            'message': 'Comentario creado exitosamente', 
            'redirect': f'posts/view/{post.id}'
            })
    
    def put(self, param):
        data = request.get_json(force=True)
        comment = Comment.query.get(param)
        if comment:
            comment.content = data.get('content', None)
            db.session.commit()
            
            return jsonify({
                'message': 'Comentario editado exitosamente', 
                'redirect': f'posts/view/{comment.post_id}'
                })
        else:
            return abort(404)
    
    def delete(self, param):
        comment = Comment.query.get(param)
        if comment:
            db.session.delete(comment)
            db.session.commit()
            
            return jsonify({
                'message': 'Comentario borrado exitosamente'
                })
        else:
            return abort(404)
        

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
        return jsonify({'message': 'Registro exitoso', 'redirect': 'register/succes'})
    

class PostImageHandlerApi(Resource):
    
    method_decorators = [fprae.auth_required]
    
    def post(self):
        image = request.files["file"]
        image_name = request.files["file"].filename
        user = User.query.get(current_user_id())
        image_db = ImagePost(user=user)
        db.session.add(image_db)
        db.session.flush()
        image_db.image_name = secure_filename(str(image_db.id) + "-" + image_name)
        image_name = image_db.image_name
        db.session.commit()
        photos.save(image, name=image_name)
        return jsonify({"location": url_for("static", filename="images/" + image_name)})


api.add_resource(UserData, '/api/userdata/')
api.add_resource(CommentsData, '/api/posts/comments/', '/api/posts/comments/<param>/')
api.add_resource(PostData, '/api/posts/', '/api/posts/<param>/')
api.add_resource(TagsData, '/api/tags/')
api.add_resource(LoginApi, '/api/login/')
api.add_resource(Register, '/api/register/')
api.add_resource(PostImageHandlerApi, '/api/post_image_handler/')