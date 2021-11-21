import configparser
import logging
import connexion
import sys
from datetime import datetime
import hashlib
import json

from werkzeug.security import generate_password_hash, check_password_hash

from flask import current_app, request

from src.utils import add_candidate, add_vote, get_from

from orm import Candidate, Vote, db
import errors
import os

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

ELECTOR_DB = "http://localhost:42424/"

def initialise():
    date_time_obj = datetime.strptime(current_app.config["DEADLINE"], '%d/%m/%Y %H:%M:%S')
    logging.info("- Service: Elections will end at: " + str(date_time_obj))
    current_app.config["DEADLINE"] = date_time_obj

    if not Candidate.query.all():
        logging.info("- Service: Initialising Candidates...")
        add_candidate("2", "The Party")
        add_candidate("3", "The Other Party")
        logging.info("- Service: Candidates Initialized")

    if not Vote.query.all():
        logging.info("- Service: Initialising Votes...")
        add_vote("2","1")
        add_vote("3","1")
        add_vote("4","2")
        logging.info("- Service: Votes Initialized")

def results():
    with current_app.app_context():
        deadline = current_app.config["DEADLINE"] 


    if deadline > datetime.now():
        return errors.Error400("Elections in Progress").get()

    candidates = Candidate.query.all()  # get all the candidates    
    votes = Vote.query.all()  # get all the votes
    results = {}
    for c in candidates:
        results[c.id] = 0
    print(results)
    for v in votes:
        results[v.candidate_id] += 1
    
    return results,200

def candidate(id):
    candidate = Candidate.query.filter_by(id=id).first()
    if not candidate:  
        return errors.Error404("Candidate not found").get()
    return get_from(ELECTOR_DB+"electors/"+str(candidate.dni))
    

def candidates():
    candidates = Candidate.query.all()  # get all the candidates    
    results = []
    for c in candidates:
        try:
            results.append(candidate(c.id))
        except:
            return errors.Error500().get()
    return results,200

def vote():
    with current_app.app_context():
        deadline = current_app.config["DEADLINE"] 

    if deadline <= datetime.now():
        return errors.Error400("Elections Terminated").get()

    req = request.json

    #get candidate with candidate_id
    candidate = Candidate.query.filter_by(id=req["candidate_id"]).first()
    if not candidate:  
        return errors.Error404("Candidate not found").get()

    _,status = get_from(ELECTOR_DB+"electors/"+str(req["elector_id"]))
    if status == 404:
        return errors.Error404("Elector not found").get()

    #check if elector has already voted
    votes = Vote.query.all()
    for v in votes:
        if check_password_hash(v.elector_id,req["elector_id"]):
            return errors.Error400("Bad Request").get() 

    if add_vote(req["elector_id"],req["candidate_id"]) is not None:
        return {},201
    else:
        return errors.Error400("Bad Request").get() 

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

def create_app(configuration=None):
    logging.basicConfig(level=logging.INFO)

    app = connexion.App(__name__)
    app.add_api('./swagger.yaml')
    # set the WSGI application callable to allow using uWSGI:
    # uwsgi --http :8080 -w app
    application = app.app

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
            ssl_context='adhoc'
            )

"""
B104    hardcoded_bind_all_interfaces
B105    hardcoded_password_string
B106    hardcoded_password_funcarg
B107    hardcoded_password_default
B110    try_except_pass
B201    flask_debug_true

PASSWORD IN CHIARO NOT DETECTED

B101    assert_used
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

