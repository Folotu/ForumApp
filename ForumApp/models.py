from . import db
from flask_login import UserMixin
from sqlalchemy.sql import func
from flask_admin import Admin 
from flask_admin.contrib.sqla import ModelView
from flask_security import Security, SQLAlchemyUserDatastore, RoleMixin, login_required, current_user
from sqlalchemy import UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.orm import backref


roles_users = db.Table(
    'roles_users',
    db.Column('users_id', db.Integer(), db.ForeignKey('users.id')),
    db.Column('role_id', db.Integer(), db.ForeignKey('role.id'))
)

class Users(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String(150))
    active = db.Column(db.Boolean())
    roles = db.relationship('Role', secondary=roles_users, backref=db.backref('users', lazy='dynamic'))
        
    def has_roles(self, *args):
        return set(args).issubset({role.name for role in self.roles})
                            
    def __repr__(self):
            return '<User %r>' % self.username


class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))

    def __str__(self):
        return self.name


class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    author = db.relationship(Users, backref=backref("Post", cascade="all, delete"))
    number_of_votes = db.Column(db.Integer())
    title = db.Column(db.String(120))
    description = db.Column(db.String(10000))
    created_at = db.Column(db.DateTime(timezone=True), default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), default=func.now())


    def __str__(self):
        return self.title + "\n" + self.description


class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    author = db.relationship(Users, backref=backref("Comment", cascade="all, delete"))
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'))
    post = db.relationship(Post, backref=backref("Comment", cascade="all, delete"))
    number_of_votes = db.Column(db.Integer())
    comment = db.Column(db.String(10000))

    created_at = db.Column(db.DateTime(timezone=True), default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), default=func.now())

    def __str__(self):
        return str(self.author) + "\n" + self.comment

class Reply(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    author = db.relationship(Users, backref=backref("Reply", cascade="all, delete"))
    comment_id = db.Column(db.Integer, db.ForeignKey('comment.id'))
    comment = db.relationship(Comment, backref=backref("Reply", cascade="all, delete"))
    number_of_votes = db.Column(db.Integer())
    reply = db.Column(db.String(10000))
    replyparent_id = db.Column(db.Integer, db.ForeignKey('reply.id'))
    replies = db.relationship('Reply', backref=db.backref('replyparent', remote_side=[id]),lazy='dynamic')
    created_at = db.Column(db.DateTime(timezone=True), default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), default=func.now())

    def __str__(self):
        return str(self.author) + "\n" + self.reply

