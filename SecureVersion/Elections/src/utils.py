from flask import current_app
from orm import Candidate, Vote, db
import requests as req

from werkzeug.security import generate_password_hash

def get_from(url, params=None, headers=None):
    if headers is None:
        headers = {}
    try:
        if params is not None:
            r = req.get(url, timeout=2, params=params, headers=headers)
        else:
            r = req.get(url, timeout=2, headers=headers)
        try:
            json = r.json()
            status = r.status_code
            return json, status
        except:  # pragma: no cover
            return {
                       "type": "about:blank",
                       "title": "Unexpected Error",
                       "status": r.status_code,
                       "detail": "Unexpected error occurs",
                   }, r.status_code
    except Exception as e:
        print(e)
        return {
                   "type": "about:blank",
                   "title": "Internal Server Error",
                   "status": 500,
                   "detail": "Error during communication with other services",
               }, 500

def add_candidate(dni, party):
    new_candidate = Candidate()
    try:
        new_candidate.dni = dni
        new_candidate.party = party
        db.session.add(new_candidate)
        db.session.commit()
        return new_candidate.to_json()
    except Exception as e:
        print(e)  # pragma: no cover
        db.session.rollback()
        return None

def add_vote(elector_id, candidate_id):
    new_vote = Vote()
    try:
        new_vote.elector_id = generate_password_hash(elector_id)
        new_vote.candidate_id = candidate_id
        db.session.add(new_vote)
        db.session.commit()
        return new_vote.to_json()
    except Exception as e:
        print(e)  # pragma: no cover
        db.session.rollback()
        return None