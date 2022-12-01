from . import db
from flask_login import UserMixin
from sqlalchemy.sql import func
from flask_admin import Admin 
from flask_admin.contrib.sqla import ModelView
from flask_security import Security, SQLAlchemyUserDatastore, \
    RoleMixin, login_required, current_user
from sqlalchemy import UniqueConstraint







class Users(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String(150))
    active = db.Column(db.Boolean())
    notes = db.relationship('Note')
    roles = db.relationship('Role', secondary=roles_users,
                            backref=db.backref('users', lazy='dynamic'))
        
    def has_roles(self, *args):
        return set(args).issubset({role.name for role in self.roles})
                            
    def __repr__(self):
            return '<User %r>' % self.username