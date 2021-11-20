from enum import unique
from flask_sqlalchemy import SQLAlchemy
from dataclasses import dataclass

db = SQLAlchemy()

@dataclass
class Elector(db.Model):
    __tablename__ = 'elector'
    __table_args__ = {'sqlite_autoincrement':True}
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    firstname = db.Column(db.Unicode(128))
    lastname = db.Column(db.Unicode(128))
    dateofbirth = db.Column(db.Unicode(128))
    dni = db.Column(db.Unicode(128), unique=True)
    can_vote = db.Column(db.Boolean, default=True)

    def to_json(self):
        js = {}
        for attr in ('id', 'firstname', 'lastname',
                     'dateofbirth', 'dni', 'can_vote'):
            js[attr] = getattr(self, attr)
        return js
@dataclass
class User(db.Model):
    __tablename__ = 'user'
    __table_args__ = {'sqlite_autoincrement':True}
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.Unicode(128), unique=True)
    password = db.Column(db.Unicode(128))
    #nonce = db.Column(db.Integer)
    elector_id = db.Column(db.Integer, db.ForeignKey('elector.id'))
    is_admin = db.Column(db.Boolean, default=False)

    def to_json(self):
        js = {}
        for attr in ('id', 'username', 'password',
                     'elector_id', 'is_admin'):
            js[attr] = getattr(self, attr)
        return js