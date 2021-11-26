from enum import unique
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Comment(db.Model):
    __tablename__ = 'comment'
    __table_args__ = {'sqlite_autoincrement':True}
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    author = db.Column(db.Unicode(128))
    text = db.Column(db.Unicode(1024))

    def to_json(self):
        js = {}
        for attr in ('id', 'author', 'text'):
            js[attr] = getattr(self, attr)
        return js
