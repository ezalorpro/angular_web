from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Table
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, backref
from werkzeug.security import check_password_hash
from flask_login import UserMixin
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy.event import listens_for
from app import db, login_manager, file_path, op

import datetime
import os


ph = PasswordHasher()

class User(db.Model, UserMixin):
    id = Column(Integer, primary_key=True, nullable=False)
    username = Column(String, index=True, unique=True, nullable=False)
    first_name = Column(String, index=True)
    last_name = Column(String, index=True)
    email = Column(String, index=True, unique=True, nullable=False)
    password = Column(String, nullable=False)
    avatar = Column(String, index=True)
    avatar_url = Column(String, index=True)
    location = Column(String, index=True)
    gender = Column(String, nullable=True)
    information = Column(Text, index=True)
    roles = Column(JSON)
    
    def __repr__(self):
        return f'<User:{self.username}>'
    
    def check_password(self, password):
        try:
            ph.verify(self.password, password)
            return True
        except VerifyMismatchError:
            return False
    
    @property
    def rolenames(self):
        try:
            if isinstance(self.roles, dict):
                return [value for key, value in self.roles.items()]
            else:
                return self.roles
        except Exception:
            return []

    @classmethod
    def lookup(cls, username):
        return cls.query.filter_by(username=username).one_or_none()

    @classmethod
    def identify(cls, id):
        return cls.query.get(id)

    @property
    def identity(self):
        return self.id


blog_tag = Table(
    "tags_post",
    db.metadata,
    Column("tags_id", Integer, ForeignKey("tags.id")),
    Column("post_id", Integer, ForeignKey("post.id")),
)


class Post(db.Model):
    id = Column(Integer, primary_key=True, nullable=False)
    title = Column(String, index=True, nullable=False, unique=True)
    post_text = Column(Text, index=True)
    post_date = Column(
        DateTime, index=True, nullable=False, default=datetime.datetime.now
    )
    post_modified = Column(
        DateTime,
        index=True,
        nullable=False,
        default=datetime.datetime.now,
        onupdate=datetime.datetime.now,
    )
    usuario_id = Column(Integer, ForeignKey("user.id", ondelete="CASCADE"))
    user = relationship(
        "User", backref=backref("post", lazy="dynamic", passive_deletes=True)
    )
    tags = relationship("Tags", secondary=blog_tag, back_populates="posts")
    comments = relationship(
        "Comment",
        backref=backref("post", order_by="desc(Comment.date)"),
    )

    def __repr__(self):
        return f"{self.user.username}: {self.title[:15]}"


class Tags(db.Model):
    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String, unique=True, nullable=False)
    posts = relationship("Post", secondary=blog_tag, back_populates="tags")

    def __repr__(self):
        return f"{self.name}"
    

class Comment(db.Model):
    id = Column(Integer, primary_key=True, nullable=False)
    content = Column(Text, index=True)
    date = Column(
        DateTime, index=True, nullable=False, default=datetime.datetime.now
    )
    usuario_id = Column(Integer, ForeignKey("user.id", ondelete="CASCADE"))
    user = relationship(
        "User", backref=backref("comment", lazy="dynamic", passive_deletes=True)
    )
    post_id = Column(Integer, ForeignKey("post.id", ondelete="CASCADE"))

    def __repr__(self):
        return f"{self.user.username} - {self.post_id}: {self.content[:12]}"
    
class ImagePost(db.Model):
    id = Column(Integer, primary_key=True, nullable=False)
    image_name = Column(String, index=True, unique=True)
    post_id = db.Column(Integer, ForeignKey("post.id", ondelete="CASCADE"))
    post = db.relationship(
        "Post",
        backref=backref("imagepost", lazy="dynamic", passive_deletes=True),
    )
    usuario_id = Column(Integer, ForeignKey("user.id", ondelete="CASCADE"))
    user = relationship(
        "User",
        backref=backref("imagepost", lazy="dynamic", passive_deletes=True),
    )
    
@login_manager.user_loader
def load_user(id):
    return User.query.get(int(id))


@listens_for(Post, "before_delete")
def del_post_model(mapper, connection, target):
    images = ImagePost.query.filter_by(post=target).all()
    if images:
        for image in images:
            try:
                os.remove(op.join(file_path, image.image_name))
            except OSError:
                pass


@listens_for(ImagePost, "before_delete")
def del_image_post_model(mapper, connection, target):
    if target.image_name:
        try:
            os.remove(op.join(file_path, target.image_name))
        except OSError:
            pass