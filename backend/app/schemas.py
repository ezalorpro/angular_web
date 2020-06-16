from app.models import User, Post, Comment, ImagePost, Tags
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow.fields import Nested
from app import ma


class UserSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = User
        include_relationships = True
        load_instance = True
       
        
class CommentSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Comment
        include_relationships = True
        load_instance = True


class TagsSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Tags
        include_relationships = True
        load_instance = True
        
        
class PostSchema(SQLAlchemyAutoSchema):
    
    user = Nested(UserSchema, 
        exclude=[
            'password', 
            'avatar', 
            'roles', 
            'information', 
            'location',
            'comment',
            'imagepost',
            'post',
            'gender'
            ]
        )
    
    comments = Nested(CommentSchema, many=True)
    tags = Nested(TagsSchema, many=True)
    
    class Meta:
        model = Post
        include_relationships = True
        load_instance = True
        