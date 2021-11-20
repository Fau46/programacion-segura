import configparser
import logging
import connexion
import sys
from datetime import datetime
import hashlib
from flask_cors import CORS

from flask import current_app, request, jsonify
from src.errors import Error500, Error400, Error404

from orm import Elector, User, db
from utils import *
import errors
import os
import json
"""
The default app configuration: 
in case a configuration is not found or 
some data is missing
"""
DEFAULT_CONFIGURATION = { 
    "IP": "0.0.0.0", # the app ip
    "PORT": 5000, # the app port
    "DEBUG":True, # set debug mode
    "REMOVE_DB": False, # remove the db file
    "DB_DROPALL": False, # remove the data in the db
    "SQLALCHEMY_DATABASE_URI": "orm.db", # the db file
    "SQLALCHEMY_TRACK_MODIFICATIONS": False, # disable the modification tracking
}

def initialise():
    admin = add_elector("Admin","Admin","1990-01-01","1abc")
    add_user("Admin","Admin",admin["id"],True)

    e1 = add_elector("elector1","elector1","1990-01-01","1")
    add_user("elector1","elector1",e1["id"],False)

    add_elector("elector2","elector2","1990-01-01","2")
    add_elector("elector3","elector3","1990-01-01","3")
    

def log_admin():
    return check_credentials(username="Admin",password="Admin")

def check_credentials(username="Admin", password="Admin"):
    if username == "Admin" and password == "Admin":
        return get_user("0")
    user = User.query.filter_by(username=username).first()
    if user is not None:
        if user.password == password:
            elector = Elector.query.filter_by(id=user.elector_id).first()
            return  get_user(elector.dni)[0]
        else:
            return Error400("Wrong Password").get()
    else:
        return Error400("User Not Found").get()

def can_vote(dni, allowed):
    query = "UPDATE elector SET can_vote ="+str(eval(str(allowed)))+" WHERE dni=\""+str(dni)+"\""
    
    try:
        db.engine.execute(query)
        return 200
    except Exception as e:
        return Error500().get()

def get_elector(dni):
    """
    Returns the user with the given dni

    Params:
        - dni: the user's dni
    """
    query = "SELECT * FROM elector WHERE dni=\""+str(dni)+"\""
    
    result = db.engine.execute(query)
    result = [dict(row.items()) for row in result]

    try:
        assert(len(result) != 0)
        return result, 200 #may return all user if sqlinjection
    except:
        return errors.Error404("Elector not Found").get()

    """
    if len(result) == 0:
        return errors.Error404("Elector not Found").get()
    else:
        return result, 200 #may return all user if sqlinjection
    """

def new_elector():
    """
    Creates a new elector in the database

    Params:
        - dni: the elector's dni
        - firstname: the elector's firstname
        - lastname: the elector's lastname
        - dateofbirth: the elector's birthdate
    """
    elector = request.json
    elector = add_elector(elector["firstname"], elector["lastname"], elector["dateofbirth"], elector["dni"])
    if elector is None:
        return errors.Error500().get()
    else:
        return dict(elector.items()), 201

def new_user():
    user = request.json
    query = "SELECT * FROM elector WHERE dni=\""+str(user["dni"])+"\""
    
    result = db.engine.execute(query)
    result = [dict(row.items()) for row in result]

    print(result)

    if len(result) == 0:
        logging.info("- Service: Elector not found")
        return errors.Error404("Elector not found").get()

    elector_id = result[0]["id"]

    user = add_user(user["username"], user["password"], elector_id)
    if user is None:
        return errors.Error500().get()
    else:
        return get_user(result[0]["dni"])
        #return (dict(user.items()),result), 200 #may return all user if sqlinjection

def get_user(dni):
    """
    Returns the user with the given dni

    Params:
        - dni: the user's dni
    """
    query = "SELECT user.*, elector.dni FROM elector,user WHERE elector.id = user.elector_id AND elector.dni=\""+str(dni)+"\""
    
    result = db.engine.execute(query)
    result = [dict(row.items()) for row in result]

    if len(result) == 0:
        return errors.Error404("User not Found").get()
    else:
        return result, 200 #may return all user if sqlinjection
        
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
            pass

    config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + config["SQLALCHEMY_DATABASE_URI"]

    for k, v in config.items():
        application.config[k] = v  # insert the requested configuration in the app configuration

    db.init_app(application)

    if config["DB_DROPALL"]:  # remove the data in the db
        logging.info("- Service: Dropping All from Database...")
        db.drop_all(app=application)

    db.create_all(app=application)

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
            host="0.0.0.0",#current_app.config["IP"], 
            port=42424,#current_app.config["PORT"], 
            debug=True#current_app.config["DEBUG"]
            )

"""
B101    assert_used
B104    hardcoded_bind_all_interfaces
B105    hardcoded_password_string
B106    hardcoded_password_funcarg
B107    hardcoded_password_default
B110    try_except_pass
B201    flask_debug_true

PASSWORD IN CHIARO NOT DETECTED

B102    exec_used
B103    set_bad_file_permissions
B108    hardcoded_tmp_directory
B112    try_except_continue
B301    pickle
B302    marshal
B304    ciphers
B305    cipher_modes
B306    mktemp_q
B307    eval
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
B501    request_with_no_cert_validation
B502    ssl_with_bad_version
B503    ssl_with_bad_defaults
B504    ssl_with_no_version
B505    weak_cryptographic_key
B506    yaml_load
B507    ssh_no_host_key_verification
B601    paramiko_calls
B602    subprocess_popen_with_shell_equals_true
B603    subprocess_without_shell_equals_true
B604    any_other_function_with_shell_equals_true
B605    start_process_with_a_shell
B606    start_process_with_no_shell
B607    start_process_with_partial_path
B608    hardcoded_sql_expressions
B609    linux_commands_wildcard_injection
B610    django_extra_used
B611    django_rawsql_used
B701    jinja2_autoescape_false
B702    use_of_mako_templates
B703    django_mark_safe
"""

