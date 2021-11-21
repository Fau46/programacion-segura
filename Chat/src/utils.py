from flask import current_app
from orm import Comment, db
import requests as req

def add_comment(author, text):
    new_comment = Comment()
    try:
        new_comment.author = author
        new_comment.text = text
        db.session.add(new_comment)
        db.session.commit()
        return new_comment.to_json()
    except Exception as e:
        print(e)  # pragma: no cover
        db.session.rollback()
        return None