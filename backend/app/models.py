from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from werkzeug.security import check_password_hash
from flask_login import UserMixin
from argon2 import PasswordHasher
from sqlalchemy.dialects.postgresql import JSON
from app import db

import datetime

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
    gender = Column(JSON)
    information = Column(Text, index=True)
    roles = Column(JSON)
    
    def __repr__(self):
        return f'<User:{self.username}>'
    
    def check_password(self, password):
        return ph.verify(self.password, password)
    
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