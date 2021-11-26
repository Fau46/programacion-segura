from enum import unique
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Candidate(db.Model):
    __tablename__ = 'candidate'
    __table_args__ = {'sqlite_autoincrement':True}
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    dni = db.Column(db.Integer, unique=True)
    party = db.Column(db.Unicode(128))

    def to_json(self):
        js = {}
        for attr in ('id', 'dni', 'party'):
            js[attr] = getattr(self, attr)
        return js
    

class Vote(db.Model):
    __tablename__ = 'user'
    __table_args__ = {'sqlite_autoincrement':True}
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    elector_id = db.Column(db.Integer, unique=True)
    candidate_id = db.Column(db.Integer, db.ForeignKey('candidate.id'))
    #nonce = db.Column(db.Integer) single nonce bad, better 2

    def to_json(self):
        js = {}
        for attr in ('id', 'elector_id', 'candidate_id'):
            js[attr] = getattr(self, attr)
        return js