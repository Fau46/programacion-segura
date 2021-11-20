
from flask import current_app
from orm import Elector, User, db
import hashlib
import random


def add_elector(firstname, lastname, dateofbirth, dni):
    new_elector = Elector()
    try:
        new_elector.firstname = firstname
        new_elector.lastname = lastname
        new_elector.dateofbirth = dateofbirth
        new_elector.dni = dni
        db.session.add(new_elector)
        db.session.commit()
        return new_elector.to_json()
    except Exception as e:
        print(e)  # pragma: no cover
        db.session.rollback()
        return None

def add_user(username, password, elector_id, is_admin=False):
    new_user = User()
    try:
        #new_user.nonce = random.randint(0, 1000000)
        new_user.username = username
        new_user.password = password #hashlib.md5((password+str(new_user.nonce)).encode()).hexdigest() #insicure hashing
        new_user.elector_id = elector_id
        new_user.is_admin = is_admin
        db.session.add(new_user)
        db.session.commit()
        return new_user.to_json()    
    except Exception as e:
        print(e)  # pragma: no cover
        db.session.rollback()
        return None