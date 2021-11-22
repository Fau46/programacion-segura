import configparser
import logging
from re import A
import connexion
import sys
from datetime import datetime, timedelta
import hashlib
from flask_cors import CORS
from base64 import b64encode

from flask import current_app, request, jsonify
from src.errors import Error500, Error400, Error404, Error401

from werkzeug.security import generate_password_hash, check_password_hash

from src.orm import Elector, User, db
from src.utils import add_elector, add_user
import os
import json
import jwt
"""
The default app configuration: 
in case a configuration is not found or 
some data is missing
"""
DEFAULT_CONFIGURATION = { 
    "REMOVE_DB": False, # remove the db file
    "DB_DROPALL": False, # remove the data in the db
    "SQLALCHEMY_DATABASE_URI": "orm.db", # the db file
    "SQLALCHEMY_TRACK_MODIFICATIONS": False, # disable the modification tracking
}

def initialise():
    admin = add_elector("Admin","Admin","1990-01-01","0")
    add_user("Admin","Admin",admin["id"],True)

    e1 = add_elector("elector1","elector1","1990-01-01","1")
    add_user("elector1","elector1",e1["id"],False)

    add_elector("elector2","elector2","1990-01-01","2")
    add_elector("elector3","elector3","1990-01-01","3")
    

def encode_auth_token(user_id):
    """
    Generates the Auth Token
    :return: string
    """
    with current_app.app_context():
        try:
            payload = {
                'exp': datetime.utcnow() + timedelta(days=0, hours=1),
                'iat': datetime.utcnow(),
                'sub': user_id
            }
            return jwt.encode(
                payload,
                current_app.config.get('SECRET_KEY'),  # secret key
                algorithm='HS256'
            )
        except Exception as e:
            print(e)
            return None

def decode_auth_token(auth_token):
    """
    Decodes the auth token
    :param auth_token:
    :return: integer|string
    """
    with current_app.app_context():
        try:
            payload = jwt.decode(auth_token, current_app.config.get('SECRET_KEY'))
            return payload['sub']
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None

def validate_auth_token(auth_token):
    if auth_token is None:
        return None
    try:    
        auth_token = decode_auth_token(auth_token)
        if not isinstance(auth_token, str):
            user = User.query.filter_by(id=auth_token).first()
            return user.to_json()
        return None
    except:
        return None

def check_credentials(username, password):
    try:
        u = User.query.filter_by(username=username).first()
        if u:
            if check_password_hash(u.password,password):
                elector = Elector.query.filter_by(id=u.elector_id).first()
                print(elector)
                if elector:
                    print(u.id)
                    auth_token = encode_auth_token(u.id)
                    print(auth_token)
                    if auth_token:
                        user = u.to_json()
                        user["auth_token"] = auth_token.decode()
                        user["dni"] = elector.dni
                        return user, 200
        return Error400("Wrong Credentials").get()
    except Exception as e:
        return Error500().get()

def check_auth_token():
    auth_header = request.headers.get('Auth-Token')
    if auth_header:
        print(auth_header)
        auth_token = auth_header
        user = validate_auth_token(auth_token)
        if user is None:
            return Error401("Invalid Token").get()
        else:
            return user, 200
    else:
        return Error401("Missing Auth-Token").get()

        
def can_vote(dni, allowed):

    admin = validate_auth_token(request.headers.get('Auth-Token'))
    if admin is None or admin["is_admin"] == False:
        return Error401("Invalid Token").get()
    
    elector = Elector.query.filter_by(dni=dni).first()

    if elector is None:
        logging.info("- Service: Elector not found")
        return Error404("Elector not found").get()
    
    try:
        elector.can_vote = allowed
        db.session.commit()
        return get_elector(dni)
    except Exception as e:
        print(e)
        db.session.rollback()
        return Error500().get()

def get_elector(dni):
    """
    Returns the user with the given dni

    Params:
        - dni: the user's dni
    """
    #find elector with dni
    result = Elector.query.filter_by(dni=dni).all()
    result = [row.to_json() for row in result]
    print(result)
    if len(result) == 0:
        return Error404("Elector not Found").get()
    else:
        return result, 200

def new_elector():
    """
    Creates a new elector in the database

    Params:
        - dni: the elector's dni
        - firstname: the elector's firstname
        - lastname: the elector's lastname
        - dateofbirth: the elector's birthdate
    """

    admin = validate_auth_token(request.headers.get('Auth-Token'))
    if admin is None or admin["is_admin"] == False:
        return Error401("Invalid Token").get()

    elector = request.json
    elector = add_elector(elector["firstname"], elector["lastname"], elector["dateofbirth"], elector["dni"])
    if elector is None:
        return Error500().get()
    else:
        return dict(elector.items()), 201

def new_user():
    user = request.json

    elector = Elector.query.filter_by(dni=user["dni"]).first()

    if elector is None:
        logging.info("- Service: Elector not found")
        return Error404("Elector not found").get()

    u = User.query.filter_by(username=user["username"]).first()
    if u:
        return Error500().get()
    else:
        user = add_user(user["username"], user["password"], elector.id)
        return get_user(elector.dni)
        #return (dict(user.items()),result), 200 #may return all user if sqlinjection

def get_user(dni):
    """
    Returns the user with the given dni

    Params:
        - dni: the user's dni
    """
    #find elector with dni
    elector = Elector.query.filter_by(dni=dni).first()
    if elector is not None:
        user = User.query.filter_by(elector_id=elector.id).first()
        return user.to_json(), 200

    return Error404("User not Found").get()
        
def get_config(configuration=None):
    """ Returns a json file containing the configuration to use in the app

    The configuration to be used can be passed as a parameter, 
    otherwise the one indicated by default in config.ini is chosen

    ------------------------------------
    [CONFIG]
    CONFIG = The_default_configuration
    ------------------------------------

    Params:
        - configuration: if it is a string it indicates the configuration to choose in config.ini
    """
    try:
        parser = configparser.ConfigParser()
        if parser.read('config.ini') != []:

            if type(configuration) != str or configuration == "": # if it's not a string, take the default one
                configuration = parser["CONFIG"]["CONFIG"]

            logging.info("- Service CONFIGURATION: %s",configuration)
            configuration = parser._sections[configuration] # get the configuration data

            parsed_configuration = {}
            for k,v in configuration.items(): # Capitalize keys and translate strings (when possible) to their relative number or boolean
                k = k.upper()
                parsed_configuration[k] = v
                try:
                    parsed_configuration[k] = int(v)
                except:
                    try:
                        parsed_configuration[k] = float(v)
                    except:
                        if v == "true":
                            parsed_configuration[k] = True
                        elif v == "false":
                            parsed_configuration[k] = False

            for k,v in DEFAULT_CONFIGURATION.items():
                if not k in parsed_configuration: # if some data are missing enter the default ones
                    parsed_configuration[k] = v

            return parsed_configuration
        else:
            return DEFAULT_CONFIGURATION
    except Exception as e:
        logging.info("- Service CONFIGURATION ERROR: %s",e)
        logging.info("- Service RUNNING: Default Configuration")
        return DEFAULT_CONFIGURATION 

def setup(application, config):

    for k,v in config.items():
        application.config[k] = v # insert the requested configuration in the app configuration

    if config["REMOVE_DB"]:  # remove the db file
        try:
            os.remove("src/" + config["SQLALCHEMY_DATABASE_URI"])
            logging.info("- Service: Database Removed") # pragma: no cover
        except:
            logging.info("- Service: Clean Database")

    config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + config["SQLALCHEMY_DATABASE_URI"]

    for k, v in config.items():
        application.config[k] = v  # insert the requested configuration in the app configuration

    db.init_app(application)

    if config["DB_DROPALL"]:  # remove the data in the db
        logging.info("- Service: Dropping All from Database...")
        db.drop_all(app=application)

    db.create_all(app=application)

    current_app.config["SECRET_KEY"] = b64encode(os.urandom(24)).decode('utf-8')


def create_app(configuration=None):
    logging.basicConfig(level=logging.INFO)

    app = connexion.App(__name__)
    app.add_api('./swagger.yaml')
    # set the WSGI application callable to allow using uWSGI:
    # uwsgi --http :8080 -w app
    application = app.app
    CORS(application)

    conf = get_config(configuration)
    logging.info(conf)
    logging.info("- Service ONLINE @ ("+conf["IP"]+":"+str(conf["PORT"])+")")
    with app.app.app_context():
        setup(application, conf)

        initialise()

    return app

if __name__ == '__main__':

    c = None
    if len(sys.argv) > 1: # if it is inserted
        c = sys.argv[1] # get the configuration name from the arguments

    app = create_app(c)

    with app.app.app_context():
        app.run(
            host=current_app.config["IP"], 
            port=current_app.config["PORT"], 
            debug=current_app.config["DEBUG"],
            #ssl_context='adhoc'
            )

"""
B101    assert_used
B102    exec_used
B103    set_bad_file_permissions
B104    hardcoded_bind_all_interfaces
B105    hardcoded_password_string
B106    hardcoded_password_funcarg
B107    hardcoded_password_default
B110    try_except_pass
B112    try_except_continue

B201    flask_debug_true

B307    eval

B501    request_with_no_cert_validation

B608    hardcoded_sql_expressions

PASSWORD IN CHIARO NOT DETECTED

************************************************************************************************************************
************************************************************************************************************************
************************************************************************************************************************

B301    pickle
B302    marshal
B304    ciphers
B305    cipher_modes
B306    mktemp_q
B308    mark_safe
B309    httpsconnection
B310    urllib_urlopen
B312    telnetlib
B313    xml_bad_cElementTree
B314    xml_bad_ElementTree
B315    xml_bad_expatreader
B316    xml_bad_expatbuilder
B317    xml_bad_sax
B318    xml_bad_minidom
B319    xml_bad_pulldom
B320    xml_bad_etree
B321    ftplib
B323    unverified_context
B324    hashlib_new_insecure_functions
B325    tempnam

B401    import_telnetlib
B402    import_ftplib
B403    import_pickle
B404    import_subprocess
B405    import_xml_etree
B406    import_xml_sax
B407    import_xml_expat
B408    import_xml_minidom
B409    import_xml_pulldom
B410    import_lxml
B411    import_xmlrpclib
B412    import_httpoxy
B413    import_pycrypto

B502    ssl_with_bad_version
B503    ssl_with_bad_defaults
B504    ssl_with_no_version
B505    weak_cryptographic_key


************************************************************************************************************************
************************************************************************************************************************
************************************************************************************************************************
B108    hardcoded_tmp_directory

B506    yaml_load
B507    ssh_no_host_key_verification

B601    paramiko_calls
B602    subprocess_popen_with_shell_equals_true
B603    subprocess_without_shell_equals_true
B604    any_other_function_with_shell_equals_true
B605    start_process_with_a_shell
B606    start_process_with_no_shell
B607    start_process_with_partial_path
B609    linux_commands_wildcard_injection
B610    django_extra_used
B611    django_rawsql_used

B701    jinja2_autoescape_false
B702    use_of_mako_templates
B703    django_mark_safe
"""

